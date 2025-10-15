import Logo from './Logo'

export default function AuthSplitLayout({
  leftTitle = 'Welcome Page',
  leftSubtitle = 'Sign in to continue access',
  leftImageUrl,
  leftQuote,
  leftQuoteAuthor,
  children,
  formTitle = 'Sign In',
  formSubtitle,
}) {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10 bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl shadow-2xl overflow-hidden bg-white dark:bg-gray-900 mt-4 md:mt-6">
        {/* Left panel: image if provided, otherwise gradient */}
  <div className={`relative hidden lg:block p-10 text-white ${leftImageUrl ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-700 via-fuchsia-600 to-pink-600'} overflow-hidden rounded-l-3xl`}>
          {/* Full background image if provided */}
          {leftImageUrl && (
            <>
              <img src={leftImageUrl} alt="HerCycle" className="absolute inset-0 z-0 w-full h-full object-cover object-center opacity-100 pointer-events-none brightness-90 saturate-125 contrast-105" />
              <div className="absolute inset-0 z-10 bg-black/35 pointer-events-none" />
            </>
          )}
          <div className="relative z-20">
            {/* Actual logo */}
            <Logo showText={true} className="text-white" textClassName="!text-white" />
            <div className="mt-20 max-w-md">
              {leftQuote ? (
                <>
                  <p className="text-2xl leading-snug font-medium text-white drop-shadow">“{leftQuote}”</p>
                  {leftQuoteAuthor && <p className="mt-3 text-white/90">— {leftQuoteAuthor}</p>}
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-semibold drop-shadow-sm">{leftTitle}</h2>
                  <p className="mt-3 text-white/90 max-w-xs">{leftSubtitle}</p>
                </>
              )}
            </div>
          </div>
          {/* Decorative blobs */}
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-10 right-10 w-16 h-16 rounded-full bg-white/20 blur-sm" />
          <div className="absolute bottom-6 left-10 w-6 h-6 rounded-full bg-white/30" />
        </div>

        {/* Right form card */}
        <div className="p-6 sm:p-10">
          <div className="max-w-sm mx-auto">
            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100">{formTitle}</h3>
            {formSubtitle && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{formSubtitle}</p>
            )}
            <div className="mt-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
