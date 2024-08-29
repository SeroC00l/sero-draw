export class FieldError extends Error {
    fieldName: string;
  
    constructor(fieldName: string, message: string) {
      super(message);
      this.fieldName = fieldName;
      this.name = "FieldError";
    }
  }
  