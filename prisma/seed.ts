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
  await prisma.postStyle.deleteMany({})
  await prisma.creator.deleteMany({})

  const creatorsData = [
    // ── 1. Holy Sprouts (Small — ~100K) ───────────────────────
    {
      name: "Holy Sprouts",
      platform: "YouTube & TikTok",
      description:
        "The 'Christian Ms. Rachel' — Ms. Amy creates educational Bible content for toddlers and preschoolers with sign language, songs, and interactive learning. Trusted by 100K+ parents.",
      profileUrl: "https://www.youtube.com/@holy_sprouts",
      followerCount: "100K+ subscribers",
      sortOrder: 1,
      postStyles: {
        create: [
          {
            title: "Interactive Bible Lessons for Toddlers",
            description:
              "Slow-paced, engaging lessons that teach Bible stories through sign language, songs, and repetition. Film yourself talking directly to camera like a preschool teacher — parents love the calm, educational style.",
            videoId: null,
            icon: "Heart",
            sortOrder: 1,
          },
          {
            title: "Sunday School Song Sing-Alongs",
            description:
              "Classic Sunday school songs (Jesus Loves Me, This Little Light of Mine) performed with hand motions and on-screen lyrics. Low stimulation, high engagement. Perfect for ages 2-5.",
            videoId: null,
            icon: "Music",
            sortOrder: 2,
          },
          {
            title: "ABC & Bible Verse Learning",
            description:
              "Combine everyday learning (alphabet, counting, colors) with Bible verses and prayer. Parents search for 'Christian educational content' — this niche has very little competition.",
            videoId: null,
            icon: "BookOpen",
            sortOrder: 3,
          },
        ],
      },
    },

    // ── 2. Crossroads Kids Club (Small — ~50K) ───────────────
    {
      name: "Crossroads Kids Club",
      platform: "YouTube",
      description:
        "Children's ministry from Crossroads Church creating the 'God's Story' animated Bible series. Engaging retellings that connect ancient stories to modern kids' lives.",
      profileUrl: "https://www.youtube.com/@crdschurchkc",
      followerCount: "50K+ subscribers",
      sortOrder: 2,
      postStyles: {
        create: [
          {
            title: "Animated Bible Story Series",
            description:
              "Beautifully animated 3-5 minute retellings of Bible stories with narration and music. Their 'God's Story' series covers Creation through Jesus. Create a consistent series kids can follow week by week.",
            videoId: "Kg2lkCxjMg8",
            icon: "Film",
            sortOrder: 1,
          },
          {
            title: "Live-Action Bible Retellings",
            description:
              "Real people acting out Bible stories with costumes, humor, and behind-the-scenes footage. Low budget but high engagement — kids love seeing real people bring stories to life.",
            videoId: "NDL3Eq5YWjA",
            icon: "Theater",
            sortOrder: 2,
          },
          {
            title: "Character-Focused Lessons",
            description:
              "Deep dives into one Bible character per video (Gideon, Ruth, Peter) with a clear takeaway kids can apply today. Great for Sunday school at home or homeschool groups.",
            videoId: "U68cIMZSgvQ",
            icon: "User",
            sortOrder: 3,
          },
        ],
      },
    },

    // ── 3. CJ and Friends (Small — growing) ──────────────────
    {
      name: "CJ and Friends",
      platform: "YouTube & TikTok",
      description:
        "Dance-along worship videos for kids featuring choreography to popular worship songs. Gets kids moving and praising — a unique blend of exercise and faith.",
      profileUrl: "https://www.youtube.com/@cjandfriends",
      followerCount: "Growing channel",
      sortOrder: 3,
      postStyles: {
        create: [
          {
            title: "Worship Dance-Alongs",
            description:
              "Choreographed dance videos set to worship songs like 'Every Move I Make' and 'Here I Am to Worship.' On-screen lyrics + easy-to-follow moves. Parents love content that gets kids active AND worshipping.",
            videoId: null,
            icon: "Music",
            sortOrder: 1,
          },
          {
            title: "Praise Party Videos",
            description:
              "High-energy group dance sessions with multiple kids dancing together. Create a 'party' atmosphere that makes worship feel fun and social — great for sharing in kids' ministry groups.",
            videoId: null,
            icon: "PartyPopper",
            sortOrder: 2,
          },
          {
            title: "Scripture Motion Songs",
            description:
              "Pair Bible verses with simple hand motions and catchy melodies. Kids memorize scripture through movement — the physical actions help retention. 30-60 seconds, perfect for Reels/TikTok.",
            videoId: null,
            icon: "Sparkles",
            sortOrder: 3,
          },
        ],
      },
    },

    // ── 4. Listener Kids (Medium — growing fast) ─────────────
    {
      name: "Listener Kids",
      platform: "YouTube",
      description:
        "Grammy-nominated producer's modern remixes of classic Sunday school songs. Think 'Christian Cocomelon' — vibrant animated videos that make worship music irresistible to young kids.",
      profileUrl: "https://www.youtube.com/@listenerkids",
      followerCount: "Growing fast",
      sortOrder: 4,
      postStyles: {
        create: [
          {
            title: "Modern Worship Song Remixes",
            description:
              "Take classic hymns and Sunday school songs (Jesus Loves Me, This Little Light) and produce them with modern beats, colorful animation, and kid singers. High production value makes these shareable.",
            videoId: null,
            icon: "Music",
            sortOrder: 1,
          },
          {
            title: "Sing-Along Lyric Videos",
            description:
              "Bouncing-ball lyric videos with animated characters singing worship songs. Parents play these in the car, at home, and at bedtime. The key is catchy arrangements kids want to hear on repeat.",
            videoId: null,
            icon: "Mic",
            sortOrder: 2,
          },
          {
            title: "Bible Verse Memory Songs",
            description:
              "Set specific scripture verses to original melodies with colorful visuals. Each video focuses on one verse — post weekly as a 'Verse of the Week' series. Homeschool parents save and share these.",
            videoId: null,
            icon: "BookOpen",
            sortOrder: 3,
          },
        ],
      },
    },

    // ── 5. Bible Story Kids (Small) ──────────────────────────
    {
      name: "Bible Story Kids",
      platform: "YouTube",
      description:
        "Low-stimulation Bible storytelling with a stuffed bear companion. Gentle, calm narration perfect for toddlers and preschoolers — the antidote to overstimulating kids' content.",
      profileUrl: "https://www.youtube.com/@biblestorykidsshow",
      followerCount: "Small & growing",
      sortOrder: 5,
      postStyles: {
        create: [
          {
            title: "Gentle Bible Story Narration",
            description:
              "Calm, slow-paced retellings of Bible stories using simple illustrations and a soft voice. No flashing lights or rapid cuts. Parents seeking low-stimulation content specifically search for this style.",
            videoId: null,
            icon: "BookOpen",
            sortOrder: 1,
          },
          {
            title: "Stuffed Animal Companion Teaching",
            description:
              "Use a lovable puppet or stuffed animal as a co-host who 'learns' alongside the kids. The character asks questions kids would ask, making the content interactive and relatable.",
            videoId: null,
            icon: "Heart",
            sortOrder: 2,
          },
          {
            title: "Bedtime Bible Stories",
            description:
              "Soothing 3-5 minute Bible stories designed for bedtime routines. Soft music, gentle narration, calming visuals. Parents add these to their nightly routine — builds a daily viewing habit.",
            videoId: null,
            icon: "Moon",
            sortOrder: 3,
          },
        ],
      },
    },

    // ── 6. Fizzlebop (Small — unique niche) ──────────────────
    {
      name: "Fizzlebop",
      platform: "YouTube",
      description:
        "Science experiments with a faith focus. A quirky, fun character teaches kids about God through hands-on experiments — proving that faith and curiosity go hand in hand.",
      profileUrl: "https://www.youtube.com/@fizzlebop",
      followerCount: "Small & niche",
      sortOrder: 6,
      postStyles: {
        create: [
          {
            title: "Faith + Science Experiments",
            description:
              "Hands-on science experiments that illustrate biblical principles (e.g., invisible ink for 'hidden things of God,' volcano for God's power). Film step-by-step so kids can do them at home.",
            videoId: null,
            icon: "Sparkles",
            sortOrder: 1,
          },
          {
            title: "Character-Driven Teaching",
            description:
              "Create a memorable, quirky character (lab coat, goggles, catchphrase) who hosts every video. Kids connect with consistent characters — builds loyalty and 'appointment viewing.'",
            videoId: null,
            icon: "User",
            sortOrder: 2,
          },
          {
            title: "Wonder & Worship Moments",
            description:
              "End each experiment with a 'wonder moment' connecting the science to God's creation. Short, reflective segments that model curiosity + faith together. Unique positioning in the market.",
            videoId: null,
            icon: "Search",
            sortOrder: 3,
          },
        ],
      },
    },

    // ── 7. Jingle Jacqui (Small — unique niche) ──────────────
    {
      name: "Jingle Jacqui",
      platform: "YouTube",
      description:
        "Songs, storytelling, and American Sign Language (ASL) to teach the Bible to little ones. Makes faith accessible to all children, including deaf and hard-of-hearing kids.",
      profileUrl: "https://www.youtube.com/@jinglejacquikids",
      followerCount: "Small & growing",
      sortOrder: 7,
      postStyles: {
        create: [
          {
            title: "ASL Bible Verse Songs",
            description:
              "Teach Bible verses through sign language set to music. Kids learn ASL while memorizing scripture — parents and teachers love the dual-learning aspect. Very shareable in special needs communities.",
            videoId: null,
            icon: "MessageSquare",
            sortOrder: 1,
          },
          {
            title: "Musical Bible Storytelling",
            description:
              "Tell Bible stories through original songs with guitar, simple visuals, and warm energy. The musical format helps kids remember stories better than narration alone. 2-4 minutes each.",
            videoId: null,
            icon: "Music",
            sortOrder: 2,
          },
          {
            title: "Interactive Sign-Along Videos",
            description:
              "Teach kids to sign along to worship songs with clear demonstrations. Post short clips (30-60 seconds) on Reels/TikTok showing one sign at a time. Builds an engaged, loyal community.",
            videoId: null,
            icon: "Heart",
            sortOrder: 3,
          },
        ],
      },
    },

    // ── 8. The Holy Tales (Medium — ~200K) ───────────────────
    {
      name: "The Holy Tales",
      platform: "YouTube",
      description:
        "Animated Bible songs, nursery rhymes, and stories designed to make biblical education fun and joyful for young children. Colorful animation with catchy music throughout.",
      profileUrl: "https://www.youtube.com/@TheHolyTales",
      followerCount: "200K+ subscribers",
      sortOrder: 8,
      postStyles: {
        create: [
          {
            title: "Animated Bible Nursery Rhymes",
            description:
              "Turn Bible stories into catchy nursery rhyme-style songs with colorful animation. The sing-song format is irresistible to toddlers — they watch on repeat, absorbing scripture without realizing it.",
            videoId: null,
            icon: "Music",
            sortOrder: 1,
          },
          {
            title: "Bible Story Compilations",
            description:
              "Combine 5-10 short Bible story animations into a 20-30 minute compilation. Parents use these as screen time blocks — longer videos mean higher watch time and better algorithmic promotion.",
            videoId: null,
            icon: "Film",
            sortOrder: 2,
          },
          {
            title: "Scripture Song Shorts",
            description:
              "15-30 second clips of a single Bible verse set to animation and music. Designed for YouTube Shorts and TikTok — quick, catchy, and highly shareable. Post daily for rapid growth.",
            videoId: null,
            icon: "Sparkles",
            sortOrder: 3,
          },
        ],
      },
    },

    // ── 9. Saddleback Kids (Medium — ~200K) ──────────────────
    {
      name: "Saddleback Kids",
      platform: "YouTube",
      description:
        "Children's ministry from Saddleback Church offering energetic worship songs, Bible lessons, and kid-focused teaching that makes church fun even at home.",
      profileUrl: "https://www.youtube.com/@SaddlebackKids",
      followerCount: "200K+ subscribers",
      sortOrder: 9,
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
            title: "Animated Bible Stories",
            description:
              "Colorful animated retellings of Bible stories (Creation, Solomon, Jesus' miracles) with engaging narration. 3-5 minutes each — the perfect length for kids' attention spans.",
            videoId: "teu7BCZTgDs",
            icon: "Film",
            sortOrder: 2,
          },
          {
            title: "Memory Verse Worship",
            description:
              "Scripture set to worship music with on-screen lyrics and motion graphics. Interactive style encourages kids to sing along and memorize. Post weekly as a 'Verse of the Week' series.",
            videoId: "9vz8FZYDwDU",
            icon: "Trophy",
            sortOrder: 3,
          },
        ],
      },
    },

    // ── 10. Bible Project (Large — reference/aspiration) ─────
    {
      name: "Bible Project",
      platform: "YouTube",
      description:
        "Beautiful hand-drawn animated videos explaining biblical themes and narratives. Their visual storytelling makes complex theology accessible for all ages — the gold standard for Bible content.",
      profileUrl: "https://bibleproject.com",
      followerCount: "5M+ subscribers",
      sortOrder: 10,
      postStyles: {
        create: [
          {
            title: "Whiteboard Book Overviews",
            description:
              "Hand-drawn animated overviews of each book of the Bible in 5-8 minutes. The whiteboard-style format makes complex ideas simple and visual. Highly shareable in churches and homeschool groups.",
            videoId: "GQI72THyO5I",
            icon: "Pencil",
            sortOrder: 1,
          },
          {
            title: "Theme Exploration Videos",
            description:
              "Deep dives into biblical themes (grace, justice, covenant, holiness) with rich animation. 3-5 minutes, accessible language. Position yourself as a thoughtful educator — these get shared widely.",
            videoId: "jH_aojNJM3E",
            icon: "Search",
            sortOrder: 2,
          },
          {
            title: "Character Study Animations",
            description:
              "Visual profiles of biblical figures (Esther, Ruth, David) highlighting their faith journey. Tell the hero's story with a clear takeaway — kids love heroes they can look up to.",
            videoId: "JydNSlufRIs",
            icon: "User",
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
