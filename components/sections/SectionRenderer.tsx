'use client'

import { HeroSection } from './HeroSection'
import { ServicesGridSection } from './ServicesGridSection'
import { CTABandSection } from './CTABandSection'
import { RichTextSection } from './RichTextSection'
import { FAQSection } from './FAQSection'
import { TestimonialsSection } from './TestimonialsSection'
import { ImportadoraTeaserSection } from './ImportadoraTeaserSection'
import { StatsSection } from './StatsSection'
import { ImageTextSection } from './ImageTextSection'
import { ContactBlockSection } from './ContactBlockSection'

interface Section {
  id: string
  type: string
  content: any
  visible: boolean
}

interface SectionRendererProps {
  sections: Section[]
}

export function SectionRenderer({ sections }: SectionRendererProps) {
  if (!sections || sections.length === 0) {
    return null
  }

  return (
    <>
      {sections.map((section) => {
        if (!section.visible) return null

        switch (section.type) {
          case 'HERO':
            return <HeroSection key={section.id} content={section.content} />
          case 'SERVICES_GRID':
            return <ServicesGridSection key={section.id} content={section.content} />
          case 'CTA_BAND':
            return <CTABandSection key={section.id} content={section.content} />
          case 'RICH_TEXT':
            return <RichTextSection key={section.id} content={section.content} />
          case 'FAQ':
            return <FAQSection key={section.id} content={section.content} />
          case 'TESTIMONIALS':
            return <TestimonialsSection key={section.id} content={section.content} />
          case 'IMPORTADORA_TEASER':
            return <ImportadoraTeaserSection key={section.id} content={section.content} />
          case 'STATS':
            return <StatsSection key={section.id} content={section.content} />
          case 'IMAGE_TEXT':
            return <ImageTextSection key={section.id} content={section.content} />
          case 'CONTACT_BLOCK':
            return <ContactBlockSection key={section.id} content={section.content} />
          default:
            return null
        }
      })}
    </>
  )
}

