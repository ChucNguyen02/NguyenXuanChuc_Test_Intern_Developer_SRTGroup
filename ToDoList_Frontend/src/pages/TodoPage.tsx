import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useTodos } from '../hooks'
import { Search, Plus, Filter  } from 'lucide-react'
import type { ActiveTab, StatusFilter, Todo } from '../types'

import Sidebar from '../components/Sidebar'
import BottomNavBar from '../components/BottomNavBar'
import MiniCalendar from '../components/MiniCalendar'
import TodoFormModal from '../components/TodoFormModal'
import Pagination from '../components/Pagination'
import TodoItem from '../components/TodoItem'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'

function formatTaskDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

function formatHeaderDate(dateStr: string): string {
  if (dateStr === 'NO_DATE') return 'Không có ngày thực hiện'
  const [year, month, day] = dateStr.split('-')
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  if (dateStr === todayStr) {
    return `Hôm nay - ${day}/${month}/${year}`
  }
  return `Ngày ${day}/${month}/${year}`
}

export default function TodoPage() {
  const { username, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const {
    todos,
    loading,
    error,
    modalOpen,
    editingTodo,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleToggle,
    deleteModalOpen,
    todoToDelete,
    deleting,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDelete,
  } = useTodos()

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard')
  const [calendarDate, setCalendarDate] = useState(() => {
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  })

  // Local state for search & filtering in the Tasks tab
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<StatusFilter>('ALL')
  const [page, setPage] = useState(0)
  const [dashboardPage, setDashboardPage] = useState(0)
  const [defaultTaskDate, setDefaultTaskDate] = useState<string | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDashboardPage(0)
  }, [calendarDate])

  const handleOpenCreateWithDate = () => {
    setDefaultTaskDate(calendarDate)
    openCreateModal()
  }

  const handleOpenCreateDefault = () => {
    setDefaultTaskDate(null)
    openCreateModal()
  }

  const handleLogout = () => {
    if (isAuthenticated) {
      logout()
    }
    navigate('/login')
  }

  // Vietnamese date header
  const formattedDate = useMemo(() => {
    const now = new Date()
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
    const dayName = days[now.getDay()]
    return `${dayName}, ${now.getDate()} Tháng ${now.getMonth() + 1}, ${now.getFullYear()}`
  }, [])

  // 1. Dashboard View: filter tasks by calendarDate & calculate stats
  const dashboardTodos = useMemo(() => {
    return todos.filter((todo) => todo.taskDate === calendarDate)
  }, [todos, calendarDate])

  const DASHBOARD_PAGE_SIZE = 10
  const totalDashboardPages = Math.max(1, Math.ceil(dashboardTodos.length / DASHBOARD_PAGE_SIZE))

  const paginatedDashboardTodos = useMemo(() => {
    return dashboardTodos.slice(dashboardPage * DASHBOARD_PAGE_SIZE, dashboardPage * DASHBOARD_PAGE_SIZE + DASHBOARD_PAGE_SIZE)
  }, [dashboardTodos, dashboardPage])

  useEffect(() => {
    if (dashboardPage >= totalDashboardPages) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDashboardPage(Math.max(0, totalDashboardPages - 1))
    }
  }, [totalDashboardPages, dashboardPage])

  const dashboardStats = useMemo(() => {
    const total = dashboardTodos.length
    const completed = dashboardTodos.filter((t) => t.completed).length
    const active = total - completed
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, active, percentage }
  }, [dashboardTodos])

  // 2. Tasks View: filter all tasks by keyword and status
  const filteredTasks = useMemo(() => {
    return todos.filter((task) => {
      // status filter
      if (status === 'INCOMPLETE' && task.completed) return false
      if (status === 'COMPLETED' && !task.completed) return false

      // keyword filter
      if (keyword.trim()) {
        const q = keyword.toLowerCase()
        const matchesTitle = task.title.toLowerCase().includes(q)
        const matchesDesc = (task.description || '').toLowerCase().includes(q)
        if (!matchesTitle && !matchesDesc) return false
      }
      return true
    })
  }, [todos, keyword, status])

  const overallStats = useMemo(() => {
    const total = todos.length
    const completed = todos.filter((t) => t.completed).length
    const active = total - completed
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, active, percentage }
  }, [todos])

  const PAGE_SIZE = 10
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / PAGE_SIZE))

  const paginatedTasks = useMemo(() => {
    return filteredTasks.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
  }, [filteredTasks, page])

  const groupedPaginatedTasks = useMemo(() => {
    const groups: { [date: string]: Todo[] } = {}
    
    // Sort tasks first (latest date first)
    const sorted = [...paginatedTasks].sort((a, b) => {
      const dateA = a.taskDate || '9999-12-31'
      const dateB = b.taskDate || '9999-12-31'
      if (dateA !== dateB) {
        return dateB.localeCompare(dateA)
      }
      return a.id - b.id
    })

    sorted.forEach((todo) => {
      const dateKey = todo.taskDate || 'NO_DATE'
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(todo)
    })

    return groups
  }, [paginatedTasks])

  // Adjust page index if it exceeds totalPages
  useEffect(() => {
    if (page >= totalPages) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPage(Math.max(0, totalPages - 1))
    }
  }, [totalPages, page])

  const statusFilters: { label: string; value: StatusFilter }[] = [
    { label: 'Tất cả', value: 'ALL' },
    { label: 'Chưa xong', value: 'INCOMPLETE' },
    { label: 'Đã xong', value: 'COMPLETED' },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Sidebar (Desktop) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        username={username}
        onAddTaskClick={handleOpenCreateDefault}
        onLogout={handleLogout}
      />

      {/* BottomNav (Mobile) */}
      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-grow md:ml-64 flex flex-col min-h-screen">
        {/* TopAppBar */}
        <header className="bg-white border-b border-slate-150 flex justify-between items-center w-full px-6 py-4 md:px-8 shadow-sm z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight hidden md:block">{formattedDate}</h2>
              <h2 className="text-lg font-bold text-slate-900 md:hidden">
                {activeTab === 'dashboard' ? 'Dashboard' : 'Tất cả công việc'}
              </h2>
              {!isAuthenticated && (
                <p className="text-xs font-semibold text-amber-500 mt-0.5">
                  Chế độ khách —{' '}
                  <Link to="/login" className="text-blue-600 hover:underline">Đăng nhập</Link>
                </p>
              )}
              {isAuthenticated && (
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  {todos.length} công việc
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search (Desktop) */}
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500 font-bold" />
              <input
                type="text"
                placeholder="Tìm kiếm công việc..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-full text-sm text-slate-850 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all w-72 md:w-80 font-medium shadow-sm"
              />
            </div>

            {/* Mobile Add Button */}
            <button
              onClick={handleOpenCreateDefault}
              className="md:hidden bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl shadow-md cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          {activeTab === 'dashboard' ? (
            /* ─── DASHBOARD VIEW ─── */
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Task List */}
              <div className="flex-1 max-w-2xl w-full mx-auto lg:mx-0">
                {/* Stats Widgets */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng số</p>
                    <p className="text-3xl font-extrabold text-slate-800 mt-1">{dashboardStats.total}</p>
                  </div>
                  <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đang thực hiện</p>
                    <p className="text-3xl font-extrabold text-blue-600 mt-1">{dashboardStats.active}</p>
                  </div>
                  <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đã hoàn thành</p>
                    <p className="text-3xl font-extrabold text-emerald-600 mt-1">{dashboardStats.completed}</p>
                  </div>
                  <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tỷ lệ xong</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <p className="text-3xl font-extrabold text-slate-800">{dashboardStats.percentage}%</p>
                      <div className="flex-grow bg-slate-100 h-2 rounded-full overflow-hidden self-center max-w-[80px]">
                        <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${dashboardStats.percentage}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Task List Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
                    Công việc ngày {formatTaskDate(calendarDate)}
                    <span className="bg-blue-50 text-blue-600 text-[11px] font-extrabold px-2 py-0.5 rounded-full border border-blue-100/50">
                      {dashboardTodos.length}
                    </span>
                  </h3>
                  <button
                    onClick={handleOpenCreateWithDate}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer hidden md:block"
                  >
                    + Tạo công việc mới
                  </button>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl">
                    {error}
                  </div>
                )}

                {/* Tasks */}
                {loading ? (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center shadow-sm">
                    <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-400">Đang tải...</p>
                  </div>
                ) : dashboardTodos.length === 0 ? (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center shadow-sm">
                    <p className="text-sm font-semibold text-slate-400">Không có công việc nào trong ngày này.</p>
                    <p className="text-xs text-slate-400 mt-1">Bấm nút bên dưới hoặc sidebar để thêm mới!</p>
                    <button
                      onClick={handleOpenCreateWithDate}
                      className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      Thêm công việc
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-3">
                      {paginatedDashboardTodos.map((todo) => (
                        <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} onEdit={openEditModal} onDelete={openDeleteConfirm} />
                      ))}
                    </div>
                    <Pagination page={dashboardPage} totalPages={totalDashboardPages} onPageChange={setDashboardPage} />
                  </div>
                )}
              </div>

              {/* Right: Mini Calendar */}
              <aside className="w-full lg:w-80 flex-shrink-0">
                <MiniCalendar todos={todos} activeDate={calendarDate} onDateChange={setCalendarDate} />
              </aside>
            </div>
          ) : (
            /* ─── TASKS VIEW ─── */
            <div className="max-w-4xl mx-auto">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng số</p>
                  <p className="text-3xl font-extrabold text-slate-800 mt-1">{overallStats.total}</p>
                </div>
                <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đang thực hiện</p>
                  <p className="text-3xl font-extrabold text-blue-600 mt-1">{overallStats.active}</p>
                </div>
                <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đã hoàn thành</p>
                  <p className="text-3xl font-extrabold text-emerald-600 mt-1">{overallStats.completed}</p>
                </div>
                <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tỷ lệ xong</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-extrabold text-slate-800">{overallStats.percentage}%</p>
                    <div className="flex-grow bg-slate-100 h-2 rounded-full overflow-hidden self-center max-w-[80px]">
                      <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${overallStats.percentage}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-6">
                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  <Filter className="w-4 h-4 text-slate-400 mr-1 flex-shrink-0" />
                  {statusFilters.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => {
                        setStatus(f.value)
                        setPage(0)
                      }}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                        status === f.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-slate-150'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Lọc tiêu đề hoặc mô tả..."
                    value={keyword}
                    onChange={(e) => {
                      setKeyword(e.target.value)
                      setPage(0)
                    }}
                    className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all w-full sm:w-52 font-medium"
                  />
                </div>

                <button
                  onClick={handleOpenCreateDefault}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" /> Thêm công việc
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl">
                  {error}
                </div>
              )}

              {/* Task Grid */}
              {loading ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center shadow-sm">
                  <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-400">Đang tải...</p>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center col-span-full shadow-sm">
                  <p className="text-sm font-semibold text-slate-400">Không tìm thấy công việc nào.</p>
                  <p className="text-xs text-slate-400 mt-1">Thay đổi bộ lọc hoặc thêm công việc mới!</p>
                  <button
                    onClick={handleOpenCreateDefault}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    Thêm công việc đầu tiên
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedPaginatedTasks)
                    .sort((a, b) => {
                      if (a[0] === 'NO_DATE') return 1
                      if (b[0] === 'NO_DATE') return -1
                      return b[0].localeCompare(a[0]) // latest date first
                    })
                    .map(([dateKey, tasks]) => (
                      <div key={dateKey} className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 px-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {formatHeaderDate(dateKey)}
                        </h3>
                        <div className="flex flex-col gap-3">
                          {tasks.map((todo) => (
                            <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} onEdit={openEditModal} onDelete={openDeleteConfirm} />
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}

              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </main>
      </div>

      {/* Floating Add Button (mobile) */}
      <div className="md:hidden fixed bottom-20 right-4 z-40">
        <button
          onClick={handleOpenCreateDefault}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Modal */}
      <TodoFormModal
        open={modalOpen}
        initial={editingTodo}
        defaultDate={defaultTaskDate}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={deleteModalOpen}
        title={todoToDelete ? `Bạn có chắc muốn xóa công việc "${todoToDelete.title}"?` : undefined}
        onClose={closeDeleteConfirm}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div>
  )
}
