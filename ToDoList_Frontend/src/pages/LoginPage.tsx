import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks'
import { User, Lock, ArrowRight, Home, ClipboardCheck } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ thông tin đăng nhập!')
      return
    }

    setLoading(true)
    try {
      await login(username, password)
      navigate('/')
    } catch (err: unknown) {
      const serverMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message
      if (serverMessage === 'Invalid username or password') {
        setError('Tài khoản hoặc mật khẩu không chính xác!')
      } else if (serverMessage) {
        setError(serverMessage)
      } else {
        setError('Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu!')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl relative">
        {/* Back to Home Link inside the card */}
        <Link
          to="/"
          className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all z-10 shadow-sm"
        >
          <Home className="w-4.5 h-4.5" />
          Trang chủ
        </Link>

        {/* Header */}
        <div className="px-8 pt-10 pb-8 text-center border-b border-neutral-100 bg-gradient-to-b from-primary-50/50 to-transparent">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 mb-4 border border-primary-100 shadow-sm">
            <ClipboardCheck className="w-6 h-6 text-primary-600 animate-pulse" />
          </div>
          <h1 className="text-4xl font-extrabold text-primary-600 tracking-tight">
            Todo App
          </h1>
          <p className="text-base font-medium text-neutral-500 mt-1">
            Quản lý công việc hiệu quả
          </p>
        </div>

        {/* Form Area */}
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-tertiary-50 border border-tertiary-200 text-tertiary-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label htmlFor="login-username" className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                  <User className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  id="login-username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setError('')
                  }}
                  placeholder="Nhập username của bạn"
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 text-sm font-medium placeholder-neutral-400
                             focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white focus:outline-none transition-all"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  id="login-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  placeholder="Nhập mật khẩu"
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 text-sm font-medium placeholder-neutral-400
                             focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between py-1 text-sm">
              <label className="flex items-center space-x-2.5 cursor-pointer group">
                
              </label>
              <button
                type="button"
                onClick={() => setError('Tính năng khôi phục mật khẩu đang được phát triển!')}
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors hover:underline cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Submit Button */}
            <button
              id="btn-login"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed
                         text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]
                         flex justify-center items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Đang đăng nhập...
                </span>
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Guest Bypass Button */}
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-xl transition-colors
                         text-sm flex justify-center items-center gap-1.5 cursor-pointer"
            >
              Trải nghiệm nhanh (Khách)
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center border-t border-neutral-100 pt-6">
            <p className="text-sm font-medium text-neutral-500">
              Chưa có tài khoản?{' '}
              <Link
                to="/register"
                className="text-primary-600 font-bold hover:text-primary-700 transition-colors hover:underline underline-offset-2"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
