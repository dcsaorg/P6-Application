import { HttpErrorResponse } from "@angular/common/http";

export class ErrorHandler {

    constructor() { }

    public static getConcreteErrorMessage(errorResponse): string {
        if (errorResponse instanceof Error) {
            return errorResponse.message;
        }
        if (errorResponse instanceof HttpErrorResponse) {
            let errorMessage = "";
            if (errorResponse.status === 404) {
                errorMessage = "404: Resource not found";
            } else if (errorResponse.error.errors && errorResponse.error.errors instanceof Array) {
                errorResponse.error.errors.forEach(error => { errorMessage += ` ${error.reason}, ${error.message}. `; })
            } else {
                errorMessage = errorResponse.error.status;
            }
            return errorMessage;
        }
        return String(errorResponse);
    }
}
