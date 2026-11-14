package com.example.saludo.controller;

import java.util.concurrent.atomic.AtomicReference;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/saludo")
public class Controller {

    private final AtomicReference<String> mensaje = new AtomicReference<>();

    @GetMapping()
    public String obtener() {
        return mensaje.get();
    }

    @PutMapping(consumes = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> actualizar(@RequestBody String nuevo) {
        String limpio = nuevo == null ? "" : nuevo.trim();
        if (limpio.isEmpty() || limpio.length() > 200) {
            return ResponseEntity.badRequest()
                    .body("El mensaje no puede estar vacio ni tener más de 200 caracteres");
        }

        mensaje.set(limpio);

        return ResponseEntity.ok(limpio);
    }
}
