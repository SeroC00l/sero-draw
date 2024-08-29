import { BrushIcon } from "lucide-react";

interface Tool {
  name: string;
  icon: typeof BrushIcon
  mode: MODES;
}
