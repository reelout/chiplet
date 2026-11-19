import {
  AggregationTemporality,
  BasicTracerProvider,
  ConsoleLogRecordExporter,
  ConsoleMetricExporter,
  ConsoleSpanExporter,
  InMemoryLogRecordExporter,
  InMemoryMetricExporter,
  InMemorySpanExporter,
  logger,
  LoggerProvider,
  MeterProvider,
  OTLPLogExporter,
  OTLPMetricExporter,
  OTLPTraceExporter,
  PeriodicExportingMetricReader,
  resourceFromAttributes,
  SimpleLogRecordProcessor,
  SimpleSpanProcessor,
  SpanStatusCode,
} from '#infra'
import type { BatchLogRecordProcessorOptions } from '@opentelemetry/sdk-logs'
import type { BufferConfig, SpanExporter } from '@opentelemetry/sdk-trace-web'
import type { Writable } from 'type-fest'
import { afterEach, beforeAll, beforeEach, expect, test, vi } from 'vitest'

vi.mock(import('@opentelemetry/sdk-logs'), async (importActual) => {
  const actual = await importActual()
  const { BatchLogRecordProcessor } = actual

  return {
    ...actual,
    BatchLogRecordProcessor: class MockBatchLogRecordProcessor extends BatchLogRecordProcessor {
      constructor(options: BatchLogRecordProcessorOptions) {
        super({
          ...options,
          maxExportBatchSize: 1,
        })
      }
    },
  }
})

vi.mock(import('@opentelemetry/sdk-trace-web'), async (importActual) => {
  const actual = await importActual()
  const { BatchSpanProcessor } = actual

  return {
    ...actual,
    BatchSpanProcessor: class MockBatchSpanProcessor extends BatchSpanProcessor {
      constructor(exporter: SpanExporter, config?: BufferConfig) {
        super(exporter, {
          ...config,
          maxExportBatchSize: 1,
        })
      }
    },
  }
})

let loggerExporter: InMemoryLogRecordExporter
let tracerExporter: InMemorySpanExporter
let meterExporter: InMemoryMetricExporter

beforeAll(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
})

beforeEach(async () => {
  loggerExporter = new InMemoryLogRecordExporter()
  tracerExporter = new InMemorySpanExporter()
  meterExporter = new InMemoryMetricExporter(AggregationTemporality.DELTA)

  await logger.configure({
    logProcessors: [new SimpleLogRecordProcessor({ exporter: loggerExporter })],
    traceProcessors: [new SimpleSpanProcessor(tracerExporter)],
    metricReaders: [
      new PeriodicExportingMetricReader({ exporter: meterExporter }),
    ],
    resource: resourceFromAttributes({ bar: 'baz' }),
    attributes: { foo: 'bar' },
  })
})

afterEach(async () => {
  logger.dispose()
  await vi.runAllTimersAsync()
})

test('logger - exports a record for every severity', () => {
  logger.trace('Trace', 'Detail trace message')
  logger.debug('Debug', 'Detail debug message')
  logger.info('Info', 'Detail info message')
  logger.warn('Warn', 'Detail warn message')
  logger.error('Error')
  logger.error('Error', 'Detail error message')
  logger.error('Error', new Error('Detail error message'))
  logger.fatal(
    'Fatal',
    new Error('Detail fatal message', {
      cause: new Error('Root cause of fatal error'),
    })
  )

  expect(loggerExporter.getFinishedLogRecords()).toEqual([
    expect.objectContaining({
      eventName: 'Trace',
      severityText: 'TRACE',
      body: 'Detail trace message',
    }),
    expect.objectContaining({
      eventName: 'Debug',
      severityText: 'DEBUG',
      body: 'Detail debug message',
    }),
    expect.objectContaining({
      eventName: 'Info',
      severityText: 'INFO',
      body: 'Detail info message',
    }),
    expect.objectContaining({
      eventName: 'Warn',
      severityText: 'WARN',
      body: 'Detail warn message',
    }),
    expect.objectContaining({
      eventName: 'Error',
      severityText: 'ERROR',
      body: undefined,
    }),
    expect.objectContaining({
      eventName: 'Error',
      severityText: 'ERROR',
      body: {
        'exception.message': 'Detail error message',
      },
    }),
    expect.objectContaining({
      eventName: 'Error',
      severityText: 'ERROR',
      body: {
        'exception.type': 'Error',
        'exception.message': 'Detail error message',
        'exception.stacktrace': expect.any(String),
      },
    }),
    expect.objectContaining({
      eventName: 'Fatal',
      severityText: 'FATAL',
      body: {
        'exception.type': 'Error',
        'exception.message': 'Detail fatal message',
        'exception.stacktrace': expect.any(String),
        'exception.cause': expect.stringContaining('Root cause of fatal error'),
      },
    }),
  ])
})

