package srt.todolist_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import srt.todolist_backend.dto.request.TodoRequest;
import srt.todolist_backend.dto.response.PageResponse;
import srt.todolist_backend.dto.response.TodoResponse;
import srt.todolist_backend.exception.AppException;
import srt.todolist_backend.exception.ErrorCode;
import srt.todolist_backend.model.Todo;
import srt.todolist_backend.model.User;
import srt.todolist_backend.repository.TodoRepository;
import srt.todolist_backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    private User currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Transactional
    public TodoResponse create(TodoRequest request) {
        User owner = currentUser();

        Todo todo = Todo.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .completed(request.getCompleted() != null && request.getCompleted())
                .taskDate(request.getTaskDate())
                .owner(owner)
                .build();

        todoRepository.save(todo);
        return toResponse(todo);
    }

    @Transactional
    public TodoResponse update(Long id, TodoRequest request) {
        Todo todo = getOwnedTodoOrThrow(id);

        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        if (request.getCompleted() != null) {
            todo.setCompleted(request.getCompleted());
        }
        todo.setTaskDate(request.getTaskDate());

        todoRepository.save(todo);
        return toResponse(todo);
    }

    @Transactional
    public TodoResponse toggleCompleted(Long id) {
        Todo todo = getOwnedTodoOrThrow(id);
        todo.setCompleted(!todo.isCompleted());
        todoRepository.save(todo);
        return toResponse(todo);
    }

    @Transactional
    public void delete(Long id) {
        Todo todo = getOwnedTodoOrThrow(id);
        todoRepository.delete(todo);
    }

    public TodoResponse getById(Long id) {
        return toResponse(getOwnedTodoOrThrow(id));
    }

    public PageResponse<TodoResponse> search(String keyword, Boolean completed,
                                              int page, int size, String sortBy, String sortDir) {
        User owner = currentUser();

        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        String sortField = sortBy == null || sortBy.isBlank() ? "createdAt" : sortBy;

        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1), Sort.by(direction, sortField));

        String normalizedKeyword = (keyword == null || keyword.isBlank()) ? null : keyword.trim();

        Page<Todo> result = todoRepository.search(owner.getId(), normalizedKeyword, completed, pageable);

        return PageResponse.<TodoResponse>builder()
                .items(result.getContent().stream().map(this::toResponse).toList())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }

    private Todo getOwnedTodoOrThrow(Long id) {
        User owner = currentUser();
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TODO_NOT_FOUND));

        if (!todo.getOwner().getId().equals(owner.getId())) {
            throw new AppException(ErrorCode.TODO_ACCESS_DENIED);
        }
        return todo;
    }

    private TodoResponse toResponse(Todo todo) {
        return TodoResponse.builder()
                .id(todo.getId())
                .title(todo.getTitle())
                .description(todo.getDescription())
                .completed(todo.isCompleted())
                .taskDate(todo.getTaskDate())
                .createdAt(todo.getCreatedAt())
                .updatedAt(todo.getUpdatedAt())
                .build();
    }
}
