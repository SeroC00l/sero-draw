"use client";
import { signal } from "@preact/signals-react";

// Definiciones de interfaces y tipos
export interface Coordinate {
  x: number;
  y: number;
}

export enum MODES {
  DRAW = "draw",
  ERASE = "erase",
  RECTANGLE = "rectangle",
  CIRCLE = "circle",
  FILL = "fill",
}

interface CanvasState {
  drawing: boolean;
  coordinates: Coordinate[];
  mode: MODES;
  imageData: ImageData | null;
  color: string;
  thickness?: number;
}

const initialState = {
  drawing: false,
  coordinates: [],
  mode: MODES.DRAW,
  imageData: null,
  color: localStorage.getItem("color") || "#ffffff",
  thickness: Number(localStorage.getItem("thickness")),
} as CanvasState;

// Inicializando una señal para el estado completo del canvas
export const canvasState = signal<CanvasState>(initialState);

// Funciones para actualizar el estado
export const setDrawing = (value: boolean) => {
  canvasState.value = { ...canvasState.value, drawing: value };
};

export const addCoordinate = (coordinate: Coordinate) => {
  canvasState.value = {
    ...canvasState.value,
    coordinates: [...canvasState.value.coordinates, coordinate],
  };
};

export const setMode = (mode: MODES) => {
  canvasState.value = { ...canvasState.value, mode };
};

export const setImageData = (imageData: ImageData | null) => {
  canvasState.value = { ...canvasState.value, imageData };
};

export const clearCanvas = () => {
  canvasState.value = {
    ...canvasState.value,
    coordinates: [],
    imageData: null,
  };
};

export const setColor = (color: string) => {
  canvasState.value = { ...canvasState.value, color };
  localStorage.setItem("color", color);
};

export const setThickness = (thickness: number) => {
  canvasState.value = { ...canvasState.value, thickness };
  localStorage.setItem("thickness", String(thickness));
};
