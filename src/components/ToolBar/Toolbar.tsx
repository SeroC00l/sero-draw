"use client";
import { useState } from "react";
import styles from "./ToolBar.module.css";
import { tools } from "@/constants/tools";
import {
  ArrowDown,
  ArrowUpWideNarrow,
  ChartBar,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import { openModal } from "@/stores/modal.store";
import { Stack } from "../ui/Stack/Stack";
import { useCanvas } from "@/hooks/useCanvas";
import {
  canvasState,
  setColor,
  setMode,
  setThickness,
} from "../Canvas/Context";
import { useSignals } from "@preact/signals-react/runtime";
import { GrosorPopover } from "../Popover/GrosorPopover";

export const ToolBar = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { undo } = useCanvas();
  useSignals();
  const state = canvasState.value;

  const togglePopover = () => {
    setIsPopoverOpen((prevState) => !prevState);
  };

  return (
    <div className={styles.toolBar} title="Toolbar">
      <input
        value={state.color}
        title="Color"
        type="color"
        onChange={(e) => setColor(e.target.value)}
        className={styles.colorPicker}
      />

      <button title="Grosor" className={styles.button} onClick={togglePopover}>
        <ChartBar />
      </button>
      {isPopoverOpen && <GrosorPopover togglePopover={togglePopover} />}

      {tools.map((tool, i) => (
        <button
          key={i}
          onClick={() => setMode(tool.mode)}
          title={tool.name}
          className={`${styles.button} ${
            state.mode === tool.mode ? styles.selected : ""
          }`}
        >
          <tool.icon size={30} />
        </button>
      ))}
      <button
        title="Download image"
        className={styles.button}
        onClick={() => openModal("saveImage")}
      >
        <ArrowDown />
      </button>
      <button title="Deshacer" className={styles.button} onClick={undo}>
        <Undo2 size={30} />
      </button>
      <button
        onClick={() => openModal("clearCanvas")}
        title="Limpiar Dibujo"
        className={styles.button}
      >
        <Trash2 size={30} />
      </button>
    </div>
  );
};
