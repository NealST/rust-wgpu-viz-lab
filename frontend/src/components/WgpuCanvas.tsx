import { useRef, useEffect, useState } from "react";

let wasmInitPromise: Promise<typeof import("@/wasm/viz_core.js")> | null = null;

async function getWasm() {
  if (!wasmInitPromise) {
    wasmInitPromise = import("@/wasm/viz_core.js").then(async (mod) => {
      await mod.default();
      return mod;
    });
  }
  return wasmInitPromise;
}

export function WgpuCanvas({
  canvasId = "wgpu-canvas",
  wasmFn = "run_triangle",
  width = 800,
  height = 600,
}: {
  canvasId?: string;
  wasmFn?: string;
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
        const wasm = await getWasm();
        if (cancelled) return;
        const fn = wasm[wasmFn];
        if (typeof fn !== "function") {
          throw new Error(`wasm export "${wasmFn}" not found`);
        }
        await fn(canvasId);
        setStatus("ready");
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : String(err);
          console.error("Failed to initialize wgpu:", err);
          setErrorMsg(message);
          setStatus("error");
        }
      }
    }

    loadWasm();
    return () => {
      cancelled = true;
    };
  }, [canvasId, wasmFn]);

  return (
    <div className="space-y-2">
      <canvas
        id={canvasId}
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-border rounded-lg"
      />
      {status === "loading" && (
        <p className="text-sm text-muted-foreground">Loading WebGPU...</p>
      )}
      {status === "error" && (
        <p className="text-sm text-destructive">Error: {errorMsg}</p>
      )}
    </div>
  );
}
