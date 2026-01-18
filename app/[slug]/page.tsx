import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SectionRenderer } from '@/components/sections/SectionRenderer'
import { ParallaxScene } from '@/components/parallax/ParallaxScene'

export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 60

async function getPageData(slug: string) {
  const page = await prisma.page.findUnique({
    where: { slug },
    include: {
      sections: {
        where: { visible: true },
        orderBy: { order: 'asc' },
      },
    },
  })

  return page
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await getPageData(params.slug)

  if (!page) {
    return {}
  }

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription,
    openGraph: {
      title: page.seoTitle || page.title,
      description: page.seoDescription || '',
      images: page.ogImageUrl ? [page.ogImageUrl] : [],
    },
  }
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const page = await getPageData(params.slug)

  if (!page || !page.published) {
    notFound()
  }

  // Determine parallax scene based on slug
  let parallaxType: 'hero' | 'services' | 'importadora' | null = null
  if (params.slug === 'servicios') {
    parallaxType = 'services'
  } else if (params.slug === 'importadora') {
    parallaxType = 'importadora'
  }

  const heroSection = page.sections.find(s => s.type === 'HERO')
  const otherSections = page.sections.filter(s => s.type !== 'HERO')

  return (
    <>
      {heroSection && parallaxType ? (
        <ParallaxScene type={parallaxType} className="relative">
          <SectionRenderer sections={[heroSection]} />
        </ParallaxScene>
      ) : heroSection ? (
        <SectionRenderer sections={[heroSection]} />
      ) : null}
      <SectionRenderer sections={otherSections} />
    </>
  )
}

