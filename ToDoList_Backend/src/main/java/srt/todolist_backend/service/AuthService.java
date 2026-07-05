package srt.todolist_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import srt.todolist_backend.configuration.JwtUtil;
import srt.todolist_backend.dto.request.LoginRequest;
import srt.todolist_backend.dto.request.RegisterRequest;
import srt.todolist_backend.dto.response.AuthResponse;
import srt.todolist_backend.exception.AppException;
import srt.todolist_backend.exception.ErrorCode;
import srt.todolist_backend.model.User;
import srt.todolist_backend.repository.UserRepository;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername());
        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .expiresInMs(jwtUtil.getExpirationMs())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = jwtUtil.generateToken(request.getUsername());
        return AuthResponse.builder()
                .token(token)
                .username(request.getUsername())
                .expiresInMs(jwtUtil.getExpirationMs())
                .build();
    }
}
