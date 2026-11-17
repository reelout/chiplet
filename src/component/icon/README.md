# Simplify SVG files

Install picosvg:

```sh
python3 -m pip install picosvg
```

From the repository root, write simplified copies to a separate directory so the originals remain unchanged:

```sh
mkdir -p "$TMPDIR/chiplet-icons"
for svg in src/component/icon/set/*.svg; do
  python3 -m picosvg.picosvg "$svg" --output_file "$TMPDIR/chiplet-icons/$(basename "$svg")" || exit 1
done
```

Review the generated files before replacing any source icons.
