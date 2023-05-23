import { prisma } from '@/lib/prisma'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { compare } from 'bcryptjs'

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const loginBodySchema = z.object({
    email: z.string().email().nonempty(),
    password: z.string().min(8),
  })

  const { email, password } = loginBodySchema.parse(request.body)

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    return reply.status(400).send({
      error: 'invalid email or password',
    })
  }

  const verifyPass = await compare(password, user.password_hash)

  if (!verifyPass) {
    return reply.status(400).send({
      error: 'invalid email or password',
    })
  }

  const token = await reply.jwtSign(
    {},
    {
      sign: {
        sub: user.id,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    {},
    {
      sign: {
        sub: user.id,
        expiresIn: '7d',
      },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({
      token,
    })
}
