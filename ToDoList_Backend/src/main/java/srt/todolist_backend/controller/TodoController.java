package srt.todolist_backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import srt.todolist_backend.dto.request.TodoRequest;
import srt.todolist_backend.dto.response.ApiResponse;
import srt.todolist_backend.dto.response.PageResponse;
import srt.todolist_backend.dto.response.TodoResponse;
import srt.todolist_backend.service.TodoService;

@RestController
@RequestMapping("/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    public ApiResponse<PageResponse<TodoResponse>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean completed,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        return ApiResponse.<PageResponse<TodoResponse>>builder()
                .result(todoService.search(keyword, completed, page, size, sortBy, sortDir))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<TodoResponse> getById(@PathVariable Long id) {
        return ApiResponse.<TodoResponse>builder()
                .result(todoService.getById(id))
                .build();
    }

    @PostMapping
    public ApiResponse<TodoResponse> create(@Valid @RequestBody TodoRequest request) {
        return ApiResponse.<TodoResponse>builder()
                .message("Todo created successfully")
                .result(todoService.create(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<TodoResponse> update(@PathVariable Long id, @Valid @RequestBody TodoRequest request) {
        return ApiResponse.<TodoResponse>builder()
                .message("Todo updated successfully")
                .result(todoService.update(id, request))
                .build();
    }

    @PatchMapping("/{id}/toggle")
    public ApiResponse<TodoResponse> toggle(@PathVariable Long id) {
        return ApiResponse.<TodoResponse>builder()
                .message("Todo status toggled")
                .result(todoService.toggleCompleted(id))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        todoService.delete(id);
        return ApiResponse.<Void>builder()
                .message("Todo deleted successfully")
                .build();
    }
}
