import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks'
import { User, Lock, ArrowRight, UserPlus, Home } from 'lucide-react'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ thông tin!')
      return
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    setLoading(true)
    try {
      await register(username, password)
      navigate('/')
    } catch (err: unknown) {
      const serverMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message
      if (serverMessage === 'Username already exists') {
        setError('Tên tài khoản này đã tồn tại!')
      } else if (serverMessage) {
        setError(serverMessage)
      } else {
        setError('Đăng ký thất bại. Vui lòng thử lại!')
      }
    } finally {
      setLoading(false)
    }
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
        <div className="px-8 pt-10 pb-8 text-center border-b border-neutral-100 bg-gradient-to-b from-secondary-50/50 to-transparent">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-secondary-50 text-secondary-600 mb-4 border border-secondary-100 shadow-sm">
            <UserPlus className="w-6 h-6 text-secondary-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-secondary-600 tracking-tight">
            Đăng ký
          </h1>
          <p className="text-base font-medium text-neutral-500 mt-1">
            Tạo tài khoản mới để bắt đầu
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
              <label htmlFor="register-username" className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                  <User className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  id="register-username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setError('')
                  }}
                  placeholder="Nhập username của bạn"
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 text-sm font-medium placeholder-neutral-400
                             focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white focus:outline-none transition-all"
                  minLength={3}
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="register-password" className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  id="register-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 text-sm font-medium placeholder-neutral-400
                             focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white focus:outline-none transition-all"
                  minLength={6}
                  required
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="register-confirm-password" className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  id="register-confirm-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setError('')
                  }}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 text-sm font-medium placeholder-neutral-400
                             focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white focus:outline-none transition-all"
                  minLength={6}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="btn-register"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-secondary-500 hover:bg-secondary-600 disabled:opacity-60 disabled:cursor-not-allowed
                         text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]
                         flex justify-center items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Đang tạo tài khoản...
                </span>
              ) : (
                <>
                  Đăng ký
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center border-t border-neutral-100 pt-6">
            <p className="text-sm font-medium text-neutral-500">
              Đã có tài khoản?{' '}
              <Link
                to="/login"
                className="text-primary-600 font-bold hover:text-primary-700 transition-colors hover:underline underline-offset-2"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
