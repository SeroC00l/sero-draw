"use client";
import { Stack } from "../ui/Stack/Stack";
import { useCanvas } from "@/hooks/useCanvas";
import { useModal } from "@/stores/modal.store";
import { useEffect, useRef } from "react";

const id = "clearCanvas";

export const ClearCanvas = () => {
  const { clearCanvas } = useCanvas();
  const { isOpen, closeModal } = useModal(id);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      buttonRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <Stack
      col
      style={{ justifyContent: "center", alignItems: "center", padding: 10 }}
    >
      <p>¿Estás seguro que deseas limpiar el dibujo?</p>
      <Stack
        as="footer"
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          margin: 10,
        }}
      >
        <form method="dialog" onSubmit={clearCanvas}>
          <button
            ref={buttonRef}
            type="submit"
            title="Limpiar Dibujo"
            style={{ backgroundColor: "red", padding: 5, cursor: "pointer" }}
          >
            Eliminar
          </button>
        </form>
        <button
          onClick={closeModal}
          title="Cancelar"
          style={{ backgroundColor: "#09f", padding: 5, cursor: "pointer" }}
        >
          Cancelar
        </button>
      </Stack>
    </Stack>
  );
};
