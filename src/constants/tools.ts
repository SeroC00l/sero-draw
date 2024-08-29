import { Tool } from "@/types";
import { Brush, Circle, Eraser, PaintBucket, Square, X } from "lucide-react";

enum MODES {
  DRAW = "draw",
  ERASE = "erase",
  RECTANGLE = "rectangle",
  CIRCLE = "circle",
  FILL = "fill",
}

export const tools: Tool[] = [
  { name: "Lápiz", icon: Brush, mode: MODES.DRAW },
  { name: "Borrador", icon: Eraser, mode: MODES.ERASE },
  { name: "Rectángulo", icon: Square, mode: MODES.RECTANGLE },
  { name: "Círculo", icon: Circle, mode: MODES.CIRCLE },
  { name: "Bucket", icon: PaintBucket, mode: MODES.FILL },
];
