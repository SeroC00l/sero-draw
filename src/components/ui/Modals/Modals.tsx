"use client";
import { useEffect, useRef } from "react";
import {
  closeModal,
  initializeModalsFromUrl,
  Modal,
  modals,
} from "@/stores/modal.store";
import { useSignals } from "@preact/signals-react/runtime";
import styles from "./Modals.module.css";
import { X } from "lucide-react";
import { Stack } from "../Stack/Stack";

export const Modals = () => {
  useSignals();
  const dialogRefs = useRef<Map<string, HTMLDialogElement>>(new Map());

  useEffect(() => {
    initializeModalsFromUrl();
  }, []);

  useEffect(() => {
    const handleBackdropClick = (event: MouseEvent, id: string) => {
      const dialog = dialogRefs.current.get(id);
      if (dialog && dialog.open && event.target === dialog) {
        closeModal(id);
      }
    };

    const handleModalChange = (modalList: Modal[]) => {
      modalList.forEach((modal) => {
        const dialog = dialogRefs.current.get(modal.id);
        if (dialog) {
          if (modal.isOpen) {
            if (!dialog.open) {
              dialog.style.setProperty(
                "--modal-z-index",
                modal.zIndex?.toString() || null
              );
              dialog.showModal();
              dialog.addEventListener("cancel", () => closeModal(modal.id));
              dialog.addEventListener("click", (e) =>
                handleBackdropClick(e, modal.id)
              );
            }
          } else {
            if (dialog.open) {
              dialog.close();
            }
          }
        }
      });
    };

    const unsubscribe = modals.subscribe(handleModalChange);

    return () => {
      unsubscribe();
      dialogRefs.current.forEach((dialog, id) => {
        dialog?.removeEventListener("cancel", () => closeModal(id));
        dialog?.removeEventListener("click", (e) => handleBackdropClick(e, id));
      });
    };
  }, [dialogRefs]);

  return (
    <>
      {modals.value.map(({ id, content }: Modal) => (
        <dialog
          ref={(el) => {
            if (el) {
              dialogRefs.current.set(id, el);
            } else {
              dialogRefs.current.delete(id);
            }
          }}
          className={styles.dialog}
          key={id}
        >
          <Stack col>
            <button onClick={() => closeModal(id)} className={styles.closeBtn}>
              <X />
            </button>
            {content}
          </Stack>
        </dialog>
      ))}
    </>
  );
};
