// import { ZodError, ZodSchema } from "zod";

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const $ = (selector: string) => document.querySelector(selector);

// export const validateSchema = (
//   schema: ZodSchema<any>,
//   values: any
// ): { [key: string]: string } => {
//   const newErrors: { [key: string]: string } = {};
//   try {
//     schema.parse(values);
//   } catch (error) {
//     if (error instanceof ZodError) {
//       error.errors.forEach((err) => {
//         if (err.path && err.message) {
//           newErrors[err.path[0] as string] = err.message;
//         }
//       });
//     } else {
//       console.error("Unexpected error during validation:", error);
//     }
//   }
//   return newErrors;
// };