test('logger - serializes circular error causes', () => {
  const error1 = new Error('Circular error 1')
  const error2 = new Error('Circular error 2', { cause: error1 })

  error1.cause = error2

  logger.error('Error', error1)

  expect(loggerExporter.getFinishedLogRecords()).toEqual([
    expect.objectContaining({
      eventName: 'Error',
      severityText: 'ERROR',
      body: {
        'exception.type': 'Error',
        'exception.message': 'Circular error 1',
        'exception.stacktrace': expect.any(String),
        'exception.cause': expect.stringContaining('Circular error 2'),
      },
    }),
  ])
})

test('tracer - records parallel spans on independent traces', async () => {
  const spy1 = async () => {
    const span = logger.span('spy1')
    await new Promise((resolve) => setTimeout(resolve, 100))
    span.setStatus({ code: SpanStatusCode.OK }).end()
  }
  const spy2 = async () => {
    const span = logger.span('spy2')
    await new Promise((resolve) => setTimeout(resolve, 200))
    const err = new Error('Test error')
    span.recordException(err)
    span.setStatus({ code: SpanStatusCode.ERROR }).end()
    throw err
  }
  const spy3 = async () => {
    const span = logger.span('spy3')
    try {
      await Promise.all([spy1(), spy2()])
      span.setStatus({ code: SpanStatusCode.OK }).end()
    } catch (err) {
      span.setStatus({ code: SpanStatusCode.ERROR }).end()
      throw err
    }
  }

  await Promise.all([
    expect(spy3()).rejects.toThrow('Test error'),
    vi.runOnlyPendingTimersAsync(),
  ])

  const traceId = tracerExporter.getFinishedSpans()[0]?.spanContext().traceId

  expect(tracerExporter.getFinishedSpans()).toEqual([
    expect.objectContaining({
      _spanContext: expect.objectContaining({ traceId }),
      parentSpanContext: undefined,
      name: 'spy1',
      status: { code: 1 },
    }),
    expect.objectContaining({
      _spanContext: expect.objectContaining({
        traceId: expect.not.toBeOneOf([traceId]),
      }),
      parentSpanContext: undefined,
      name: 'spy2',
      status: { code: 2 },
      events: [
        expect.objectContaining({
          name: 'exception',
          attributes: expect.objectContaining({
            'exception.type': 'Error',
            'exception.message': 'Test error',
          }),
        }),
      ],
    }),
    expect.objectContaining({
      _spanContext: expect.objectContaining({
        traceId: expect.not.toBeOneOf([traceId]),
      }),
      parentSpanContext: undefined,
      name: 'spy3',
      status: { code: 2 },
      events: [],
    }),
  ])
})

