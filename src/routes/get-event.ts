import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { title } from "process";

export const getEvent = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId', {
      schema: {
        params: z.object({
          eventId: z.string().uuid()
        }),
        response: {
          200: {
            event: z.object({
              id: z.string().uuid(),
              title: z.string(),
              slug: z.string(),
              details: z.string().nullable(),
              maximumAttendees: z.number().int().nullable(),
              AttendeesAmount: z.number().int(),
            })
          }
        }
      }
    }, async (request, reply) => {
      const { eventId } = request.params

      const event = await prisma.event.findUnique({
        select: {
          id: true,
          title: true,
          slug: true,
          details: true,
          maximumAttendees: true,
          _count: {
            select: {
              Attendee: true
            }
          }
        },
        where: { id: eventId }
      })

      if (event === null) {
        throw new Error("Event not found. ")
      }

      return reply.send({
        event: {
          id: event.id,
          title: event.title,
          slug: event.slug,
          details: event.details,
          maximumAttendees: event.maximumAttendees,
          AttendeesAmount: event._count.Attendee
        }
      })
    })
}