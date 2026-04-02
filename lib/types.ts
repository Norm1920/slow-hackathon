export type Platform =
  | "meta_feed"
  | "instagram_stories_reels"
  | "tiktok"
  | "google_display"
  | "general"

export type BrandName = "Eternal Blocks" | "Tektones"

export interface Audience {
  id: string
  label: string
  description: string
}

export interface MessagingAngle {
  id: string
  label: string
  description: string
}

// Union type for all ad variation shapes
export type AdVariation =
  | MetaFeedVariation
  | InstagramVariation
  | TikTokVariation
  | GoogleDisplayVariation
  | GeneralVariation

export interface MetaFeedVariation {
  platform: "meta_feed"
  headline: string
  primary_text_short: string
  primary_text_full: string
  description: string
  cta: string
  creative_direction: string
  uses_voc: boolean
  voc_phrase?: string
}

export interface InstagramVariation {
  platform: "instagram_stories_reels"
  hook_line: string
  script: string
  text_overlay_suggestions: string
  cta_overlay_text: string
  hashtags: string
  creative_direction: string
  uses_voc: boolean
  voc_phrase?: string
}

export interface TikTokVariation {
  platform: "tiktok"
  hook: string
  script: string
  text_overlay: string
  sound_music_direction: string
  cta: string
  creative_direction: string
  uses_voc: boolean
  voc_phrase?: string
}

export interface GoogleDisplayVariation {
  platform: "google_display"
  headline: string
  long_headline: string
  description: string
  cta: string
  creative_direction: string
  uses_voc: boolean
  voc_phrase?: string
}

export interface GeneralVariation {
  platform: "general"
  tagline: string
  value_proposition: string
  elevator_pitch: string
  email_subject_line: string
  creative_direction: string
  uses_voc: boolean
  voc_phrase?: string
}

export interface GenerateRequest {
  imageBase64: string
  imageMediaType: "image/png" | "image/jpeg" | "image/webp"
  brand: BrandName
  productTitle?: string
  retailPrice?: string
  discountPrice?: string
  pieceCount?: string
  audience: string
  angle: string
  platforms: Platform[]
  ideaCount: number
}

export interface GenerateResponse {
  variations: AdVariation[]
}

// Predefined options
export const AUDIENCES: Audience[] = [
  {
    id: "christian_moms",
    label: "Christian Moms (30-45)",
    description:
      "Primary buyer, values-driven, wants screen-free play and faith content",
  },
  {
    id: "christian_dads",
    label: "Christian Dads / LEGO Dads",
    description:
      "Building enthusiast, spends $1,000+/year on construction toys, wants to share faith with kids",
  },
  {
    id: "homeschool",
    label: "Homeschool Families",
    description:
      "Curriculum-integrated learning, looking for educational + faith-based tools",
  },
  {
    id: "grandparents",
    label: "Grandparents",
    description:
      "Gift buyers, want meaningful presents that teach faith, less price sensitive",
  },
  {
    id: "church",
    label: "Church / Ministry Leaders",
    description:
      "VBS programs, Sunday school, children\u2019s ministry curriculum",
  },
  {
    id: "afol",
    label: "Adult Collectors (AFOL)",
    description:
      "Appreciate premium build quality, display pieces, faith-based themes",
  },
  {
    id: "custom",
    label: "Custom",
    description: "Enter your own audience description",
  },
]

export const MESSAGING_ANGLES: MessagingAngle[] = [
  {
    id: "pain_point",
    label: "Parent Pain Point",
    description:
      "Tired of spending $3,000/year on Star Wars and Marvel? What if your kids could build something that actually matters?",
  },
  {
    id: "product_wow",
    label: "Product Wow",
    description:
      "1,163 pieces. Premium quality. An ancient ship and a massive whale. The most epic Bible build ever made.",
  },
  {
    id: "mission",
    label: "Mission / Movement",
    description:
      "We\u2019re building the world\u2019s first premium faith-based toy universe. Be one of the founding families.",
  },
  {
    id: "custom",
    label: "Custom",
    description: "Enter your own messaging angle",
  },
]

export const PLATFORMS: { id: Platform; label: string }[] = [
  { id: "meta_feed", label: "Meta / Facebook Feed" },
  { id: "instagram_stories_reels", label: "Instagram Stories / Reels" },
  { id: "tiktok", label: "TikTok" },
  { id: "google_display", label: "Google Display" },
  { id: "general", label: "General / Multi-purpose" },
]
