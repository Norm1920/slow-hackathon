import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // ── Demo users ──────────────────────────────────────────────
  const password = await bcrypt.hash("password", 10)

  const users = [
    { name: "Alice", email: "alice@example.com", password },
    { name: "Bob", email: "bob@example.com", password },
    { name: "Charlie", email: "charlie@example.com", password },
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    })
  }

  console.log("Seeded 3 demo users (password: 'password')")

  // ── Creators & Post Styles ──────────────────────────────────
  // Clear existing creator data so we can re-seed cleanly
  await prisma.postStyle.deleteMany({})
  await prisma.creator.deleteMany({})

  const creatorsData = [
    {
      name: "Minno",
      platform: "YouTube & App",
      description:
        "Award-winning Christian streaming service for kids with shows like What's in the Bible and Owlegories. Makes faith fun and accessible for young audiences.",
      profileUrl: "https://www.gominno.com",
      followerCount: "200K+ subscribers",
      sortOrder: 1,
      postStyles: {
        create: [
          {
            title: "Animated Bible Story Clips",
            description:
              "Short 2-3 minute animated clips retelling classic Bible stories with vibrant animation and kid-friendly narration. Perfect for YouTube Shorts and Instagram Reels to grab attention and teach scripture visually.",
            videoId: "GQI72THyO5I",
            icon: "Film",
            sortOrder: 1,
          },
          {
            title: "Character Lesson Shorts",
            description:
              "30-60 second clips featuring lovable characters teaching virtues like kindness, honesty, and patience through everyday scenarios kids can relate to. Great for TikTok and Stories.",
            videoId: "0h1eoBeR4Jk",
            icon: "Heart",
            sortOrder: 2,
          },
          {
            title: "Sing-Along Worship Songs",
            description:
              "Catchy original worship songs with animated visuals and on-screen lyrics that kids and parents can sing together. Works well as YouTube videos and audio clips for car rides.",
            videoId: "LiTw4ywsSYw",
            icon: "Music",
            sortOrder: 3,
          },
        ],
      },
    },
    {
      name: "VeggieTales",
      platform: "YouTube",
      description:
        "Classic Christian kids' entertainment featuring Bob the Tomato and Larry the Cucumber teaching biblical values through humor, storytelling, and unforgettable music.",
      profileUrl: "https://www.youtube.com/@veggietales",
      followerCount: "500K+ subscribers",
      sortOrder: 2,
      postStyles: {
        create: [
          {
            title: "Silly Song Saturdays",
            description:
              "Humorous musical numbers combining catchy melodies with wholesome messages. Post a weekly recurring series with a fun song clip — builds anticipation and keeps families coming back every week.",
            videoId: "teu7BCZTgDs",
            icon: "PartyPopper",
            sortOrder: 1,
          },
          {
            title: "Bible Story Parodies",
            description:
              "Creative retellings of biblical narratives using relatable characters and modern humor. Take a well-known Bible story and give it a fun twist that makes the lesson stick with kids.",
            videoId: "JydNSlufRIs",
            icon: "BookOpen",
            sortOrder: 2,
          },
          {
            title: "Memory Verse Moments",
            description:
              "Quick 15-second clips pairing a Bible verse with colorful, animated text and upbeat music. Designed to be saved and rewatched — perfect for Instagram Reels and TikTok.",
            videoId: "YEPGAV_UeV8",
            icon: "Sparkles",
            sortOrder: 3,
          },
        ],
      },
    },
    {
      name: "Bible App for Kids",
      platform: "Instagram & YouTube",
      description:
        "Interactive Bible experience from YouVersion designed for kids to explore God's Word through touch-based animated stories, activities, and daily devotionals.",
      profileUrl: "https://bibleappforkids.com",
      followerCount: "200K+ followers",
      sortOrder: 3,
      postStyles: {
        create: [
          {
            title: "Interactive Story Previews",
            description:
              "Teaser clips showing touch-based interactions from animated Bible stories. Show a 15-second screen recording of the interactive experience to drive app downloads and engagement.",
            videoId: "ihnnK9vQ3nM",
            icon: "Smartphone",
            sortOrder: 1,
          },
          {
            title: "Daily Devotional Graphics",
            description:
              "Colorful, shareable quote cards with kid-friendly scripture verses and simple illustrations. Post one each morning — parents save and share these as daily faith moments with their kids.",
            videoId: "j9phNEaPrv8",
            icon: "Image",
            sortOrder: 2,
          },
          {
            title: "Parent Tips & Discussion Guides",
            description:
              "Practical carousel posts giving parents 3-5 tips on teaching faith at home, with conversation starters tied to specific Bible stories. Highly saveable and shareable.",
            videoId: "A_QcGnwilXI",
            icon: "MessageSquare",
            sortOrder: 3,
          },
        ],
      },
    },
    {
      name: "Saddleback Kids",
      platform: "YouTube",
      description:
        "Children's ministry from Saddleback Church offering energetic worship songs, Bible lessons, and kid-focused teaching that makes church fun even at home.",
      profileUrl: "https://www.youtube.com/@SaddlebackKids",
      followerCount: "200K+ subscribers",
      sortOrder: 4,
      postStyles: {
        create: [
          {
            title: "High-Energy Worship Videos",
            description:
              "Full-production worship songs with choreography, motion graphics, and kid singers. Create content that gets kids moving and singing — parents love content that doubles as an activity.",
            videoId: "YEPGAV_UeV8",
            icon: "Mic",
            sortOrder: 1,
          },
          {
            title: "Bible Story Skits",
            description:
              "Live-action dramatic retellings of biblical events with humor and modern-day parallels. Use simple costumes and props to make stories come alive — low production cost, high engagement.",
            videoId: "ihnnK9vQ3nM",
            icon: "Theater",
            sortOrder: 2,
          },
          {
            title: "Memory Verse Challenges",
            description:
              "Interactive video challenges encouraging kids to memorize scripture through games, hand motions, and repetition. Include a call-to-action for kids to post their own attempts.",
            videoId: "9vz8FZYDwDU",
            icon: "Trophy",
            sortOrder: 3,
          },
        ],
      },
    },
    {
      name: "Bible Project",
      platform: "YouTube",
      description:
        "Beautiful hand-drawn animated videos that explain biblical themes and narratives. Their visual storytelling makes complex theology accessible and engaging for all ages.",
      profileUrl: "https://bibleproject.com",
      followerCount: "5M+ subscribers",
      sortOrder: 5,
      postStyles: {
        create: [
          {
            title: "Whiteboard Animation Shorts",
            description:
              "Hand-drawn animated explanations of Bible stories and concepts using a whiteboard-style format. The visual storytelling makes complex ideas simple — great for 1-3 minute YouTube and Instagram videos.",
            videoId: "GQI72THyO5I",
            icon: "Pencil",
            sortOrder: 1,
          },
          {
            title: "Theme Deep Dives",
            description:
              "3-5 minute videos exploring one biblical theme (grace, justice, covenant) in kid-friendly language with rich visuals. Position yourself as a thoughtful educator — these get shared in homeschool groups.",
            videoId: "jH_aojNJM3E",
            icon: "Search",
            sortOrder: 2,
          },
          {
            title: "Character Study Clips",
            description:
              "Visual profiles of biblical figures (David, Esther, Moses) highlighting their faith journey in 60-90 seconds. Tell the hero's story with a clear takeaway — kids love heroes they can look up to.",
            videoId: "JydNSlufRIs",
            icon: "User",
            sortOrder: 3,
          },
        ],
      },
    },
    {
      name: "Group Publishing Kids",
      platform: "YouTube & Instagram",
      description:
        "Children's ministry resources from Group Publishing featuring hands-on activities, creative Bible teaching, and faith-building content families can do together at home.",
      profileUrl: "https://www.group.com",
      followerCount: "75K+ followers",
      sortOrder: 6,
      postStyles: {
        create: [
          {
            title: "Craft-Along Videos",
            description:
              "Step-by-step Bible-based craft tutorials kids can follow at home with common supplies. Film overhead with clear instructions — parents search for these and save them for rainy days.",
            videoId: "BWdf_qbrGYg",
            icon: "Scissors",
            sortOrder: 1,
          },
          {
            title: "Animated Bible Adventures",
            description:
              "Character-led animated Bible lessons with fun storytelling and memorable catchphrases. Create a recurring character kids recognize and look forward to — builds loyalty and watch time.",
            videoId: "teu7BCZTgDs",
            icon: "Play",
            sortOrder: 2,
          },
          {
            title: "Family Discussion Prompts",
            description:
              "Short graphics or videos with 3 questions to spark faith conversations at dinner or bedtime. Simple format: one Bible verse + three open-ended questions. Highly shareable by parents.",
            videoId: "P_j75tV9kKM",
            icon: "MessagesSquare",
            sortOrder: 3,
          },
        ],
      },
    },
  ]

  for (const creatorData of creatorsData) {
    await prisma.creator.create({
      data: creatorData,
    })
  }

  console.log(`Seeded ${creatorsData.length} creators with post styles`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
