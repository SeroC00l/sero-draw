import { modalArray } from "@/constants/modals";
import { signal } from "@preact/signals-react";

export interface Modal {
  id: string;
  isOpen: boolean;
  content: React.ReactNode;
  zIndex?: number;
}

export const modals = signal<Modal[]>(modalArray);

let zIndexCounter = 10;

export const openModal = (id: string, content?: React.ReactNode) => {
  const modal = modals.value.find((modal) => modal.id === id);
  const urlParams = new URLSearchParams(window.location.search);
  const openModals = urlParams.get("modals")?.split(",") || [];

  if (!openModals.includes(id)) {
    openModals.push(id);
    urlParams.set("modals", openModals.join(","));
    window.history.replaceState(null, "", `?${urlParams.toString()}`);
  }

  modals.value.forEach((modal) => {
    if (modal.isOpen) {
      modal.zIndex = zIndexCounter;     
      zIndexCounter += 2;
    }
  });


  if (modal) {
    modal.isOpen = true;
    modal.zIndex = zIndexCounter;
  } else {
    modals.value = [...modals.value, { id, isOpen: true, content, zIndex: zIndexCounter }];
    zIndexCounter += 2;
  }

  modals.value = [...modals.value];
};

export const closeModal = (id: string) => {
  const modal = modals.value.find((modal) => modal.id === id);
  if (modal) {
    modal.isOpen = false;
    modals.value = [...modals.value];
  }

  const urlParams = new URLSearchParams(window.location.search);
  let openModals = urlParams.get("modals")?.split(",") || [];

  openModals = openModals.filter((modalId) => modalId !== id);

  if (openModals.length > 0) {
    urlParams.set("modals", openModals.join(","));
    window.history.replaceState(null, "", `?${urlParams.toString()}`);
  } else {
    window.history.replaceState(null, "", window.location.pathname);
  }

  zIndexCounter = 1000;
  modals.value.forEach((modal) => {
    if (modal.isOpen) {
      modal.zIndex = zIndexCounter;
      zIndexCounter += 2;
    } else {
      modal.zIndex = undefined; 
    }
  });
};

export const useModal = (id: string) => {
  const modal = modals.value.find((modal) => modal.id === id) as Modal;
  return {
    isOpen: modal.isOpen,
    zIndex: modal.zIndex,
    closeModal: () => closeModal(id),
    openModal: () => openModal(id),
  };
};

export const initializeModalsFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const openModals = urlParams.get("modals")?.split(",") || [];
  
  openModals.forEach((id) => {
    openModal(id);
  });
};
