import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function removeDuplicateServices() {
  try {
    const homePage = await prisma.page.findUnique({
      where: { slug: 'home' },
      include: {
        sections: {
          where: { type: 'SERVICES_GRID' },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!homePage) {
      console.log('Home page not found')
      return
    }

    const servicesGrids = homePage.sections.filter(s => s.type === 'SERVICES_GRID')
    
    if (servicesGrids.length > 1) {
      console.log(`Found ${servicesGrids.length} SERVICES_GRID sections. Keeping the first one, deleting the rest...`)
      
      // Keep the first one (oldest), delete the rest
      const toDelete = servicesGrids.slice(1)
      
      for (const section of toDelete) {
        await prisma.section.delete({
          where: { id: section.id },
        })
        console.log(`✅ Deleted duplicate section ${section.id}`)
      }
      
      console.log('✅ Duplicate sections removed!')
    } else {
      console.log('No duplicate SERVICES_GRID sections found.')
    }
  } catch (error) {
    console.error('Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

removeDuplicateServices()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