test('tracer - records nested spans with parent contexts', async () => {
  const spy1 = logger.span('spy1', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100))
  })
  const spy2 = logger.span('spy2', async () => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    throw new Error('Test error')
  })
  const spy3 = logger.span('spy3', async () => {
    await Promise.all([spy1(), spy2()])
  })
  const spy4 = logger.span('spy4', async () => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    throw 'Test error string'
  })
  const spy5 = logger.span('spy5', async () => {
    await spy4()
  })

  await Promise.all([
    expect(spy3()).rejects.toThrow('Test error'),
    expect(spy5()).rejects.toBe('Test error string'),
    vi.runOnlyPendingTimersAsync(),
  ])

  const traceId1 = tracerExporter.getFinishedSpans()[0]?.spanContext().traceId
  const traceId2 = tracerExporter.getFinishedSpans()[3]?.spanContext().traceId

  expect(traceId1).not.toBe(traceId2)

  expect(tracerExporter.getFinishedSpans()).toEqual([
    expect.objectContaining({
      _spanContext: expect.objectContaining({ traceId: traceId1 }),
      parentSpanContext: expect.objectContaining({ traceId: traceId1 }),
      name: 'spy1',
      status: { code: 1 },
      attributes: expect.objectContaining({ duration: 100 }),
      events: [],
    }),
    expect.objectContaining({
      _spanContext: expect.objectContaining({ traceId: traceId1 }),
      parentSpanContext: expect.objectContaining({ traceId: traceId1 }),
      name: 'spy2',
      status: { code: 2 },
      attributes: expect.objectContaining({ duration: 200 }),
      events: [
        expect.objectContaining({
          name: 'exception',
          attributes: expect.objectContaining({
            'exception.type': 'Error',
            'exception.message': 'Test error',
            'exception.stacktrace': expect.any(String),
          }),
        }),
      ],
    }),
    expect.objectContaining({
      _spanContext: expect.objectContaining({ traceId: traceId1 }),
      parentSpanContext: undefined,
      name: 'spy3',
      status: { code: 2 },
      attributes: expect.objectContaining({ duration: 200 }),
      events: [
        expect.objectContaining({
          name: 'exception',
          attributes: {
            'exception.type': 'Error',
            'exception.message': 'Test error',
            'exception.stacktrace': expect.any(String),
          },
        }),
      ],
    }),
    expect.objectContaining({
      _spanContext: expect.objectContaining({ traceId: traceId2 }),
      parentSpanContext: expect.objectContaining({ traceId: traceId2 }),
      name: 'spy4',
      status: { code: 2 },
      attributes: expect.objectContaining({ duration: 300 }),
      events: [
        expect.objectContaining({
          name: 'exception',
          attributes: {
            'exception.message': 'Test error string',
          },
        }),
      ],
    }),
    expect.objectContaining({
      _spanContext: expect.objectContaining({ traceId: traceId2 }),
      parentSpanContext: undefined,
      name: 'spy5',
      status: { code: 2 },
      attributes: expect.objectContaining({ duration: 300 }),
      events: [
        expect.objectContaining({
          name: 'exception',
          attributes: {
            'exception.message': 'Test error string',
          },
        }),
      ],
    }),
  ])
})

test('meter - records the latest value per name and unit', async () => {
  logger.metric('metric1', 10)
  logger.metric('metric1', 11)
  logger.metric('metric1', 12).record(13).record(14)

  logger.metric('metric2', 20, { unit: 'hour' })
  logger.metric('metric2', 21, { unit: 'hour' })
  logger.metric('metric2', 22, { unit: 'hour' }).record(23).record(24)

  logger.metric('metric3', 30, { unit: 'hour' })
  logger.metric('metric3', 31, { unit: 'hour' })
  logger.metric('metric3', 32, { unit: 'day' }).record(33).record(34)

  await vi.runOnlyPendingTimersAsync()

  logger.metric('metric1', 100)
  logger.metric('metric2', 200, { unit: 'hour' })
  logger.metric('metric3', 300, { unit: 'hour' })

  await vi.runOnlyPendingTimersAsync()

  expect(meterExporter.getMetrics().length).toBe(2)
  expect(meterExporter.getMetrics()[0]?.scopeMetrics.length).toBe(1)
  expect(meterExporter.getMetrics()[0]?.scopeMetrics[0]?.metrics.length).toBe(4)
  expect(meterExporter.getMetrics()[1]?.scopeMetrics.length).toBe(1)
  expect(meterExporter.getMetrics()[1]?.scopeMetrics[0]?.metrics.length).toBe(3)

  expect(meterExporter.getMetrics()[0]?.scopeMetrics[0]?.metrics).toEqual([
    expect.objectContaining({
      descriptor: expect.objectContaining({ name: 'metric1', unit: '' }),
      dataPoints: [expect.objectContaining({ value: 14 })],
    }),
    expect.objectContaining({
      descriptor: expect.objectContaining({ name: 'metric2', unit: 'hour' }),
      dataPoints: [expect.objectContaining({ value: 24 })],
    }),
    expect.objectContaining({
      descriptor: expect.objectContaining({ name: 'metric3', unit: 'hour' }),
      dataPoints: [expect.objectContaining({ value: 31 })],
    }),
    expect.objectContaining({
      descriptor: expect.objectContaining({ name: 'metric3', unit: 'day' }),
      dataPoints: [expect.objectContaining({ value: 34 })],
    }),
  ])

  expect(meterExporter.getMetrics()[1]?.scopeMetrics[0]?.metrics).toEqual([
    expect.objectContaining({
      descriptor: expect.objectContaining({ name: 'metric1', unit: '' }),
      dataPoints: [expect.objectContaining({ value: 100 })],
    }),
    expect.objectContaining({
      descriptor: expect.objectContaining({ name: 'metric2', unit: 'hour' }),
      dataPoints: [expect.objectContaining({ value: 200 })],
    }),
    expect.objectContaining({
      descriptor: expect.objectContaining({ name: 'metric3', unit: 'hour' }),
      dataPoints: [expect.objectContaining({ value: 300 })],
    }),
  ])
})

