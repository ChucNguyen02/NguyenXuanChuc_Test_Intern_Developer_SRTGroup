import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i)

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-2 text-sm font-semibold rounded-xl border border-slate-200 bg-white
                   disabled:opacity-40 disabled:cursor-not-allowed
                   hover:bg-slate-50 text-slate-600 transition-all cursor-pointer
                   flex items-center gap-1 shadow-sm"
      >
        <ChevronLeft className="h-4 w-4" />
        Trước
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3.5 py-2 text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
            p === page
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'
          }`}
        >
          {p + 1}
        </button>
      ))}

      <button
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-2 text-sm font-semibold rounded-xl border border-slate-200 bg-white
                   disabled:opacity-40 disabled:cursor-not-allowed
                   hover:bg-slate-50 text-slate-600 transition-all cursor-pointer
                   flex items-center gap-1 shadow-sm"
      >
        Sau
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
