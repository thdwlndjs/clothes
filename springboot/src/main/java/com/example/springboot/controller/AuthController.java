package com.example.springboot.controller;

import com.example.springboot.dto.UserDTO;
import com.example.springboot.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO req) {

        String token = authService.login(req.getEmail(), req.getPassword());

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials"));
        }

        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", req.getEmail()
        ));
    }

    // 회원가입
    @PostMapping("/signin")
    public ResponseEntity<?> register(@RequestBody UserDTO req) {

        boolean result = authService.signin(req.getEmail(), req.getPassword());

        if (!result) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already exists"));
        }

        return ResponseEntity.ok(Map.of("success", true));
    }
}
