package org.dcsa.portcall.model;

import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

public class ErrorResponse {

    private HttpStatus httpStatus;
    private String message;
    private List<String> errors;

    public ErrorResponse(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
        this.errors = new ArrayList<>();
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public ErrorResponse setHttpStatus(HttpStatus httpStatus) {
        this.httpStatus = httpStatus;
        return this;
    }

    public String getMessage() {
        return message;
    }

    public ErrorResponse setMessage(String message) {
        this.message = message;
        return this;
    }

    public List<String> getErrors() {
        return errors;
    }

    public ErrorResponse addErrors(String error) {
        this.errors.add(error);
        return this;
    }

    public ErrorResponse setErrors(List<String> errors) {
        this.errors = errors;
        return this;
    }
}
