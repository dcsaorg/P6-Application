package org.dcsa.portcall.controller;

import org.dcsa.portcall.model.ErrorResponse;
import org.springframework.http.HttpStatus;

public class PortCallException extends RuntimeException {
    private final ErrorResponse errorResponse;

    public PortCallException(HttpStatus status, String message) {
        this.errorResponse = new ErrorResponse(status, message);
    }

    public PortCallException(ErrorResponse errorResponse) {
        this.errorResponse = errorResponse;
    }

    public ErrorResponse getErrorResponse() {
        return errorResponse;
    }
}
