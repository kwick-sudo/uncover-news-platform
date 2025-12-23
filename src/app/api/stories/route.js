import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      include: {
        source: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return Response.json(stories);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
