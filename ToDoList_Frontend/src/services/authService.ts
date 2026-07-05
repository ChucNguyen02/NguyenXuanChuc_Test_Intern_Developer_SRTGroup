import axiosClient from '../utils/axiosClient'
import type { ApiResponse, AuthResponse } from '../types'

export const authService = {
  login: (username: string, password: string) =>
    axiosClient
      .post<ApiResponse<AuthResponse>>('/auth/login', { username, password })
      .then((res) => res.data.result!),

  register: (username: string, password: string) =>
    axiosClient
      .post<ApiResponse<AuthResponse>>('/auth/register', { username, password })
      .then((res) => res.data.result!),
}
