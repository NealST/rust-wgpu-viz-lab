# 2D Line Chart

A data-driven line chart rendered entirely on the GPU, demonstrating how to visualize data series using wgpu's `LineStrip` primitive topology.

## What This Demo Covers

- Generating vertex data from a mathematical function (sine wave)
- Using **LineStrip topology** to draw connected line segments
- Rendering data series without any charting library

## Data Generation

The demo generates 200 points along a sine wave:

```rust
fn generate_sin_wave(num_points: usize) -> Vec<Vertex> {
    (0..num_points)
        .map(|i| {
            let t = i as f32 / (num_points - 1) as f32;
            let x = t * 2.0 - 1.0;  // [-1, 1]
            let y = (t * PI * 4.0).sin() * 0.5;
            Vertex { position: [x, y] }
        })
        .collect()
}
```

Each point maps `t ∈ [0, 1]` to x ∈ `[-1, 1]` (clip space), while y is the sine value scaled to half amplitude. The result is 4 complete sine cycles across the canvas.

## LineStrip Topology

Unlike `TriangleList`, the `LineStrip` topology connects each vertex to the next with a line segment. For N vertices, this produces N−1 connected segments — perfect for plotting continuous data.

```
Vertex 0 ——— Vertex 1 ——— Vertex 2 ——— ... ——— Vertex N-1
```

The pipeline configuration:

```rust
primitive: wgpu::PrimitiveState {
    topology: wgpu::PrimitiveTopology::LineStrip,
    ..Default::default()
},
```

## The Shader

The vertex shader is minimal — just pass-through positions. The fragment shader outputs a fixed green color for all line pixels.

## Extending This

In a real data visualization scenario, you would:

- Pass data via a **uniform buffer** or **storage buffer** instead of baking it into vertex data
- Add **axes, grid lines, and labels** (rendered as additional geometry or via a text overlay)
- Support **dynamic updates** by writing new data to the GPU buffer each frame
- Use a **projection matrix** to map data coordinates to clip space

## Key Takeaway

GPU-based line rendering is extremely fast — thousands of data points can be drawn in a single draw call with zero JavaScript overhead. This is the foundation for building high-performance charting with wgpu.
