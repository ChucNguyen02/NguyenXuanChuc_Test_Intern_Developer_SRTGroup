export interface Todo {
    id: number
    title: string
    description?: string
    completed: boolean
    taskDate?: string | null
    createdAt: string
    updatedAt: string
}