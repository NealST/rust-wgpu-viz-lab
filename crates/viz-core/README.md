# viz-core

Rust + wgpu data visualization core, compiled to WebAssembly.

## Prerequisites

- [Rust toolchain](https://rustup.rs/)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)

```bash
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

## Build

Build the crate as a wasm package targeting the web:

```bash
wasm-pack build --target web --out-dir ../../frontend/public/wasm
```

This outputs the compiled `.wasm` file and JS glue code to `frontend/public/wasm/`, making it directly importable from the frontend application.

## Development

```bash
# Build in dev mode (faster compilation, larger output)
wasm-pack build --target web --dev --out-dir ../../frontend/public/wasm
```
