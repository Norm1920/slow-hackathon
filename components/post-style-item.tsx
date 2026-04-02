import {
  Film,
  Heart,
  Music,
  PartyPopper,
  BookOpen,
  Sparkles,
  Smartphone,
  Image,
  MessageSquare,
  Mic,
  Theater,
  Trophy,
  Pencil,
  Search,
  User,
  Scissors,
  Play,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Film,
  Heart,
  Music,
  PartyPopper,
  BookOpen,
  Sparkles,
  Smartphone,
  Image,
  MessageSquare,
  Mic,
  Theater,
  Trophy,
  Pencil,
  Search,
  User,
  Scissors,
  Play,
  MessagesSquare,
}

interface PostStyleItemProps {
  title: string
  description: string
  icon?: string | null
  videoId?: string | null
}

export function PostStyleItem({ title, description, icon, videoId }: PostStyleItemProps) {
  const Icon = icon ? iconMap[icon] ?? Sparkles : Sparkles

  return (
    <div className="rounded-lg border bg-muted/30 overflow-hidden">
      {videoId && (
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )}
      <div className="flex gap-3 p-3">
        <div className="mt-0.5 flex-shrink-0">
          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
