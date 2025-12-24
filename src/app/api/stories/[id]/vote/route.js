import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  const { id } = await params;
  const { voteType } = await request.json();

  if (!['upvote', 'downvote'].includes(voteType)) {
    return new Response(JSON.stringify({ error: 'Invalid vote type' }), { status: 400 });
  }

  try {
    const story = await prisma.story.findUnique({
      where: { id: parseInt(id) }
    });

    if (!story) {
      return new Response(JSON.stringify({ error: 'Story not found' }), { status: 404 });
    }

    const updateData = voteType === 'upvote' 
      ? { upvotes: story.upvotes + 1 }
      : { downvotes: story.downvotes + 1 };

    const updatedStory = await prisma.story.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { source: true }
    });

    return new Response(JSON.stringify(updatedStory), { status: 200 });
  } catch (error) {
    console.error('Vote error:', error);
    return new Response(JSON.stringify({ error: 'Failed to vote' }), { status: 500 });
  }
}
