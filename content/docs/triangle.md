# Colored Triangle

The classic "hello world" of GPU programming — a single triangle with per-vertex colors interpolated by the rasterizer.

## What This Demo Covers

- Creating a **vertex buffer** with position + color attributes
- Writing a minimal **WGSL shader** pair (vertex + fragment)
- Building a **render pipeline** and issuing a single draw call

## Vertex Data

Each vertex carries a 2D position and an RGB color:

```rust
#[repr(C)]
struct Vertex {
    position: [f32; 2],
    color: [f32; 3],
}
```

The three vertices are placed in clip space (`[-1, 1]`), so no projection matrix is needed:

| Vertex | Position | Color |
|--------|----------|-------|
| Top | (0.0, 0.5) | Red |
| Bottom-left | (-0.5, -0.5) | Green |
| Bottom-right | (0.5, -0.5) | Blue |

## The Shader

The vertex shader passes position and color through; the fragment shader outputs the interpolated color directly:

```wgsl
@vertex
fn vs_main(in: VertexInput) -> VertexOutput {
    var out: VertexOutput;
    out.clip_position = vec4<f32>(in.position, 0.0, 1.0);
    out.color = in.color;
    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    return vec4<f32>(in.color, 1.0);
}
```

The GPU's rasterizer automatically interpolates `color` across the triangle face, producing the smooth gradient you see.

## Render Pipeline

Key settings:

- **Topology**: `TriangleList` — every 3 vertices form one triangle
- **Blend**: `REPLACE` — no transparency
- **Vertex buffer layout**: stride = 20 bytes (2×f32 position + 3×f32 color)

## Key Takeaway

This demo demonstrates the minimal wgpu setup: one buffer, one shader, one pipeline, one draw call. Every more complex visualization builds on this foundation.
