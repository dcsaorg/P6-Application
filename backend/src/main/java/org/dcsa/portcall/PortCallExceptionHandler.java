package org.dcsa.portcall;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.controller.PortCallException;
import org.dcsa.portcall.model.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class PortCallExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger log = LogManager.getLogger(PortCallExceptionHandler.class);

    @ExceptionHandler(PortCallException.class)
    public ResponseEntity<ErrorResponse> duplicateEntryExceptionHandler(PortCallException ex, WebRequest request) {

        return new ResponseEntity<>(ex.getErrorResponse(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> defaultExceptionHandler(Exception ex, WebRequest request) {
        log.fatal("Unexpected exception: " + ex.getMessage(), ex);
        ErrorResponse error = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
        if (ex.getCause() != null) {
            error.addErrors(ex.getCause().getMessage());
        }
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
