import type { Todo } from '../types'
import { Check, Pencil, Trash2, Calendar } from 'lucide-react'

interface Props {
  todo: Todo
  onToggle: (id: number) => void
  onEdit: (todo: Todo) => void
  onDelete: (todo: Todo) => void
}

function formatTaskDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

export default function TodoItem({ todo, onToggle, onEdit, onDelete }: Props) {
  // Use taskDate or fallback to createdAt (date portion only)
  const displayDate = todo.taskDate 
    ? formatTaskDate(todo.taskDate) 
    : new Date(todo.createdAt).toLocaleDateString('vi-VN')

  return (
    <div
      className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex gap-5 group ${
        todo.completed
          ? 'border-slate-200 opacity-70 bg-slate-50/40'
          : 'border-slate-200 hover:border-blue-300'
      }`}
    >
      {/* Checkbox */}
      <div className="mt-1 flex-shrink-0">
        <button
          onClick={() => onToggle(todo.id)}
          className={`w-6.5 h-6.5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
            todo.completed
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100'
              : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50'
          }`}
        >
          {todo.completed && <Check className="w-4.5 h-4.5 font-bold" />}
        </button>
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-3 mb-2">
            <h4
              className={`text-[17px] font-bold tracking-tight transition-colors truncate ${
                todo.completed
                  ? 'text-slate-400 line-through'
                  : 'text-slate-800 group-hover:text-blue-600'
              }`}
            >
              {todo.title}
            </h4>

            {/* Right side: Date and Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100/50 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {displayDate}
              </span>

              {/* Actions */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(todo)}
                  className="text-slate-400 hover:text-blue-500 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                  title="Sửa"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(todo)}
                  className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                  title="Xóa"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>

          {todo.description && (
            <p className={`text-sm font-medium leading-relaxed ${
              todo.completed ? 'text-slate-300 line-through' : 'text-slate-500'
            }`}>
              {todo.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
