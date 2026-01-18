import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function removeAllDuplicates() {
  try {
    const homePage = await prisma.page.findUnique({
      where: { slug: 'home' },
      include: {
        sections: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!homePage) {
      console.log('Home page not found')
      return
    }

    console.log(`Found ${homePage.sections.length} sections total`)

    // Group by type and order
    const sectionsByTypeAndOrder: { [key: string]: any[] } = {}
    
    homePage.sections.forEach(section => {
      const key = `${section.type}_${section.order}`
      if (!sectionsByTypeAndOrder[key]) {
        sectionsByTypeAndOrder[key] = []
      }
      sectionsByTypeAndOrder[key].push(section)
    })

    // Find and remove duplicates (keep the first one, delete the rest)
    let deletedCount = 0
    
    for (const [key, sections] of Object.entries(sectionsByTypeAndOrder)) {
      if (sections.length > 1) {
        console.log(`\n⚠️  Found ${sections.length} duplicates for ${key}:`)
        const toDelete = sections.slice(1) // Keep first, delete rest
        
        for (const section of toDelete) {
          await prisma.section.delete({
            where: { id: section.id },
          })
          console.log(`  ✅ Deleted: ${section.type} (Order: ${section.order}, ID: ${section.id})`)
          deletedCount++
        }
      }
    }

    if (deletedCount === 0) {
      console.log('✅ No duplicate sections found.')
    } else {
      console.log(`\n✅ Removed ${deletedCount} duplicate sections!`)
    }
  } catch (error) {
    console.error('Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

removeAllDuplicates()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

