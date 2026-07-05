package srt.todolist_backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TodoResponse {
    Long id;
    String title;
    String description;
    boolean completed;
    LocalDate taskDate;
    Instant createdAt;
    Instant updatedAt;
}
