import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { z } from 'zod'


const prisma = new PrismaClient({
  log: ['query']
})

const app = fastify()

app.post("/events", async (request, reply) => {
  const createEventSchema = z.object({
    title: z.string().min(4),
    details: z.string().nullable(),
    maximumAttendees: z.number().int().positive().nullable()
  })

  const data = createEventSchema.parse(request.body)

  const event = await prisma.event.create({
    data: {
      title: data.title,
      details: data.details,
      maximumAttendees: data.maximumAttendees,
      slug: new Date().toString()
    }
  })

  //return { eventId: event.id }
  return reply.status(201).send({ eventId: event.id })
})
app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running at http://localhost:3333");
})

