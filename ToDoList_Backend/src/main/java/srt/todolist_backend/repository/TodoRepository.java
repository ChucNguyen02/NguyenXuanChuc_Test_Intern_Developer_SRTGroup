package srt.todolist_backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import srt.todolist_backend.model.Todo;

public interface TodoRepository extends JpaRepository<Todo, Long> {

    Boolean existsByIdAndOwnerId(Long id, Long ownerId);

    @Query("""
            SELECT t FROM Todo t
            WHERE t.owner.id = :ownerId
            AND (CAST(:keyword AS STRING) IS NULL
                 OR LOWER(t.title) LIKE LOWER(CONCAT('%', CAST(:keyword AS STRING), '%'))
                 OR LOWER(t.description) LIKE LOWER(CONCAT('%', CAST(:keyword AS STRING), '%')))
            AND (:completed IS NULL OR t.completed = :completed)
            ORDER BY t.createdAt DESC
            """)
    Page<Todo> search(@Param("ownerId") Long ownerId,
                      @Param("keyword") String keyword,
                      @Param("completed") Boolean completed,
                      Pageable pageable);
}