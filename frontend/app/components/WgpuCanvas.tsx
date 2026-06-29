import { useRef, useEffect, useState } from "react";

export function WgpuCanvas({
  canvasId = "wgpu-canvas",
  width = 800,
  height = 600,
}: {
  canvasId?: string;
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadWasm() {
      try {
        // Dynamically import the wasm glue module built by wasm-pack
        const wasm = await import("/wasm/viz_core.js");
        await wasm.default(); // Initialize the wasm module

        if (cancelled) return;

        // Call the exported init_wgpu function
        await wasm.init_wgpu(canvasId);
        setStatus("ready");
      } catch (err: any) {
        if (!cancelled) {
          console.error("Failed to initialize wgpu:", err);
          setErrorMsg(err?.message ?? String(err));
          setStatus("error");
        }
      }
    }

    loadWasm();

    return () => {
      cancelled = true;
    };
  }, [canvasId]);

  return (
    <div className="wgpu-canvas-container">
      <canvas
        id={canvasId}
        ref={canvasRef}
        width={width}
        height={height}
        style={{ border: "1px solid #333", borderRadius: 4 }}
      />
      {status === "loading" && <p>Loading WebGPU…</p>}
      {status === "error" && (
        <p style={{ color: "red" }}>Error: {errorMsg}</p>
      )}
    </div>
  );
}
