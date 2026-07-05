package srt.todolist_backend.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "todos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, length = 200, columnDefinition = "VARCHAR(200)")
    String title;

    @Column(length = 1000, columnDefinition = "VARCHAR(1000)")
    String description;

    @Builder.Default
    @Column(nullable = false)
    boolean completed = false;

    @Column(name = "task_date")
    LocalDate taskDate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    User owner;

    @Builder.Default
    @Column(nullable = false)
    Instant createdAt = Instant.now();

    @Builder.Default
    @Column(nullable = false)
    Instant updatedAt = Instant.now();

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
