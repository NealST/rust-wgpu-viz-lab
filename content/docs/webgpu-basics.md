# WebGPU Basics

## What is WebGPU?

WebGPU is a modern graphics API that provides low-level access to GPU hardware from web applications. It is the successor to WebGL and offers:

- **Compute shaders** — general-purpose GPU computing
- **Better performance** — reduced driver overhead
- **Modern API design** — inspired by Vulkan, Metal, and Direct3D 12

## How wgpu Works

`wgpu` is a Rust implementation of the WebGPU standard that can target:

- Native platforms (via Vulkan, Metal, DX12)
- Web browsers (via the WebGPU API)

This dual-target capability means we can develop and test locally on native, then compile to WebAssembly for the browser.

## The Rendering Pipeline

1. **Instance** — entry point to the GPU API
2. **Adapter** — represents a physical GPU
3. **Device** — logical connection to the GPU
4. **Surface** — the canvas we render to
5. **Render Pipeline** — defines how vertices are processed and pixels are drawn

## Example: Clear Color

The simplest WebGPU operation is clearing the screen to a solid color:

```rust
let _render_pass = encoder.begin_render_pass(&wgpu::RenderPassDescriptor {
    color_attachments: &[Some(wgpu::RenderPassColorAttachment {
        ops: wgpu::Operations {
            load: wgpu::LoadOp::Clear(wgpu::Color {
                r: 0.1, g: 0.2, b: 0.3, a: 1.0,
            }),
            store: wgpu::StoreOp::Store,
        },
        ..
    })],
    ..
});
```

This is exactly what our initial `init_wgpu` function does — it proves the pipeline works end-to-end.
