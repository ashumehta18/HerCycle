export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10 bg-gradient-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md">
        <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur rounded-2xl shadow-xl border border-pink-100 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
              {subtitle && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
              )}
            </div>
            {children}
          </div>
          {footer && (
            <div className="px-6 py-4 sm:px-8 bg-pink-50/60 dark:bg-gray-800/60 border-t border-pink-100 dark:border-gray-800 text-center text-sm text-gray-700 dark:text-gray-300">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
