package srt.todolist_backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import srt.todolist_backend.configuration.JwtUtil;
import srt.todolist_backend.dto.request.LoginRequest;
import srt.todolist_backend.dto.request.RegisterRequest;
import srt.todolist_backend.dto.response.AuthResponse;
import srt.todolist_backend.exception.AppException;
import srt.todolist_backend.exception.ErrorCode;
import srt.todolist_backend.model.User;
import srt.todolist_backend.repository.UserRepository;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User mockUser;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setUsername("testuser");
        registerRequest.setPassword("password123");

        loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");

        mockUser = User.builder()
                .id(1L)
                .username("testuser")
                .password("encoded_password")
                .build();
    }

    @Test
    void register_Success() {
        when(userRepository.existsByUsername(registerRequest.getUsername())).thenReturn(false);
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encoded_password");
        when(jwtUtil.generateToken("testuser")).thenReturn("mock-token");
        when(jwtUtil.getExpirationMs()).thenReturn(3600000L);

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("testuser", response.getUsername());
        assertEquals("mock-token", response.getToken());
        assertEquals(3600000L, response.getExpiresInMs());

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_UserExisted_ThrowsException() {
        when(userRepository.existsByUsername(registerRequest.getUsername())).thenReturn(true);

        AppException exception = assertThrows(AppException.class, () -> authService.register(registerRequest));
        assertEquals(ErrorCode.USER_EXISTED, exception.getErrorCode());

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        when(jwtUtil.generateToken("testuser")).thenReturn("mock-token");
        when(jwtUtil.getExpirationMs()).thenReturn(3600000L);

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("testuser", response.getUsername());
        assertEquals("mock-token", response.getToken());

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }
}