test('logger - attaches the configured attributes and resource to records', () => {
  logger.info('TestLogger1')

  expect(loggerExporter.getFinishedLogRecords()).toHaveLength(1)

  logger.warn('TestLogger2')

  expect(loggerExporter.getFinishedLogRecords()).toEqual([
    expect.objectContaining({
      eventName: 'TestLogger1',
      severityText: 'INFO',
      attributes: { foo: 'bar' },
      resource: expect.objectContaining({
        _rawAttributes: expect.arrayContaining([
          ['bar', 'baz'],
          ['service.instance.id', expect.stringMatching(/^[0-9a-z-]{36}$/)],
        ]),
      }),
    }),
    expect.objectContaining({
      eventName: 'TestLogger2',
      severityText: 'WARN',
      attributes: { foo: 'bar' },
      resource: expect.objectContaining({
        _rawAttributes: expect.arrayContaining([
          ['bar', 'baz'],
          ['service.instance.id', expect.stringMatching(/^[0-9a-z-]{36}$/)],
        ]),
      }),
    }),
  ])
})

test('tracer - attaches the configured attributes and resource to spans', () => {
  logger.span('Test span 1').end()

  expect(tracerExporter.getFinishedSpans()).toHaveLength(1)

  logger.span('Test span 2').setStatus({ code: SpanStatusCode.ERROR }).end()

  expect(tracerExporter.getFinishedSpans()).toEqual([
    expect.objectContaining({
      name: 'Test span 1',
      status: { code: SpanStatusCode.UNSET },
      attributes: { foo: 'bar' },
      resource: expect.objectContaining({
        _rawAttributes: expect.arrayContaining([
          ['bar', 'baz'],
          ['service.instance.id', expect.stringMatching(/^[0-9a-z-]{36}$/)],
        ]),
      }),
    }),
    expect.objectContaining({
      name: 'Test span 2',
      status: { code: SpanStatusCode.ERROR },
      attributes: { foo: 'bar' },
      resource: expect.objectContaining({
        _rawAttributes: expect.arrayContaining([
          ['bar', 'baz'],
          ['service.instance.id', expect.stringMatching(/^[0-9a-z-]{36}$/)],
        ]),
      }),
    }),
  ])
})

