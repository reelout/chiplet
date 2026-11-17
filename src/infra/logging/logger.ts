import { PERSISTENT_GLOBALLY_UNIQUE_IDENTIFIER, UUID } from '#util'
import {
  metrics,
  SpanStatusCode,
  trace,
  type Attributes,
  type MetricOptions,
  type Span,
} from '@opentelemetry/api'
import {
  logs,
  SeverityNumber,
  type LogAttributes,
  type LogBody,
} from '@opentelemetry/api-logs'
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { LongTaskInstrumentation } from '@opentelemetry/instrumentation-long-task'
import { ExceptionInstrumentation } from '@opentelemetry/instrumentation-web-exception'
import { browserDetector } from '@opentelemetry/opentelemetry-browser-detector'
import {
  defaultResource,
  detectResources,
  envDetector,
  resourceFromAttributes,
  type Resource,
} from '@opentelemetry/resources'
import {
  BatchLogRecordProcessor,
  ConsoleLogRecordExporter,
  LoggerProvider,
  SimpleLogRecordProcessor,
  type LogRecordProcessor,
} from '@opentelemetry/sdk-logs'
import {
  ConsoleMetricExporter,
  MeterProvider,
  PeriodicExportingMetricReader,
  type IMetricReader,
} from '@opentelemetry/sdk-metrics'
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  WebTracerProvider,
  type SpanProcessor,
} from '@opentelemetry/sdk-trace-web'
import {
  ATTR_EXCEPTION_MESSAGE,
  ATTR_EXCEPTION_STACKTRACE,
  ATTR_EXCEPTION_TYPE,
  ATTR_SERVICE_INSTANCE_ID,
} from '@opentelemetry/semantic-conventions/incubating'
import { compact, isError } from 'lodash-es'

export {
  SpanStatusCode,
  type Attributes,
  type AttributeValue,
} from '@opentelemetry/api'
export { SeverityNumber } from '@opentelemetry/api-logs'
export { resourceFromAttributes } from '@opentelemetry/resources'
export * from '@opentelemetry/semantic-conventions'

export { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
export { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
export { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'

export {
  BatchLogRecordProcessor,
  ConsoleLogRecordExporter,
  InMemoryLogRecordExporter,
  LoggerProvider,
  SimpleLogRecordProcessor,
} from '@opentelemetry/sdk-logs'

export {
  AggregationTemporality,
  ConsoleMetricExporter,
  InMemoryMetricExporter,
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics'

export {
  BasicTracerProvider,
  BatchSpanProcessor,
  ConsoleSpanExporter,
  InMemorySpanExporter,
  SimpleSpanProcessor,
  WebTracerProvider,
} from '@opentelemetry/sdk-trace-web'

export const ATTR_EXCEPTION_CAUSE = 'exception.cause'

export interface CollectorOptions {
  url: string
  headers?: Record<string, string> | undefined
}

class Logger {
  #loggerProvider: LoggerProvider | undefined

  #tracerProvider: WebTracerProvider | undefined

  #meterProvider: MeterProvider | undefined

  #unregister: (() => void) | undefined

  #name = globalThis.origin || PERSISTENT_GLOBALLY_UNIQUE_IDENTIFIER

  #logger = logs.getLogger(this.#name)

  #tracer = trace.getTracer(this.#name)

  #meter = metrics.getMeter(this.#name)

  #attributes: LogAttributes = {}

  async configure(config?: {
    debug?: boolean | undefined
    collector?: CollectorOptions | undefined
    logProcessors?: readonly LogRecordProcessor[] | undefined
    traceProcessors?: readonly SpanProcessor[] | undefined
    metricReaders?: readonly IMetricReader[] | undefined
    resource?: Resource | undefined
    attributes?: LogAttributes | undefined
  }) {
    await this.dispose()

    const isDev = process.env.NODE_ENV !== 'production'

    const resource = defaultResource()
      .merge(detectResources({ detectors: [browserDetector, envDetector] }))
      .merge(resourceFromAttributes({ [ATTR_SERVICE_INSTANCE_ID]: UUID() }))
      .merge(resourceFromAttributes({ 'env': process.env.NODE_ENV }))
      .merge(config?.resource ?? null)

    await resource.waitForAsyncAttributes?.()

    this.#loggerProvider = new LoggerProvider({
      resource,
      processors: compact<LogRecordProcessor>([
        ...(config?.logProcessors ?? []),
        config?.collector
          ? new BatchLogRecordProcessor({
              exporter: new OTLPLogExporter({
                url: config.collector.url,
                headers: { ...config.collector.headers },
              }),
            })
          : null,
        config?.debug && isDev
          ? new SimpleLogRecordProcessor({
              exporter: new ConsoleLogRecordExporter(),
            })
          : null,
      ]),
    })

    this.#tracerProvider = new WebTracerProvider({
      resource,
      spanProcessors: compact<SpanProcessor>([
        ...(config?.traceProcessors ?? []),
        config?.collector
          ? new BatchSpanProcessor(
              new OTLPTraceExporter({
                url: config.collector.url,
                headers: { ...config.collector.headers },
              })
            )
          : null,
        config?.debug && isDev
          ? new SimpleSpanProcessor(new ConsoleSpanExporter())
          : null,
      ]),
    })

    this.#meterProvider = new MeterProvider({
      resource,
      readers: compact<IMetricReader>([
        ...(config?.metricReaders ?? []),
        config?.collector
          ? new PeriodicExportingMetricReader({
              exporter: new OTLPMetricExporter({
                url: config.collector.url,
                headers: { ...config.collector.headers },
              }),
            })
          : null,
        config?.debug && isDev
          ? new PeriodicExportingMetricReader({
              exporter: new ConsoleMetricExporter(),
            })
          : null,
      ]),
    })

    logs.setGlobalLoggerProvider(this.#loggerProvider)

    trace.setGlobalTracerProvider(this.#tracerProvider)

    metrics.setGlobalMeterProvider(this.#meterProvider)

    this.#tracerProvider.register()

    /* istanbul ignore next */
    if (typeof window !== 'undefined') {
      this.#unregister = registerInstrumentations({
        instrumentations: [
          getWebAutoInstrumentations(),
          new ExceptionInstrumentation(),
          new LongTaskInstrumentation(),
        ],
      })
    }

    this.#logger = logs.getLogger(this.#name)

    this.#tracer = trace.getTracer(this.#name)

    this.#meter = metrics.getMeter(this.#name)

    this.#attributes = { ...this.#attributes, ...config?.attributes }

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.#onVisibilityChange)
    }
  }

  async dispose() {
    await Promise.all([
      this.#loggerProvider?.shutdown(),
      this.#meterProvider?.shutdown(),
      this.#tracerProvider?.shutdown(),
    ])

    logs.disable()
    metrics.disable()
    trace.disable()

    this.#unregister?.()

    this.#unregister = undefined

    this.#loggerProvider = undefined

    this.#meterProvider = undefined

    this.#tracerProvider = undefined

    this.#logger = logs.getLogger(this.#name)

    this.#tracer = trace.getTracer(this.#name)

    this.#meter = metrics.getMeter(this.#name)

    this.#attributes = {}

    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.#onVisibilityChange)
    }
  }

  #onVisibilityChange = async () => {
    if (document.visibilityState === 'hidden') {
      await Promise.all([
        this.#loggerProvider?.forceFlush(),
        this.#meterProvider?.forceFlush(),
        this.#tracerProvider?.forceFlush(),
      ])
    }
  }

  //#region logger
  private collect(
    level: SeverityNumber,
    event: string,
    body?: LogBody,
    attributes?: LogAttributes
  ) {
    this.#logger.emit({
      eventName: event,
      severityNumber: level,
      severityText: SeverityNumber[level],
      body,
      attributes: {
        ...this.#attributes,
        ...attributes,
      },
    })
  }

  trace = (event: string, message?: string, attributes?: LogAttributes) => {
    this.collect(SeverityNumber.TRACE, event, message, attributes)
  }

  debug = (event: string, message?: string, attributes?: LogAttributes) => {
    this.collect(SeverityNumber.DEBUG, event, message, attributes)
  }

  info = (event: string, message?: string, attributes?: LogAttributes) => {
    this.collect(SeverityNumber.INFO, event, message, attributes)
  }

  warn = (event: string, message?: string, attributes?: LogAttributes) => {
    this.collect(SeverityNumber.WARN, event, message, attributes)
  }

  error = (
    event: string,
    error?: Error | string,
    attributes?: LogAttributes
  ) => {
    this.collect(
      SeverityNumber.ERROR,
      event,
      this.parseError(error),
      attributes
    )
  }

  fatal = (
    event: string,
    error?: Error | string,
    attributes?: LogAttributes
  ) => {
    this.collect(
      SeverityNumber.FATAL,
      event,
      this.parseError(error),
      attributes
    )
  }

  private parseError(error: unknown): LogAttributes | undefined {
    if (typeof error === 'string') {
      return {
        [ATTR_EXCEPTION_MESSAGE]: error,
      }
    }

    if (isError(error)) {
      const cause = this.parseError(error.cause)

      return {
        [ATTR_EXCEPTION_TYPE]: error.name,
        [ATTR_EXCEPTION_MESSAGE]: error.message,
        [ATTR_EXCEPTION_STACKTRACE]: error.stack,
        [ATTR_EXCEPTION_CAUSE]: cause && JSON.stringify(cause),
      }
    }

    return undefined
  }
  //#endregion

  //#region tracer
  span(name: string, attributes?: Attributes | undefined): Span

  span<T extends (...args: readonly never[]) => Promise<unknown>>(
    name: string,
    operation: T
  ): T

  span<T extends (...args: readonly never[]) => Promise<unknown>>(
    name: string,
    attributes?: Attributes | T
  ) {
    if (typeof attributes !== 'function') {
      return this.#tracer.startSpan(name, {
        attributes: {
          ...this.#attributes,
          ...attributes,
        },
      })
    }

    const operation = attributes

    return ((...args) => {
      return this.#tracer.startActiveSpan(name, async (span) => {
        const startTime = performance.now()
        let status = SpanStatusCode.OK

        try {
          return await operation(...args)
        } catch (err) {
          status = SpanStatusCode.ERROR

          /* istanbul ignore else */
          if (isError(err) || typeof err === 'string') span.recordException(err)

          throw err
        } finally {
          span
            .setStatus({ code: status })
            .setAttribute('duration', performance.now() - startTime)
            .end()
        }
      })
    }) as T
  }
  //#endregion

  //#region meter
  metric(
    name: string,
    value: number,
    options?: MetricOptions,
    attributes?: Attributes
  ) {
    const metric = this.#meter.createGauge(name, options)

    const record = (value: number): Metric => {
      metric.record(value, {
        ...this.#attributes,
        ...attributes,
      })

      return {
        record,
      }
    }

    return record(value)
  }
  //#endregion
}

interface Metric {
  record(value: number): Metric
}

export const logger = new Logger()
