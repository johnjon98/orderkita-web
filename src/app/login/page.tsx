import { LoginForm } from './LoginForm'

async function getLoginHeroImageUrl(): Promise<string | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
    const res = await fetch(`${apiUrl}/api/v1/config/public/`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    const json = await res.json()
    const url = json?.data?.login_hero_image_url
    return typeof url === 'string' && url.length > 0 ? url : null
  } catch {
    return null
  }
}

export default async function LoginPage() {
  const heroImageUrl = await getLoginHeroImageUrl()

  return (
    <div className="flex min-h-screen">

      {/* Left panel — hero image or gradient */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col">
        {heroImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-500 to-purple-400" />
        )}
        {/* Overlay so text is readable over any image */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Bottom-left brand blurb */}
        <div className="relative z-10 mt-auto p-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="4 2 126 32" fill="none" className="h-8 w-auto mb-4">
            <line x1="6" y1="4" x2="6" y2="14" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="9" y1="4" x2="9" y2="14" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="12" y1="4" x2="12" y2="14" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M6 14 Q6 18 9 18 Q12 18 12 14" stroke="#ffffff" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
            <line x1="9" y1="18" x2="9" y2="32" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round"/>
            <ellipse cx="22" cy="9" rx="4" ry="5.5" stroke="#ffffff" strokeWidth="1.8" fill="none"/>
            <line x1="22" y1="14.5" x2="22" y2="32" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round"/>
            <text x="34" y="26" fontFamily="Inter, system-ui, sans-serif" fontSize="20" fontWeight="700" fill="#ffffff" letterSpacing="-0.5">Order<tspan fill="#d8b4fe">Kita</tspan></text>
          </svg>
          <p className="text-white/80 text-sm max-w-xs leading-relaxed">
            Manage your restaurant orders, menu, and kitchen — all from one place.
          </p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex flex-1 items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="4 2 126 32" fill="none" className="h-9 w-auto">
              <line x1="6" y1="4" x2="6" y2="14" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="9" y1="4" x2="9" y2="14" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="12" y1="4" x2="12" y2="14" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M6 14 Q6 18 9 18 Q12 18 12 14" stroke="#a855f7" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              <line x1="9" y1="18" x2="9" y2="32" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round"/>
              <ellipse cx="22" cy="9" rx="4" ry="5.5" stroke="#a855f7" strokeWidth="1.8" fill="none"/>
              <line x1="22" y1="14.5" x2="22" y2="32" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round"/>
              <text x="34" y="26" fontFamily="Inter, system-ui, sans-serif" fontSize="20" fontWeight="700" fill="#1e1b4b" letterSpacing="-0.5">Order<tspan fill="#a855f7">Kita</tspan></text>
            </svg>
            <p className="text-sm text-muted-foreground">Sign in to your account</p>
          </div>

          <LoginForm />
        </div>
      </div>

    </div>
  )
}
