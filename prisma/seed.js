const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create sources
  const source1 = await prisma.source.create({
    data: {
      name: 'ProPublica',
      url: 'https://propublica.org',
      tier: 1,
      credibilityScore: 9.4,
    },
  });

  const source2 = await prisma.source.create({
    data: {
      name: 'Financial Times',
      url: 'https://ft.com',
      tier: 1,
      credibilityScore: 9.1,
    },
  });

  // Create stories
  await prisma.story.create({
    data: {
      title: 'Environmental Report Contradicts Company\'s Public Claims',
      tldr: 'Independent analysis reveals pollution levels 3x higher than reported. EPA launches surprise inspection. Company stock falls 12% on news.',
      link: 'https://propublica.org/example',
      sourceId: source1.id,
      credibilityScore: 9.4,
      tags: ['#environment', '#corporate'],
      upvotes: 756,
      downvotes: 0,
      clicks: 1200,
    },
  });

  await prisma.story.create({
    data: {
      title: 'Political Figure Faces New Questions Over Financial Records',
      tldr: 'Court documents show undisclosed transactions. Watchdog groups calling for investigation. Official response pending.',
      link: 'https://ft.com/example',
      sourceId: source2.id,
      credibilityScore: 9.1,
      tags: ['#politics', '#investigative'],
      upvotes: 1200,
      downvotes: 0,
      clicks: 2300,
    },
  });

  console.log('Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
