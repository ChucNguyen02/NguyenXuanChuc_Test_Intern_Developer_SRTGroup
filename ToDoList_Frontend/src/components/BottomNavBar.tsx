import { LayoutDashboard, ListTodo } from 'lucide-react'
import type { ActiveTab } from '../types'

interface Props {
  activeTab: ActiveTab
  onTabChange: (tab: ActiveTab) => void
}

export default function BottomNavBar({ activeTab, onTabChange }: Props) {
  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks' as const, label: 'Tasks', icon: ListTodo },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200/80 pb-safe z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const IconComponent = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-all cursor-pointer ${
                isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`px-4 py-1 rounded-full mb-0.5 flex items-center justify-center transition-all ${
                isActive ? 'bg-blue-50' : 'bg-transparent'
              }`}>
                <IconComponent className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              </div>
              <span className={`text-[10px] tracking-wide ${isActive ? 'font-bold text-blue-600' : 'font-semibold text-slate-500'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
