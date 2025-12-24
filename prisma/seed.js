const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seed() {
  await prisma.vote.deleteMany({})
  await prisma.story.deleteMany({})
  await prisma.source.deleteMany({})

  const sources = await Promise.all([
    prisma.source.create({ data: { name: 'ProPublica', url: 'https://www.propublica.org', tier: 1, credibilityScore: 9.4 } }),
    prisma.source.create({ data: { name: 'Reuters', url: 'https://www.reuters.com', tier: 1, credibilityScore: 9.2 } }),
    prisma.source.create({ data: { name: 'AP News', url: 'https://apnews.com', tier: 1, credibilityScore: 9.3 } }),
    prisma.source.create({ data: { name: 'Financial Times', url: 'https://www.ft.com', tier: 1, credibilityScore: 9.1 } }),
    prisma.source.create({ data: { name: 'WSJ', url: 'https://www.wsj.com', tier: 2, credibilityScore: 8.8 } }),
    prisma.source.create({ data: { name: 'The New York Times', url: 'https://www.nytimes.com', tier: 2, credibilityScore: 8.7 } }),
    prisma.source.create({ data: { name: 'The Washington Post', url: 'https://www.washingtonpost.com', tier: 2, credibilityScore: 8.6 } }),
    prisma.source.create({ data: { name: 'The Guardian', url: 'https://www.theguardian.com', tier: 2, credibilityScore: 8.5 } }),
    prisma.source.create({ data: { name: 'The Verge', url: 'https://www.theverge.com', tier: 3, credibilityScore: 8.0 } }),
    prisma.source.create({ data: { name: 'Inside Climate News', url: 'https://insideclimatenews.org', tier: 3, credibilityScore: 8.2 } })
  ])

  const sm = { propublica: sources[0], reuters: sources[1], ap: sources[2], ft: sources[3], wsj: sources[4], nyt: sources[5], wapo: sources[6], guardian: sources[7], verge: sources[8], icc: sources[9] }

  const stories = [
    { title: 'Political Figure Faces New Questions Over Financial Records', tldr: 'Court documents show undisclosed transactions. Watchdog groups calling for investigation. Official response pending.', link: 'https://example.com/story1', sourceId: sm.ft.id, credibilityScore: 9.1, tags: ['#politics', '#investigative', '#accountability'], upvotes: 1234, downvotes: 45, clicks: 2300 },
    { title: 'Tech Company Settles Lawsuit Over Data Collection Practices', tldr: 'Settlement includes admission of unauthorized data gathering. Company ordered to implement new privacy controls. Regulators announce expanded investigation.', link: 'https://example.com/story2', sourceId: sm.wsj.id, credibilityScore: 8.8, tags: ['#technology', '#privacy', '#surveillance'], upvotes: 892, downvotes: 23, clicks: 1800 },
    { title: 'Environmental Report Contradicts Company\'s Public Claims', tldr: 'Independent analysis reveals pollution levels 3x higher than reported. EPA launches surprise inspection. Company stock falls 12% on news.', link: 'https://example.com/story3', sourceId: sm.propublica.id, credibilityScore: 9.4, tags: ['#environment', '#corporate', '#investigation'], upvotes: 756, downvotes: 12, clicks: 1200 },
    { title: 'Hospital Network Sued Over Patient Safety Records', tldr: 'Families claim multiple incidents were covered up. Internal documents obtained by journalists corroborate claims. Regulatory board orders investigation.', link: 'https://example.com/story4', sourceId: sm.reuters.id, credibilityScore: 9.0, tags: ['#healthcare', '#accountability', '#lawsuit'], upvotes: 643, downvotes: 18, clicks: 980 },
    { title: 'Major Retail Chain Faces Supplier Audit After Labor Violations Discovered', tldr: 'Investigative report exposes unsafe working conditions in overseas factories. Company denies knowledge of violations. Activists call for boycott.', link: 'https://example.com/story5', sourceId: sm.guardian.id, credibilityScore: 8.5, tags: ['#corporate', '#labor', '#investigation'], upvotes: 521, downvotes: 31, clicks: 876 },
    { title: 'Bank Regulatory Violations Uncovered in Federal Audit', tldr: 'Documents reveal years of unreported transactions. Fines expected to exceed $100 million. Executives under investigation.', link: 'https://example.com/story6', sourceId: sm.nyt.id, credibilityScore: 8.7, tags: ['#finance', '#accountability', '#corruption'], upvotes: 445, downvotes: 22, clicks: 765 },
    { title: 'Antitrust Investigation Targets Tech Giant\'s Acquisition Strategy', tldr: 'Government agencies examining pattern of competitive acquisitions. Internal emails suggest anti-competitive intent. Potential breakup being considered.', link: 'https://example.com/story7', sourceId: sm.verge.id, credibilityScore: 8.0, tags: ['#technology', '#antitrust', '#investigation'], upvotes: 398, downvotes: 47, clicks: 654 },
    { title: 'Federal Agency Admits to Decade-Long Data Breach', tldr: 'Officials reveal security failures dating back 10 years. Millions of Americans potentially affected. Congressional hearings scheduled.', link: 'https://example.com/story8', sourceId: sm.ap.id, credibilityScore: 9.3, tags: ['#privacy', '#government', '#accountability'], upvotes: 876, downvotes: 25, clicks: 1456 },
    { title: 'Oil Company Deliberately Concealed Climate Impact Studies', tldr: 'Internal research showed risks decades before public acknowledgment. Scientists directed not to publish findings. Lawsuits pending.', link: 'https://example.com/story9', sourceId: sm.icc.id, credibilityScore: 8.2, tags: ['#environment', '#corporate', '#climate'], upvotes: 654, downvotes: 89, clicks: 1098 },
    { title: 'New Documents Reveal Scope of Influence Campaign', tldr: 'Leaked files show coordinated effort across multiple sectors. Foreign operatives allegedly involved. Intelligence agencies investigating.', link: 'https://example.com/story10', sourceId: sm.wapo.id, credibilityScore: 8.6, tags: ['#investigation', '#politics', '#foreign'], upvotes: 567, downvotes: 34, clicks: 945 },
    { title: 'Pharmaceutical Firm Withheld Negative Trial Results', tldr: 'Company suppressed research showing drug ineffectiveness. Shareholders file suit. FDA launches review of approval process.', link: 'https://example.com/story11', sourceId: sm.ft.id, credibilityScore: 9.1, tags: ['#pharma', '#accountability', '#fraud'], upvotes: 434, downvotes: 19, clicks: 723 },
    { title: 'Construction Company Falsified Safety Records at Major Project', tldr: 'Investigation finds pattern of unreported incidents. Multiple deaths linked to negligence. Criminal charges filed.', link: 'https://example.com/story12', sourceId: sm.reuters.id, credibilityScore: 9.2, tags: ['#safety', '#corporate', '#investigation'], upvotes: 389, downvotes: 8, clicks: 652 },
    { title: 'Financial Institution Exposed for Enabling Money Laundering', tldr: 'Banks processed billions for criminal networks. Compliance failures documented. Executives questioned by prosecutors.', link: 'https://example.com/story13', sourceId: sm.propublica.id, credibilityScore: 9.4, tags: ['#finance', '#crime', '#investigation'], upvotes: 523, downvotes: 12, clicks: 876 },
    { title: 'Election Official Uncovers Voting Machine Vulnerabilities', tldr: 'Security audit reveals critical flaws in systems used nationwide. Vendor disputes findings. State officials demand remedies.', link: 'https://example.com/story14', sourceId: sm.nyt.id, credibilityScore: 8.7, tags: ['#politics', '#security', '#accountability'], upvotes: 645, downvotes: 89, clicks: 1123 },
    { title: 'Social Media Platform Admits to Child Safety Failures', tldr: 'Internal documents show company ignored abuse reports. Executives knew of predator accounts. FTC investigation underway.', link: 'https://example.com/story15', sourceId: sm.wsj.id, credibilityScore: 8.8, tags: ['#technology', '#safety', '#accountability'], upvotes: 789, downvotes: 45, clicks: 1234 },
    { title: 'Insurance Company Systematically Denied Valid Claims', tldr: 'Pattern of discriminatory practices documented. Regulators order refunds to customers. Class action lawsuit approved.', link: 'https://example.com/story16', sourceId: sm.guardian.id, credibilityScore: 8.5, tags: ['#corporate', '#consumer', '#investigation'], upvotes: 456, downvotes: 23, clicks: 765 },
    { title: 'Defense Contractor Sold Weapons Technology to Hostile Nations', tldr: 'Federal investigation reveals unlawful exports over 5-year period. Company executives arrested. National security concerns raised.', link: 'https://example.com/story17', sourceId: sm.ap.id, credibilityScore: 9.3, tags: ['#national-security', '#accountability', '#investigation'], upvotes: 634, downvotes: 34, clicks: 987 },
    { title: 'Water Utility Concealed Contamination from Public', tldr: 'Internal reports showed dangerous levels for months. Officials ordered silence. Public health crisis now confirmed.', link: 'https://example.com/story18', sourceId: sm.icc.id, credibilityScore: 8.2, tags: ['#environment', '#public-health', '#accountability'], upvotes: 512, downvotes: 15, clicks: 854 },
    { title: 'Law Enforcement Agency Uses Warrantless Surveillance', tldr: 'Documents reveal systematic privacy violations. Thousands of citizens monitored without authorization. ACLU files lawsuit.', link: 'https://example.com/story19', sourceId: sm.wapo.id, credibilityScore: 8.6, tags: ['#privacy', '#surveillance', '#justice'], upvotes: 478, downvotes: 28, clicks: 798 },
    { title: 'Mining Company Violated Environmental Permit 200+ Times', tldr: 'State inspector finds systematic non-compliance over three years. Equipment damage causes spill. Fines assessed.', link: 'https://example.com/story20', sourceId: sm.ft.id, credibilityScore: 9.1, tags: ['#environment', '#corporate', '#enforcement'], upvotes: 389, downvotes: 11, clicks: 654 }
  ]

  for (const story of stories) {
    await prisma.story.create({ data: story })
  }

  console.log('✅ Seeded 20 stories with 10 sources')
}

seed().catch(e => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })
