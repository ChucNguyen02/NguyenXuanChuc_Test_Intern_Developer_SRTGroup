import type { PageResponse, Todo } from '../types'
import type { SearchParams, TodoPayload } from './todoService'

const STORAGE_KEY = 'guest_todos'

function loadAll(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAll(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function nextId(todos: Todo[]): number {
  return todos.reduce((max, t) => Math.max(max, t.id), 0) + 1
}

export const localTodoService = {
  async search(params: SearchParams): Promise<PageResponse<Todo>> {
    let todos = loadAll()

    if (params.keyword) {
      const kw = params.keyword.toLowerCase()
      todos = todos.filter(
        (t) =>
          t.title.toLowerCase().includes(kw) ||
          (t.description ?? '').toLowerCase().includes(kw)
      )
    }

    if (params.completed !== undefined) {
      todos = todos.filter((t) => t.completed === params.completed)
    }

    const sortDir = params.sortDir === 'asc' ? 1 : -1
    todos = [...todos].sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1) * sortDir)

    const page = params.page ?? 0
    const size = params.size ?? 6
    const totalElements = todos.length
    const totalPages = Math.max(1, Math.ceil(totalElements / size))
    const items = todos.slice(page * size, page * size + size)

    return { items, page, size, totalElements, totalPages }
  },

  async getById(id: number): Promise<Todo> {
    const todo = loadAll().find((t) => t.id === id)
    if (!todo) throw new Error('Không tìm thấy công việc')
    return todo
  },

  async create(payload: TodoPayload): Promise<Todo> {
    const todos = loadAll()
    const now = new Date().toISOString()
    const todo: Todo = {
      id: nextId(todos),
      title: payload.title,
      description: payload.description,
      completed: payload.completed ?? false,
      taskDate: payload.taskDate ?? null,
      createdAt: now,
      updatedAt: now,
    }
    todos.push(todo)
    saveAll(todos)
    return todo
  },

  async update(id: number, payload: TodoPayload): Promise<Todo> {
    const todos = loadAll()
    const idx = todos.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error('Không tìm thấy công việc')

    const updated: Todo = {
      ...todos[idx],
      title: payload.title,
      description: payload.description,
      completed: payload.completed ?? todos[idx].completed,
      taskDate: payload.taskDate ?? todos[idx].taskDate ?? null,
      updatedAt: new Date().toISOString(),
    }
    todos[idx] = updated
    saveAll(todos)
    return updated
  },

  async toggle(id: number): Promise<Todo> {
    const todos = loadAll()
    const idx = todos.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error('Không tìm thấy công việc')

    todos[idx] = {
      ...todos[idx],
      completed: !todos[idx].completed,
      updatedAt: new Date().toISOString(),
    }
    saveAll(todos)
    return todos[idx]
  },

  async remove(id: number): Promise<void> {
    saveAll(loadAll().filter((t) => t.id !== id))
  },
}
