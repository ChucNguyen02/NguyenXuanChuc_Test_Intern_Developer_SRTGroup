package srt.todolist_backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import srt.todolist_backend.dto.request.TodoRequest;
import srt.todolist_backend.dto.response.PageResponse;
import srt.todolist_backend.dto.response.TodoResponse;
import srt.todolist_backend.exception.AppException;
import srt.todolist_backend.exception.ErrorCode;
import srt.todolist_backend.model.Todo;
import srt.todolist_backend.model.User;
import srt.todolist_backend.repository.TodoRepository;
import srt.todolist_backend.repository.UserRepository;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TodoServiceTest {

    @Mock
    private TodoRepository todoRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TodoService todoService;

    private User mockUser;
    private Todo mockTodo;
    private TodoRequest todoRequest;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(1L)
                .username("testuser")
                .password("password")
                .build();

        mockTodo = Todo.builder()
                .id(100L)
                .title("Test Task")
                .description("Test Description")
                .completed(false)
                .taskDate(java.time.LocalDate.parse("2026-07-05"))
                .owner(mockUser)
                .build();

        todoRequest = TodoRequest.builder()
                .title("New Title")
                .description("New Description")
                .completed(true)
                .taskDate(java.time.LocalDate.parse("2026-07-06"))
                .build();

        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("testuser");
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void create_Success() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TodoResponse response = todoService.create(todoRequest);

        assertNotNull(response);
        assertEquals("New Title", response.getTitle());
        assertEquals("New Description", response.getDescription());
        assertTrue(response.isCompleted());
        assertEquals(java.time.LocalDate.parse("2026-07-06"), response.getTaskDate());
    }

    @Test
    void getById_Success() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        when(todoRepository.findById(100L)).thenReturn(Optional.of(mockTodo));

        TodoResponse response = todoService.getById(100L);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("Test Task", response.getTitle());
    }

    @Test
    void getById_NotFound_ThrowsException() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        when(todoRepository.findById(999L)).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> todoService.getById(999L));
        assertEquals(ErrorCode.TODO_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void getById_AccessDenied_ThrowsException() {
        User anotherUser = User.builder().id(2L).username("another").build();
        mockTodo.setOwner(anotherUser);

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        when(todoRepository.findById(100L)).thenReturn(Optional.of(mockTodo));

        AppException exception = assertThrows(AppException.class, () -> todoService.getById(100L));
        assertEquals(ErrorCode.TODO_ACCESS_DENIED, exception.getErrorCode());
    }

    @Test
    void update_Success() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        when(todoRepository.findById(100L)).thenReturn(Optional.of(mockTodo));

        TodoResponse response = todoService.update(100L, todoRequest);

        assertNotNull(response);
        assertEquals("New Title", response.getTitle());
        assertEquals("New Description", response.getDescription());
        assertTrue(response.isCompleted());
    }

    @Test
    void toggleCompleted_Success() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        when(todoRepository.findById(100L)).thenReturn(Optional.of(mockTodo));

        TodoResponse response = todoService.toggleCompleted(100L);

        assertNotNull(response);
        assertTrue(response.isCompleted());
    }

    @Test
    void delete_Success() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        when(todoRepository.findById(100L)).thenReturn(Optional.of(mockTodo));

        todoService.delete(100L);

        verify(todoRepository, times(1)).delete(mockTodo);
    }

    @Test
    void search_Success() {
        Page<Todo> mockPage = new PageImpl<>(Collections.singletonList(mockTodo));

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        when(todoRepository.search(eq(1L), eq("test"), eq(false), any(Pageable.class))).thenReturn(mockPage);

        PageResponse<TodoResponse> response = todoService.search("test", false, 0, 10, "createdAt", "desc");

        assertNotNull(response);
        assertEquals(1, response.getItems().size());
        assertEquals(100L, response.getItems().get(0).getId());
    }
}
