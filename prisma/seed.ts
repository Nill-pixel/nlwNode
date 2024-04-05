import { prisma } from '../src/lib/prisma'
const seed = async () => {
  await prisma.event.create({
    data: {
      id: '905c5c31-4d5f-464f-bcc3-203a1c2a090c',
      title: 'Unit Summit',
      slug: 'unit-summit',
      details: 'Um event p/ devs apaixonados(as) por código!',
      maximumAttendees: 120
    }
  })
}

seed().then(() => {
  console.log('Database seeded!')
  prisma.$disconnect()
})