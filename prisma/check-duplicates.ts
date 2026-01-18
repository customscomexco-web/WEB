import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDuplicates() {
  try {
    const homePage = await prisma.page.findUnique({
      where: { slug: 'home' },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!homePage) {
      console.log('Home page not found')
      return
    }

    console.log('Sections in home page:')
    homePage.sections.forEach((section, index) => {
      console.log(`${index + 1}. Type: ${section.type}, Order: ${section.order}, Visible: ${section.visible}, ID: ${section.id}`)
      if (section.type === 'SERVICES_GRID') {
        const content = section.content as any
        console.log(`   Title: ${content?.title || 'No title'}`)
      }
    })

    // Check for duplicate SERVICES_GRID
    const servicesGrids = homePage.sections.filter(s => s.type === 'SERVICES_GRID')
    if (servicesGrids.length > 1) {
      console.log(`\n⚠️  Found ${servicesGrids.length} SERVICES_GRID sections!`)
      console.log('Duplicates:')
      servicesGrids.forEach((section, index) => {
        console.log(`  ${index + 1}. ID: ${section.id}, Order: ${section.order}`)
      })
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDuplicates()

