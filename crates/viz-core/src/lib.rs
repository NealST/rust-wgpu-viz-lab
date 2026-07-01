use wasm_bindgen::prelude::*;

mod gpu;
mod line_chart;
mod particles;
mod triangle;

#[wasm_bindgen(start)]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
pub async fn run_triangle(canvas_id: &str) -> Result<(), JsValue> {
    triangle::run(canvas_id).await
}

#[wasm_bindgen]
pub async fn run_line_chart(canvas_id: &str) -> Result<(), JsValue> {
    line_chart::run(canvas_id).await
}

#[wasm_bindgen]
pub async fn run_particles(canvas_id: &str) -> Result<(), JsValue> {
    particles::run(canvas_id).await
}
