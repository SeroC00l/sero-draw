"use client";
import { useCanvas } from "@/hooks/useCanvas";
import { $ } from "@/lib/utils";
import { signal } from "@preact/signals-react";
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime";

export const canvasSignal = signal<HTMLCanvasElement | null>(null);
export const imageUrl = signal("");

export const Canvas = () => {
  const { handleMouseMove, handleMouseUp, handleMouseDown } = useCanvas();
  useSignals();

  useSignalEffect(() => {
    canvasSignal.value = $("canvas") as HTMLCanvasElement;
    const savedDrawing = localStorage.getItem("canvasDrawing");
    if (savedDrawing && canvasSignal.value) {
      const ctx = canvasSignal.value.getContext("2d");
      const img = new Image();
      img.src = savedDrawing;
      img.onload = () => {
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }
      };
    }
    imageUrl.value = canvasSignal.value?.toDataURL("image/png") || "";
  });

  return (
    <canvas
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      height={window.innerHeight}
      width={window.innerWidth}
    />
  );
};
