package org.dcsa.portcall.controller;

import org.dcsa.portcall.PortCallProperties;
import org.springframework.beans.factory.annotation.Autowire;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/application")
public class ApplicationController {
    @Autowired
    PortCallProperties config;

    @GetMapping
    @Transactional(readOnly = true)

    public PortCallProperties getConfigs(){

        return this.config;
    }
}
