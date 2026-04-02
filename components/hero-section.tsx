import { Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <div className="border-b bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-primary mb-4">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">
              Content Inspiration
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Faith-Driven Kids Content Creators
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Discover the top Christian creators making faith-based content for
            kids. Learn their top 3 post styles so you can create your own
            content for faith-driven families.
          </p>
        </div>
      </div>
    </div>
  )
}
