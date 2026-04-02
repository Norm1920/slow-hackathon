import { Suspense } from "react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { HeroSection } from "@/components/hero-section"
import { CreatorGrid } from "@/components/creator-grid"
import { Cross, Loader2 } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="w-full border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Cross className="h-5 w-5 text-primary" />
            <span>Faith Creators for Kids</span>
          </div>
          <ThemeSwitcher />
        </div>
      </nav>

      {/* Hero */}
      <HeroSection />

      {/* Creator Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          }
        >
          <CreatorGrid />
        </Suspense>
      </section>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <p>Built at the Slow Ventures Creator Fund AI Hackathon</p>
          <ThemeSwitcher />
        </div>
      </footer>
    </main>
  )
}
