import { useEffect, useRef } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { Stack } from "../ui/Stack/Stack";
import { canvasState, setThickness } from "../Canvas/Context";
import { X } from "lucide-react";
import styles from "./GrosorPopover.module.css";

export const GrosorPopover = ({ togglePopover }: { togglePopover: () => void }) => {
  useSignals();
  const state = canvasState.value;
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        togglePopover();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [togglePopover]);

  return (
    <div
      ref={popoverRef}
      id="grosor"
      style={{
        position: "absolute",
        transform: "translateY(60px)",
        border: "2px solid #a7a7a7",
        padding: "10px",
        backgroundColor: "#000",
      }}
    >
      <Stack style={{ justifyContent: "space-between" }}>
        <label htmlFor="grosor">
          Grosor {state.thickness}
        </label>
        <button
          style={{ backgroundColor: "transparent" }}
          onClick={togglePopover}
        >
          <X color="white" />
        </button>
      </Stack>
      <input
        min={1}
        max={20}
        step={1}
        value={state.thickness}
        onChange={(e) => setThickness(Number(e.target.value))}
        type="range"
        title="Grosor"
        className={styles.input}
      />
    </div>
  );
};
