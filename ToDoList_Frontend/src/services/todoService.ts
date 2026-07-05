import axiosClient from '../utils/axiosClient'
import type { ApiResponse, PageResponse, Todo } from '../types'

export interface SearchParams {
  keyword?: string
  completed?: boolean
  page?: number
  size?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

export interface TodoPayload {
  title: string
  description?: string
  completed?: boolean
  taskDate?: string | null
}

export const todoService = {
  search: (params: SearchParams) =>
    axiosClient
      .get<ApiResponse<PageResponse<Todo>>>('/todos', { params })
      .then((res) => res.data.result!),

  getById: (id: number) =>
    axiosClient.get<ApiResponse<Todo>>(`/todos/${id}`).then((res) => res.data.result!),

  create: (payload: TodoPayload) =>
    axiosClient.post<ApiResponse<Todo>>('/todos', payload).then((res) => res.data.result!),

  update: (id: number, payload: TodoPayload) =>
    axiosClient.put<ApiResponse<Todo>>(`/todos/${id}`, payload).then((res) => res.data.result!),

  toggle: (id: number) =>
    axiosClient.patch<ApiResponse<Todo>>(`/todos/${id}/toggle`).then((res) => res.data.result!),

  remove: (id: number) => axiosClient.delete(`/todos/${id}`),
}
