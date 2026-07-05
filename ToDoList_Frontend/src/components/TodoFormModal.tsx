import { useEffect, useState, type FormEvent } from 'react'
import type { Todo } from '../types'
import { X, Calendar } from 'lucide-react'

interface Props {
  open: boolean
  initial?: Todo | null
  defaultDate?: string | null
  onClose: () => void
  onSubmit: (data: { title: string; description?: string; completed?: boolean; taskDate?: string | null }) => Promise<void>
}

export default function TodoFormModal({ open, initial, defaultDate, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [completed, setCompleted] = useState(false)
  const [taskDate, setTaskDate] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(initial?.title ?? '')
      setDescription(initial?.description ?? '')
      setCompleted(initial?.completed ?? false)
      setTaskDate(initial?.taskDate ?? defaultDate ?? new Date().toISOString().split('T')[0])
      setError('')
    }
  }, [open, initial, defaultDate])

  if (!open) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const trimmed = title.trim()
    if (!trimmed) {
      setError('Vui lòng nhập tiêu đề công việc!')
      return
    }
    setSaving(true)
    try {
      await onSubmit({
        title: trimmed,
        description: description.trim() || undefined,
        completed,
        taskDate: taskDate || null,
      })
      onClose()
    } catch (err: unknown) {
      setError((err as Error).message || 'Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden transform transition-all animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-150 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">
            {initial ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/55 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Tiêu đề công việc *
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Hoàn thành báo cáo cuối tuần"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError('') }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white focus:outline-none transition-all"
              maxLength={200}
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Mô tả chi tiết
            </label>
            <textarea
              placeholder="Ghi chú chi tiết về công việc cần làm..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={1000}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Ngày thực hiện
            </label>
            <input
              type="date"
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white focus:outline-none transition-all"
            />
          </div>

          {/* Completed toggle (edit only) */}
          {initial && (
            <label className="flex items-center space-x-2.5 cursor-pointer group py-1">
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="font-semibold text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                Đánh dấu hoàn thành
              </span>
            </label>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              {saving ? 'Đang lưu...' : 'Lưu công việc'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
