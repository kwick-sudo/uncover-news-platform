import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');

  let where = {};
  if (tag) {
    where = {
      tags: {
        hasSome: [tag]
      }
    };
  }

  const stories = await prisma.story.findMany({
    where,
    include: { source: true },
    orderBy: { createdAt: 'desc' }
  });
  
  return Response.json(stories);
}