test('meter - attaches the configured attributes and resource to metrics', async () => {
  logger.metric('metric1', 10)

  expect(meterExporter.getMetrics()).toHaveLength(0)

  logger.metric('metric2', 20)

  expect(meterExporter.getMetrics()).toHaveLength(0)

  await vi.runOnlyPendingTimersAsync()

  expect(meterExporter.getMetrics()).toEqual([
    {
      resource: expect.objectContaining({
        _rawAttributes: expect.arrayContaining([
          ['bar', 'baz'],
          ['service.instance.id', expect.stringMatching(/^[0-9a-z-]{36}$/)],
        ]),
      }),
      scopeMetrics: [
        expect.objectContaining({
          metrics: [
            expect.objectContaining({
              descriptor: expect.objectContaining({
                name: 'metric1',
              }),
              dataPoints: [
                expect.objectContaining({
                  attributes: { foo: 'bar' },
                  value: 10,
                }),
              ],
            }),
            expect.objectContaining({
              descriptor: expect.objectContaining({
                name: 'metric2',
              }),
              dataPoints: [
                expect.objectContaining({
                  attributes: { foo: 'bar' },
                  value: 20,
                }),
              ],
            }),
          ],
        }),
      ],
    },
  ])
})

test('collector - exports every signal to the configured collector', async () => {
  await logger.dispose()

  using spy1 = vi.spyOn(OTLPLogExporter.prototype, 'export').mockReturnValue()
  using spy2 = vi.spyOn(OTLPTraceExporter.prototype, 'export').mockReturnValue()
  using spy3 = vi
    .spyOn(OTLPMetricExporter.prototype, 'export')
    .mockReturnValue()

  await logger.configure({
    collector: {
      url: 'http://localhost/collector',
      headers: { 'x-request-id': 'test' },
    },
  })

  logger.info('logger')
  logger.span('tracer').end()
  logger.metric('metric', 10)
  logger.dispose()

  await vi.runOnlyPendingTimersAsync()

  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(spy3).toHaveBeenCalledTimes(1)
})

test('console - wires the console exporters when debug is enabled', async () => {
  await logger.dispose()

  using spy1 = vi.spyOn(ConsoleLogRecordExporter.prototype, 'export')
  using spy2 = vi.spyOn(ConsoleSpanExporter.prototype, 'export')
  using spy3 = vi.spyOn(ConsoleMetricExporter.prototype, 'export')
  using spy4 = vi.spyOn(console, 'dir').mockReturnValue()

  await logger.configure({ debug: true })

  logger.info('logger')
  logger.span('tracer').end()
  logger.metric('meter', 10)
  logger.dispose()

  await vi.runOnlyPendingTimersAsync()

  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(spy3).toHaveBeenCalledTimes(1)
  expect(spy4).toHaveBeenCalledTimes(3)
  expect(spy4).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ eventName: 'logger' }),
    { depth: 3 }
  )
  expect(spy4).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ name: 'tracer' }),
    { depth: 3 }
  )
  expect(spy4).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({
      descriptor: expect.objectContaining({ name: 'meter' }),
      dataPoints: [expect.objectContaining({ value: 10 })],
    }),
    { depth: null }
  )
})

test('logger - flushes every provider when the document becomes hidden', async () => {
  await logger.dispose()

  using spy1 = vi.spyOn(LoggerProvider.prototype, 'forceFlush')
  using spy2 = vi.spyOn(BasicTracerProvider.prototype, 'forceFlush')
  using spy3 = vi.spyOn(MeterProvider.prototype, 'forceFlush')

  expect(globalThis.document).toBeUndefined()

  const doc = (globalThis.document = new EventTarget() as Writable<Document>)
  doc.visibilityState = 'visible'

  await logger.configure()
  expect(spy1).toHaveBeenCalledTimes(0)
  expect(spy2).toHaveBeenCalledTimes(0)
  expect(spy3).toHaveBeenCalledTimes(0)

  // Arrange
  doc.visibilityState = 'visible'
  doc.dispatchEvent(new Event('visibilitychange'))
  // Assert
  expect(spy1).toHaveBeenCalledTimes(0)
  expect(spy2).toHaveBeenCalledTimes(0)
  expect(spy3).toHaveBeenCalledTimes(0)

  doc.visibilityState = 'hidden'
  doc.dispatchEvent(new Event('visibilitychange'))
  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(spy3).toHaveBeenCalledTimes(1)

  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: undefined,
  })
})
