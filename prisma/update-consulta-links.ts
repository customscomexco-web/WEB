import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateConsultaLinks() {
  console.log('🔄 Updating consulta links and texts...')

  try {
    // Get all sections
    const sections = await prisma.section.findMany()

    for (const section of sections) {
      const content = section.content as any
      let updated = false
      const newContent = { ...content }

      // Update HERO sections
      if (section.type === 'HERO') {
        if (content.primaryCta) {
          if (content.primaryCta.text === 'Agendar Consulta' || content.primaryCta.link === '#contacto') {
            newContent.primaryCta = {
              text: 'Consultar',
              link: '/consultar',
            }
            updated = true
          }
        }
        if (content.secondaryCta?.link === '#contacto') {
          newContent.secondaryCta = {
            ...content.secondaryCta,
            link: '/consultar',
          }
          updated = true
        }
      }

      // Update CTA_BAND sections
      if (section.type === 'CTA_BAND') {
        if (content.cta) {
          if (content.cta.text === 'Agendar Consulta' || content.cta.link === '#contacto') {
            newContent.cta = {
              text: 'Consultar',
              link: '/consultar',
            }
            updated = true
          }
        }
      }

      if (updated) {
        await prisma.section.update({
          where: { id: section.id },
          data: { content: newContent },
        })
        console.log(`✅ Updated section ${section.id}`)
      }
    }

    console.log('✅ All sections updated!')
  } catch (error) {
    console.error('❌ Error updating sections:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateConsultaLinks()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

