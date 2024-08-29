"use client";
import { Stack } from "../ui/Stack/Stack";
import { imageUrl } from "../Canvas/Canvas";
import { computed } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { useModal } from "@/stores/modal.store";
import {  useEffect, useRef } from "react";

const id = "saveImage";

export const SaveImage = () => {
  useSignals();
  const getImageUrl = computed(() => imageUrl.value);
  const $input = useRef<HTMLInputElement>(null);
  const { closeModal, isOpen } = useModal(id);

  useEffect(() => {
    if (isOpen) {
      $input.current?.focus();
    }
  }, [isOpen, $input]);

  const downloadImage = () => {
    if (getImageUrl) {
      const link = document.createElement("a");
      link.href = getImageUrl.value;
      link.download = $input.current?.value || "dibujo.png";
      link.click();
    }
  };

  return (
    <Stack
      col
      style={{ justifyContent: "center", alignItems: "center", padding: 10 }}
    >
      <h2>Guardar Imagen Como</h2>
      <form method="dialog" onSubmit={downloadImage}>
        <input
          type="text"
          ref={$input}
          placeholder="dibujo.png"
          style={{
            padding: 5,
            border: 0,
            outline: 0,
            borderBottom: "1px solid",
            width: 200,
          }}
        />
      </form>
      {getImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={getImageUrl.value} alt="Dibujo" width={500} height={500} />
      )}

      <Stack
        as="footer"
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          margin: 10,
        }}
      >
        <form method="dialog" onSubmit={downloadImage}>
          <button
            style={{
              backgroundColor: "#051837",
              padding: 5,
              cursor: "pointer",
            }}
            type="submit"
          >
            Descargar
          </button>
        </form>
        <button
          style={{ backgroundColor: "#09f", padding: 5, cursor: "pointer" }}
          onClick={closeModal}
        >
          Cancelar
        </button>
      </Stack>
    </Stack>
  );
};
