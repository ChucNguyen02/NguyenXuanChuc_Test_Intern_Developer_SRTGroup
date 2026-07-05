import { useCallback, useEffect, useState } from 'react'
import { todoService } from '../services/todoService'
import { localTodoService } from '../services/localTodoService'
import { useAuth } from '../context/AuthContext'
import type { Todo } from '../types'

export function useTodos() {
  const { isAuthenticated } = useAuth()
  const api = isAuthenticated ? todoService : localTodoService

  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchTodos = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setLoading(true)
    }
    setError('')
    try {
      const res = await api.search({
        page: 0,
        size: 1000,
        sortBy: 'createdAt',
        sortDir: 'desc',
      })
      setTodos(res.items)
    } catch (err: unknown) {
      setError((err as Error).message || 'Không thể tải danh sách công việc')
    } finally {
      if (showLoader) {
        setLoading(false)
      }
    }
  }, [api])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTodos(true)
  }, [fetchTodos, isAuthenticated])

  const openCreateModal = () => {
    setEditingTodo(null)
    setModalOpen(true)
  }

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo)
    setModalOpen(true)
  }

  const closeModal = () => setModalOpen(false)

  const handleSubmit = async (data: {
    title: string
    description?: string
    completed?: boolean
    taskDate?: string | null
  }) => {
    if (editingTodo) {
      await api.update(editingTodo.id, data)
    } else {
      await api.create(data)
    }
    await fetchTodos(false)
  }

  const handleToggle = async (id: number) => {
    // Optimistic update
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
    try {
      await api.toggle(id)
      await fetchTodos(false)
    } catch {
      // Rollback if failed
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      )
      setError('Không thể cập nhật trạng thái công việc')
    }
  }

  const openDeleteConfirm = (todo: Todo) => {
    setTodoToDelete(todo)
    setDeleteModalOpen(true)
  }

  const closeDeleteConfirm = () => {
    setTodoToDelete(null)
    setDeleteModalOpen(false)
  }

  const confirmDelete = async () => {
    if (!todoToDelete) return
    setDeleting(true)
    try {
      await api.remove(todoToDelete.id)
      await fetchTodos(false)
      closeDeleteConfirm()
    } catch {
      setError('Không thể xóa công việc')
    } finally {
      setDeleting(false)
    }
  }

  return {
    todos,
    loading,
    error,
    modalOpen,
    editingTodo,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleToggle,
    refetch: fetchTodos,
    deleteModalOpen,
    todoToDelete,
    deleting,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDelete,
  }
}
