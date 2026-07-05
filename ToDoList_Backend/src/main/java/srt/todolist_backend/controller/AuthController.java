package srt.todolist_backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import srt.todolist_backend.dto.request.LoginRequest;
import srt.todolist_backend.dto.request.RegisterRequest;
import srt.todolist_backend.dto.response.ApiResponse;
import srt.todolist_backend.dto.response.AuthResponse;
import srt.todolist_backend.service.AuthService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.<AuthResponse>builder()
                .message("Registered successfully")
                .result(authService.register(request))
                .build();
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.<AuthResponse>builder()
                .message("Login successful")
                .result(authService.login(request))
                .build();
    }
}
