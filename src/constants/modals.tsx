import { ClearCanvas } from "@/components/Modal/ClearCanvas";
import { SaveImage } from "@/components/Modal/SaveImage";

export const modalArray = [
  {
    id: "clearCanvas",
    isOpen: false,
    content: <ClearCanvas />,
  },
  {
    id: "saveImage",
    isOpen: false,
    content: <SaveImage />,
  },
];
