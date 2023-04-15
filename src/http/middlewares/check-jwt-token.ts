import { FastifyRequest, FastifyReply } from 'fastify'

export async function verifyToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify()
  } catch (error) {
    reply.send(error)
  }
}
