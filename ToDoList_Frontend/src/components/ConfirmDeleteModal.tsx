import { useState, useEffect } from 'react'
import { Trash2, X } from 'lucide-react'

interface ConfirmDeleteModalProps {
  open: boolean
  title?: string
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
}

export default function ConfirmDeleteModal({
  open,
  title,
  onClose,
  onConfirm,
  loading = false,
}: ConfirmDeleteModalProps) {
  const [lastTitle, setLastTitle] = useState('')

  useEffect(() => {
    if (open && title) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLastTitle(title)
    }
  }, [open, title])

  if (!open) return null

  const displayTitle = title || lastTitle || 'Bạn có chắc chắn muốn xóa công việc này?'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Card container */}
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden transform transition-all animate-scale-up p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center mt-2">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 mb-4 shadow-sm animate-bounce">
            <Trash2 className="w-6 h-6" />
          </div>
          
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">
            Xác nhận xóa công việc
          </h3>
          
          <p className="text-sm font-medium text-slate-500 mt-2 px-2 leading-relaxed">
            {displayTitle} Hành động này sẽ đồng bộ và không thể hoàn tác.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer flex justify-center items-center gap-1.5"
          >
            {loading ? (
              <span className="flex items-center gap-1.5">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Đang xóa...
              </span>
            ) : (
              'Xác nhận xóa'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
