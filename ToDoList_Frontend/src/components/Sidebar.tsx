import { LayoutDashboard, ListTodo, Plus, LogOut, LogIn, ClipboardCheck } from 'lucide-react'
import type { ActiveTab } from '../types'

interface Props {
  activeTab: ActiveTab
  onTabChange: (tab: ActiveTab) => void
  username: string | null
  onAddTaskClick: () => void
  onLogout: () => void
}

export default function Sidebar({ activeTab, onTabChange, username, onAddTaskClick, onLogout }: Props) {
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks' as const, label: 'Tasks', icon: ListTodo },
  ]

  return (
    <nav className="bg-slate-50 h-screen w-64 fixed left-0 top-0 border-r border-slate-200 hidden md:flex flex-col p-4 z-40 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 px-2 mt-2">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-200">
          <ClipboardCheck className="w-5.5 h-5.5" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-blue-600 leading-none">Todo App</h1>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Quản lý công việc</p>
        </div>
      </div>

      {/* Primary Action */}
      <button
        onClick={onAddTaskClick}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 mb-6 transition-all shadow-md shadow-blue-100 hover:shadow-lg active:scale-95 cursor-pointer"
      >
        <Plus className="w-5 h-5" />
        <span className="text-sm">Thêm công việc</span>
      </button>

      {/* Nav List */}
      <ul className="space-y-1 flex-grow">
        {navItems.map((item) => {
          const IconComponent = item.icon
          const isActive = activeTab === item.id
          return (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all cursor-pointer font-medium text-sm ${
                  isActive
                    ? 'text-blue-600 font-bold bg-blue-50 border-l-4 border-blue-600 pl-3'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            </li>
          )
        })}
      </ul>

      {/* User Card */}
      <div className="mt-auto border-t border-slate-200/60 pt-4 flex flex-col gap-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-200">
            {(username || 'K')[0].toUpperCase()}
          </div>
          <div className="flex-grow min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{username || 'Khách'}</p>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
              {username ? 'Đã đăng nhập' : 'Chế độ khách'}
            </p>
          </div>
        </div>

        {username ? (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        ) : (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng nhập</span>
          </button>
        )}
      </div>
    </nav>
  )
}
