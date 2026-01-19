import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { SectionRenderer } from '@/components/sections/SectionRenderer'
import { ParallaxScene } from '@/components/parallax/ParallaxScene'

export const dynamic = 'force-dynamic'
export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 60

async function getPageData() {
  const page = await prisma.page.findUnique({
    where: { slug: 'home' },
    include: {
      sections: {
        where: { visible: true },
        orderBy: { order: 'asc' },
      },
    },
  })

  return page
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageData()

  return {
    title: page?.seoTitle || page?.title || "Custom's & Comex CO",
    description: page?.seoDescription || 'Servicios profesionales de comercio exterior',
    openGraph: {
      title: page?.seoTitle || page?.title || "Custom's & Comex CO",
      description: page?.seoDescription || 'Servicios profesionales de comercio exterior',
      images: page?.ogImageUrl ? [page.ogImageUrl] : [],
    },
  }
}

export default async function HomePage() {
  const page = await getPageData()

  if (!page) {
    return <div>Página no encontrada</div>
  }

  // Find hero section to render with parallax
  const heroSection = page.sections.find(s => s.type === 'HERO')
  const otherSections = page.sections.filter(s => s.type !== 'HERO')

  return (
    <>
      {heroSection && (
        <ParallaxScene type="hero" className="relative">
          <SectionRenderer sections={[heroSection]} />
        </ParallaxScene>
      )}
      <SectionRenderer sections={otherSections} />
    </>
  )
}

