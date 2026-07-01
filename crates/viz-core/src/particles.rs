use std::cell::RefCell;
use std::rc::Rc;
use wasm_bindgen::prelude::*;
use wgpu::util::DeviceExt;

use crate::gpu;

const NUM_PARTICLES: u32 = 1000;

#[repr(C)]
#[derive(Copy, Clone, bytemuck::Pod, bytemuck::Zeroable)]
struct Particle {
    position: [f32; 2],
    velocity: [f32; 2],
}

const COMPUTE_SHADER: &str = r#"
struct Particle {
    position: vec2<f32>,
    velocity: vec2<f32>,
};

@group(0) @binding(0) var<storage, read_write> particles: array<Particle>;

@compute @workgroup_size(64)
fn cs_main(@builtin(global_invocation_id) id: vec3<u32>) {
    let idx = id.x;
    if (idx >= arrayLength(&particles)) {
        return;
    }

    var p = particles[idx];
    p.position += p.velocity * 0.016;

    // Bounce off edges
    if (p.position.x > 1.0 || p.position.x < -1.0) {
        p.velocity.x = -p.velocity.x;
        p.position.x = clamp(p.position.x, -1.0, 1.0);
    }
    if (p.position.y > 1.0 || p.position.y < -1.0) {
        p.velocity.y = -p.velocity.y;
        p.position.y = clamp(p.position.y, -1.0, 1.0);
    }

    particles[idx] = p;
}
"#;

const RENDER_SHADER: &str = r#"
struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
};

struct Particle {
    position: vec2<f32>,
    velocity: vec2<f32>,
};

@group(0) @binding(0) var<storage, read> particles: array<Particle>;

@vertex
fn vs_main(@builtin(vertex_index) vertex_index: u32) -> VertexOutput {
    var out: VertexOutput;
    let p = particles[vertex_index];
    out.clip_position = vec4<f32>(p.position, 0.0, 1.0);
    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    return vec4<f32>(0.3, 0.6, 1.0, 1.0);
}
"#;

fn generate_particles() -> Vec<Particle> {
    let mut particles = Vec::with_capacity(NUM_PARTICLES as usize);
    for i in 0..NUM_PARTICLES {
        let angle = (i as f32 / NUM_PARTICLES as f32) * std::f32::consts::PI * 2.0;
        let radius = (i as f32 * 0.618033) % 0.8;
        particles.push(Particle {
            position: [angle.cos() * radius, angle.sin() * radius],
            velocity: [
                angle.sin() * 0.3 * ((i % 7) as f32 / 7.0 + 0.3),
                -angle.cos() * 0.3 * ((i % 11) as f32 / 11.0 + 0.3),
            ],
        });
    }
    particles
}

pub async fn run(canvas_id: &str) -> Result<(), JsValue> {
    let ctx = gpu::init_gpu(canvas_id).await?;

    let particles = generate_particles();

    let particle_buffer = ctx.device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
        label: Some("Particle Buffer"),
        contents: bytemuck::cast_slice(&particles),
        usage: wgpu::BufferUsages::STORAGE | wgpu::BufferUsages::VERTEX,
    });

    // Compute pipeline
    let compute_shader = ctx.device.create_shader_module(wgpu::ShaderModuleDescriptor {
        label: Some("Particle Compute Shader"),
        source: wgpu::ShaderSource::Wgsl(COMPUTE_SHADER.into()),
    });

    let compute_bind_group_layout =
        ctx.device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
            label: Some("Compute BGL"),
            entries: &[wgpu::BindGroupLayoutEntry {
                binding: 0,
                visibility: wgpu::ShaderStages::COMPUTE,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Storage { read_only: false },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            }],
        });

    let compute_pipeline_layout =
        ctx.device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
            label: Some("Compute Pipeline Layout"),
            bind_group_layouts: &[&compute_bind_group_layout],
            push_constant_ranges: &[],
        });

    let compute_pipeline = ctx.device.create_compute_pipeline(&wgpu::ComputePipelineDescriptor {
        label: Some("Particle Compute Pipeline"),
        layout: Some(&compute_pipeline_layout),
        module: &compute_shader,
        entry_point: Some("cs_main"),
        compilation_options: Default::default(),
        cache: None,
    });

    let compute_bind_group = ctx.device.create_bind_group(&wgpu::BindGroupDescriptor {
        label: Some("Compute Bind Group"),
        layout: &compute_bind_group_layout,
        entries: &[wgpu::BindGroupEntry {
            binding: 0,
            resource: particle_buffer.as_entire_binding(),
        }],
    });

    // Render pipeline
    let render_shader = ctx.device.create_shader_module(wgpu::ShaderModuleDescriptor {
        label: Some("Particle Render Shader"),
        source: wgpu::ShaderSource::Wgsl(RENDER_SHADER.into()),
    });

    let render_bind_group_layout =
        ctx.device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
            label: Some("Render BGL"),
            entries: &[wgpu::BindGroupLayoutEntry {
                binding: 0,
                visibility: wgpu::ShaderStages::VERTEX,
                ty: wgpu::BindingType::Buffer {
                    ty: wgpu::BufferBindingType::Storage { read_only: true },
                    has_dynamic_offset: false,
                    min_binding_size: None,
                },
                count: None,
            }],
        });

    let render_pipeline_layout =
        ctx.device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
            label: Some("Render Pipeline Layout"),
            bind_group_layouts: &[&render_bind_group_layout],
            push_constant_ranges: &[],
        });

    let render_pipeline = ctx.device.create_render_pipeline(&wgpu::RenderPipelineDescriptor {
        label: Some("Particle Render Pipeline"),
        layout: Some(&render_pipeline_layout),
        vertex: wgpu::VertexState {
            module: &render_shader,
            entry_point: Some("vs_main"),
            buffers: &[],
            compilation_options: Default::default(),
        },
        fragment: Some(wgpu::FragmentState {
            module: &render_shader,
            entry_point: Some("fs_main"),
            targets: &[Some(wgpu::ColorTargetState {
                format: ctx.config.format,
                blend: Some(wgpu::BlendState::ALPHA_BLENDING),
                write_mask: wgpu::ColorWrites::ALL,
            })],
            compilation_options: Default::default(),
        }),
        primitive: wgpu::PrimitiveState {
            topology: wgpu::PrimitiveTopology::PointList,
            ..Default::default()
        },
        depth_stencil: None,
        multisample: wgpu::MultisampleState::default(),
        multiview: None,
        cache: None,
    });

    let render_bind_group = ctx.device.create_bind_group(&wgpu::BindGroupDescriptor {
        label: Some("Render Bind Group"),
        layout: &render_bind_group_layout,
        entries: &[wgpu::BindGroupEntry {
            binding: 0,
            resource: particle_buffer.as_entire_binding(),
        }],
    });

    // Animation loop via requestAnimationFrame
    let f: Rc<RefCell<Option<Closure<dyn FnMut()>>>> = Rc::new(RefCell::new(None));
    let g = f.clone();

    let workgroup_count = (NUM_PARTICLES + 63) / 64;

    *g.borrow_mut() = Some(Closure::new(move || {
        let output = match ctx.surface.get_current_texture() {
            Ok(t) => t,
            Err(_) => return,
        };
        let view = output
            .texture
            .create_view(&wgpu::TextureViewDescriptor::default());

        let mut encoder =
            ctx.device
                .create_command_encoder(&wgpu::CommandEncoderDescriptor {
                    label: Some("Particle Frame Encoder"),
                });

        {
            let mut cpass = encoder.begin_compute_pass(&wgpu::ComputePassDescriptor {
                label: Some("Particle Compute Pass"),
                timestamp_writes: None,
            });
            cpass.set_pipeline(&compute_pipeline);
            cpass.set_bind_group(0, &compute_bind_group, &[]);
            cpass.dispatch_workgroups(workgroup_count, 1, 1);
        }

        {
            let mut rpass = encoder.begin_render_pass(&wgpu::RenderPassDescriptor {
                label: Some("Particle Render Pass"),
                color_attachments: &[Some(wgpu::RenderPassColorAttachment {
                    view: &view,
                    resolve_target: None,
                    ops: wgpu::Operations {
                        load: wgpu::LoadOp::Clear(wgpu::Color {
                            r: 0.02,
                            g: 0.02,
                            b: 0.05,
                            a: 1.0,
                        }),
                        store: wgpu::StoreOp::Store,
                    },
                })],
                depth_stencil_attachment: None,
                timestamp_writes: None,
                occlusion_query_set: None,
            });
            rpass.set_pipeline(&render_pipeline);
            rpass.set_bind_group(0, &render_bind_group, &[]);
            rpass.draw(0..NUM_PARTICLES, 0..1);
        }

        ctx.queue.submit(std::iter::once(encoder.finish()));
        output.present();

        // Schedule next frame
        let window = web_sys::window().unwrap();
        let _ = window.request_animation_frame(
            f.borrow().as_ref().unwrap().as_ref().unchecked_ref(),
        );
    }));

    let window = web_sys::window().ok_or_else(|| JsValue::from_str("No window"))?;
    let _ = window.request_animation_frame(
        g.borrow().as_ref().unwrap().as_ref().unchecked_ref(),
    );

    Ok(())
}
