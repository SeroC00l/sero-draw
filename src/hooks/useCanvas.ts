import { signal } from "@preact/signals-react";
import { $ } from "@/lib/utils";
import {
  addCoordinate,
  canvasState,
  clearCanvas,
  Coordinate,
  MODES,
  setDrawing,
  setImageData,
} from "@/components/Canvas/Context";
import { canvasSignal, imageUrl } from "@/components/Canvas/Canvas";
import { useSignals } from "@preact/signals-react/runtime";
import { useEffect } from "react";

export const historySignal = signal<ImageData[]>([]);

export const useCanvas = () => {
  useSignals();
  const $canvas = canvasSignal.value || ($("canvas") as HTMLCanvasElement);
  const state = canvasState.value;

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  canvasState.subscribe(({ mode }) => {
    if (!$canvas) return;
    switch (mode) {
      case MODES.FILL:
        $canvas.style.cursor = `url('/svg/bucket.svg') 12 12, auto`;
        break;
      case MODES.DRAW:
        $canvas.style.cursor = `url('/svg/brush.svg') 12 12, auto`;
        break;
      case MODES.ERASE:
        $canvas.style.cursor = `url('/svg/eraser.svg') 12 12, auto`;
        break;
      case MODES.RECTANGLE:
        $canvas.style.cursor = `crosshair`;
        break;
      case MODES.CIRCLE:
        $canvas.style.cursor = `crosshair`;
        break;
      default:
        $canvas.style.cursor = "default";
    }
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "z") {
      undo();
    }
  };

  const handleMouseDown = ({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const newCoordinate: Coordinate = {
      x: nativeEvent.offsetX,
      y: nativeEvent.offsetY,
    };
    addCoordinate(newCoordinate);
    const $canvas = canvasSignal.value as HTMLCanvasElement;
    const ctx = $canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = canvasState.value.color;

      ctx.lineWidth = canvasState.value.thickness || 1;
      if (state.mode === MODES.ERASE) {
        ctx.lineWidth = canvasState.value.thickness || 1 * 20;
      }
      setImageData(ctx.getImageData(0, 0, $canvas.width, $canvas.height));
      if (state.mode === MODES.FILL) {
        fill(ctx, newCoordinate.x, newCoordinate.y, canvasState.value.color);
      }
    }
  };

  const handleMouseMove = ({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!state.drawing || state.coordinates.length === 0) return;

    const { offsetX, offsetY } = nativeEvent;

    const ctx = $canvas.getContext("2d");
    if (!ctx) return;

    switch (state.mode) {
      case MODES.DRAW:
        draw(ctx, offsetX, offsetY);
        break;
      case MODES.ERASE:
        erase(ctx, offsetX, offsetY);
        break;
      case MODES.RECTANGLE:
        drawRectangle(ctx, offsetX, offsetY);
        break;
      case MODES.CIRCLE:
        drawCircle(ctx, offsetX, offsetY);
        break;
      default:
        break;
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
    saveDrawing();
  };

  const draw = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const lastCoordinate = state.coordinates[state.coordinates.length - 1];
    ctx.beginPath();
    ctx.moveTo(lastCoordinate.x, lastCoordinate.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    addCoordinate({ x, y });
  };

  const erase = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.clearRect(x - 5, y - 5, 10, 10);
  };

  const drawRectangle = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
  ) => {
    if (state.imageData) ctx.putImageData(state.imageData, 0, 0);

    const startCoordinate = state.coordinates[state.coordinates.length - 1];
    const width = x - startCoordinate.x;
    const height = y - startCoordinate.y;

    ctx.beginPath();
    ctx.rect(startCoordinate.x, startCoordinate.y, width, height);
    ctx.stroke();
  };

  const drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    if (state.imageData) ctx.putImageData(state.imageData, 0, 0);

    const startCoordinate = state.coordinates[state.coordinates.length - 1];
    const width = x - startCoordinate.x;
    const height = y - startCoordinate.y;
    const radius = Math.sqrt(width * width + height * height);

    ctx.beginPath();
    ctx.arc(startCoordinate.x, startCoordinate.y, radius, 0, Math.PI * 2);
    ctx.stroke();
  };

  const fill = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    fillColor: string
  ) => {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data;

    const startPos = (startY * canvasWidth + startX) * 4;
    const startColor = [
      data[startPos],
      data[startPos + 1],
      data[startPos + 2],
      data[startPos + 3],
    ];

    const color = hexToRgb(fillColor);

    const stack = [[startX, startY]];

    while (stack.length > 0) {
      const [x, y] = stack.pop() as [number, number];
      const currentPos = (y * canvasWidth + x) * 4;

      if (
        data[currentPos] === startColor[0] &&
        data[currentPos + 1] === startColor[1] &&
        data[currentPos + 2] === startColor[2] &&
        data[currentPos + 3] === startColor[3]
      ) {
        data[currentPos] = color[0];
        data[currentPos + 1] = color[1];
        data[currentPos + 2] = color[2];
        data[currentPos + 3] = 255;

        if (x > 0) stack.push([x - 1, y]);
        if (x < canvasWidth - 1) stack.push([x + 1, y]);
        if (y > 0) stack.push([x, y - 1]);
        if (y < canvasHeight - 1) stack.push([x, y + 1]);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  const saveDrawing = () => {
    const ctx = $canvas.getContext("2d") as CanvasRenderingContext2D;
    historySignal.value.push(
      ctx.getImageData(0, 0, $canvas.width, $canvas.height)
    );
    localStorage.setItem("canvasDrawing", $canvas.toDataURL());
    imageUrl.value = $canvas.toDataURL("image/png");
  };

  const undo = () => {
    if (!canvasSignal.value) return;
    const ctx = canvasSignal.value.getContext("2d");
    if (!ctx) return;
    const historyLength = historySignal.value.length;
    if (historyLength > 0) {
      const lastImageData = historySignal.value[historyLength - 1];
      historySignal.value = historySignal.value.slice(0, historyLength - 1);
      if (lastImageData) {
        ctx.putImageData(lastImageData, 0, 0);
        setImageData(lastImageData);
      }
    }
  };

  const clearCanvasHandler = () => {
    const ctx = $canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, $canvas.width, $canvas.height);
      localStorage.removeItem("canvasDrawing");
      clearCanvas();
      historySignal.value = [];
    }
  };

  return {
    handleMouseMove,
    handleMouseUp,
    undo,
    clearCanvas: clearCanvasHandler,
    handleMouseDown,
  };
};
