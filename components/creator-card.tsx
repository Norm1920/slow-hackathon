import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PostStyleItem } from "@/components/post-style-item"
import { ExternalLink, Users } from "lucide-react"

interface PostStyle {
  id: string
  title: string
  description: string
  icon: string | null
  videoId: string | null
}

interface CreatorCardProps {
  name: string
  platform: string
  description: string
  profileUrl: string | null
  followerCount: string | null
  postStyles: PostStyle[]
}

export function CreatorCard({
  name,
  platform,
  description,
  profileUrl,
  followerCount,
  postStyles,
}: CreatorCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{name}</CardTitle>
          <Badge variant="secondary" className="flex-shrink-0 text-xs">
            {platform}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
        {followerCount && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
            <Users className="h-3 w-3" />
            <span>{followerCount}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1">
        <h3 className="text-sm font-semibold mb-3">Top 3 Post Styles</h3>
        <div className="flex flex-col gap-2">
          {postStyles.map((style) => (
            <PostStyleItem
              key={style.id}
              title={style.title}
              description={style.description}
              icon={style.icon}
              videoId={style.videoId}
            />
          ))}
        </div>
      </CardContent>

      {profileUrl && (
        <CardFooter className="pt-0">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            Visit Channel
            <ExternalLink className="h-3 w-3" />
          </a>
        </CardFooter>
      )}
    </Card>
  )
}
