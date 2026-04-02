"use server"

import { prisma } from "@/lib/db/prisma"

export async function getCreators() {
  return await prisma.creator.findMany({
    include: {
      postStyles: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  })
}
