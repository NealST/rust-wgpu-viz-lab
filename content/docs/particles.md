# Particle System

An animated particle simulation running entirely on the GPU. A compute shader updates particle positions each frame, and a render pass draws them as points.

## What This Demo Covers

- **Compute shaders** for GPU-side simulation
- **Storage buffers** shared between compute and render passes
- **Animation loop** with `requestAnimationFrame`

## Architecture

The particle system has two GPU passes per frame:

```
┌─────────────┐     ┌──────────────┐
│  Compute    │ ──▶ │   Render     │
│  Pass       │     │   Pass       │
│             │     │              │
│ Update pos  │     │ Draw points  │
│ + velocity  │     │ from buffer  │
└─────────────┘     └──────────────┘
       │                    │
       └────── shared ──────┘
          storage buffer
```

Both passes share the same `particle_buffer` — the compute pass writes updated positions, and the render pass reads them to position each point.

## Particle Data

Each particle has a position and velocity:

```rust
#[repr(C)]
struct Particle {
    position: [f32; 2],
    velocity: [f32; 2],
}
```

1000 particles are initialized in a spiral pattern with varied velocities.

## Compute Shader

The compute shader runs one thread per particle (workgroup size 64). Each thread:

1. Reads the particle's current state
2. Advances position by `velocity × dt`
3. Bounces off the `[-1, 1]` boundaries
4. Writes the updated state back

```wgsl
@compute @workgroup_size(64)
fn cs_main(@builtin(global_invocation_id) id: vec3<u32>) {
    var p = particles[id.x];
    p.position += p.velocity * 0.016;
    // ... boundary bounce logic ...
    particles[id.x] = p;
}
```

The `0.016` time step assumes ~60 FPS. A production system would pass the actual delta time via a uniform buffer.

## Render Shader

The render pass uses `PointList` topology — each vertex is drawn as a single pixel. The vertex shader reads particle positions from the storage buffer using `vertex_index`:

```wgsl
@vertex
fn vs_main(@builtin(vertex_index) i: u32) -> VertexOutput {
    out.clip_position = vec4<f32>(particles[i].position, 0.0, 1.0);
}
```

## Animation Loop

On the Rust/WASM side, `requestAnimationFrame` drives the loop:

```rust
let closure = Closure::new(move || {
    // 1. Compute pass: update particles
    // 2. Render pass: draw points
    // 3. Schedule next frame
    window.request_animation_frame(/* self */);
});
```

The closure captures all GPU resources (device, queue, pipelines, buffers) and re-uses them every frame — no per-frame allocation.

## Key Takeaway

Compute shaders unlock GPU-parallel simulation. The CPU submits commands once per frame, while the GPU does all the heavy lifting — updating 1000 particles and drawing them in under a millisecond.
