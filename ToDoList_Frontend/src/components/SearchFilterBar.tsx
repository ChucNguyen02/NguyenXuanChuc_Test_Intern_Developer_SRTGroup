import type { StatusFilter } from '../types'
import { Search, Plus } from 'lucide-react'

interface Props {
  keyword: string
  onKeywordChange: (v: string) => void
  status: StatusFilter
  onStatusChange: (v: StatusFilter) => void
  onCreateClick: () => void
}

const statusOptions: { label: string; value: StatusFilter }[] = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Hoàn thành', value: 'COMPLETED' },
  { label: 'Chưa hoàn thành', value: 'INCOMPLETE' },
]

export default function SearchFilterBar({
  keyword,
  onKeywordChange,
  status,
  onStatusChange,
  onCreateClick,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            <Search className="h-4 w-4" />
          </span>
          <input
            id="search-input"
            type="text"
            placeholder="Tìm kiếm công việc..."
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 pl-10 pr-3 py-2.5 text-sm bg-neutral-50 font-medium
                       focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 focus:bg-white
                       placeholder:text-neutral-400 transition-all"
          />
        </div>
        <select
          id="status-filter"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
          className="rounded-xl border border-neutral-200 px-3 py-2.5 text-sm bg-neutral-50 font-medium
                     focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 focus:bg-white
                     text-neutral-700 cursor-pointer transition-all"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button
        id="btn-add-todo"
        onClick={onCreateClick}
        className="bg-primary-600 hover:bg-primary-700 active:scale-[0.98]
                   text-white text-sm font-semibold rounded-xl px-5 py-2.5
                   shadow-md hover:shadow-lg transition-all whitespace-nowrap
                   flex items-center gap-2 justify-center cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        Thêm công việc
      </button>
    </div>
  )
}
