import { CreatorCard } from "@/components/creator-card"
import { getCreators } from "@/lib/actions/creators"

export async function CreatorGrid() {
  const creators = await getCreators()

  if (creators.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg">No creators yet.</p>
        <p className="text-sm mt-1">
          Run{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
            npm run db:seed
          </code>{" "}
          to add starter data.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {creators.map((creator: any) => (
        <CreatorCard
          key={creator.id}
          name={creator.name}
          platform={creator.platform}
          description={creator.description}
          profileUrl={creator.profileUrl}
          followerCount={creator.followerCount}
          postStyles={creator.postStyles}
        />
      ))}
    </div>
  )
}
