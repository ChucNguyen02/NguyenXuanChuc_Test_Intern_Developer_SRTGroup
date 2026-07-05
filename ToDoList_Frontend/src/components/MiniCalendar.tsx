import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Todo } from '../types'

interface Props {
  todos: Todo[]
  activeDate: string
  onDateChange: (date: string) => void
}

export default function MiniCalendar({ todos, activeDate, onDateChange }: Props) {
  const getLocalDateString = (date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const currentDateObj = useMemo(() => {
    const dateStr = activeDate || getLocalDateString(new Date())
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day)
  }, [activeDate])

  const activeYear = currentDateObj.getFullYear()
  const activeMonth = currentDateObj.getMonth()

  const calendarDays = useMemo(() => {
    const firstDay = new Date(activeYear, activeMonth, 1)
    const startOffset = firstDay.getDay()
    const totalDays = new Date(activeYear, activeMonth + 1, 0).getDate()

    const days: Array<{ dayNum: number; dateString: string; isCurrentMonth: boolean }> = []

    const lastDayOfPrev = new Date(activeYear, activeMonth, 0).getDate()
    for (let i = startOffset - 1; i >= 0; i--) {
      const prevDay = lastDayOfPrev - i
      const pm = activeMonth === 0 ? 11 : activeMonth - 1
      const py = activeMonth === 0 ? activeYear - 1 : activeYear
      days.push({
        dayNum: prevDay,
        dateString: `${py}-${String(pm + 1).padStart(2, '0')}-${String(prevDay).padStart(2, '0')}`,
        isCurrentMonth: false,
      })
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push({
        dayNum: i,
        dateString: `${activeYear}-${String(activeMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
        isCurrentMonth: true,
      })
    }

    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      const nm = activeMonth === 11 ? 0 : activeMonth + 1
      const ny = activeMonth === 11 ? activeYear + 1 : activeYear
      days.push({
        dayNum: i,
        dateString: `${ny}-${String(nm + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
        isCurrentMonth: false,
      })
    }

    return days
  }, [activeYear, activeMonth])

  const months = [
    { label: 'Tháng 1', value: 0 },
    { label: 'Tháng 2', value: 1 },
    { label: 'Tháng 3', value: 2 },
    { label: 'Tháng 4', value: 3 },
    { label: 'Tháng 5', value: 4 },
    { label: 'Tháng 6', value: 5 },
    { label: 'Tháng 7', value: 6 },
    { label: 'Tháng 8', value: 7 },
    { label: 'Tháng 9', value: 8 },
    { label: 'Tháng 10', value: 9 },
    { label: 'Tháng 11', value: 10 },
    { label: 'Tháng 12', value: 11 },
  ]

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const list = []
    for (let y = currentYear - 100; y <= currentYear + 100; y++) {
      list.push(y)
    }
    return list
  }, [])

  const handleMonthChange = (newMonth: number) => {
    const d = new Date(activeYear, newMonth, 1)
    onDateChange(getLocalDateString(d))
  }

  const handleYearChange = (newYear: number) => {
    const d = new Date(newYear, activeMonth, 1)
    onDateChange(getLocalDateString(d))
  }

  const todayLocalDateString = useMemo(() => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const date = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${date}`
  }, [])

  const handlePrevMonth = () => {
    const d = new Date(activeYear, activeMonth - 1, 1)
    onDateChange(getLocalDateString(d))
  }

  const handleNextMonth = () => {
    const d = new Date(activeYear, activeMonth + 1, 1)
    onDateChange(getLocalDateString(d))
  }

  const dayHasTasks = (dateString: string) => todos.some((t) => t.taskDate === dateString)
  const dayHasPending = (dateString: string) => todos.some((t) => t.taskDate === dateString && !t.completed)

  return (
    <div className="bg-white border border-slate-200/90 rounded-[20px] p-5 shadow-md">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          {/* Month Select */}
          <select
            value={activeMonth}
            onChange={(e) => handleMonthChange(Number(e.target.value))}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:outline-none transition-all cursor-pointer"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          {/* Year Select */}
          <select
            value={activeYear}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:outline-none transition-all cursor-pointer"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-1">
          <button onClick={handlePrevMonth} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>
          <button onClick={handleNextMonth} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
            <ChevronRight className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((wd) => (
          <span key={wd} className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{wd}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {calendarDays.map((day, idx) => {
          const isActive = day.dateString === activeDate
          const isToday = day.dateString === todayLocalDateString
          const hasTasks = dayHasTasks(day.dateString)
          const hasPending = dayHasPending(day.dateString)

          return (
            <button
              key={`${day.dateString}-${idx}`}
              onClick={() => onDateChange(day.dateString)}
              className={`w-9 h-9 sm:w-10 sm:h-10 mx-auto text-sm font-semibold rounded-xl flex items-center justify-center relative cursor-pointer transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                  : isToday
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                  : day.isCurrentMonth
                  ? 'text-slate-800 hover:bg-slate-100'
                  : 'text-slate-350 hover:bg-slate-50'
              }`}
            >
              {day.dayNum}
              {hasTasks && (
                <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                  isActive || isToday ? 'bg-white' : hasPending ? 'bg-blue-500' : 'bg-emerald-500'
                }`} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
