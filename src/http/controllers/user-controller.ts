import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function listUsers(_: FastifyRequest, reply: FastifyReply) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        full_name: true,
        email: true,
        updated_at: true,
        created_at: true,
      },
    })
    return reply.status(201).send(users)
  } catch (error) {
    throw new Error()
  }
}

export async function getUser(request: FastifyRequest, reply: FastifyReply) {
  const createGetUserSchema = z.object({
    uuid: z.string().min(36).max(36),
  })

  const { uuid } = createGetUserSchema.parse(request.params)

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: uuid,
      },
    })

    if (!user) {
      return reply.status(404).send({ message: 'User not found' })
    }

    return reply.status(201).send(user)
  } catch (error) {
    throw new Error()
  }
}

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const createUserBodySchema = z.object({
    full_name: z.string().min(5),
    email: z.string().email(),
    password: z.string().min(8),
  })

  const { full_name, email, password } = createUserBodySchema.parse(
    request.body,
  )

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    return reply.status(400).send({
      error: 'E-mail already exists!',
    })
  }

  const password_hash = await hash(password, 8)

  try {
    await prisma.user.create({
      data: {
        full_name,
        email,
        password_hash,
      },
    })

    return reply.status(201).send()
  } catch (error) {}
}

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  const createUserBodySchema = z.object({
    full_name: z.string().min(5),
    email: z.string().email(),
    password: z.string().min(8),
  })

  const createUuidBodySchema = z.object({
    uuid: z.string().min(36).max(36),
  })

  const { full_name, email, password } = createUserBodySchema.parse(
    request.body,
  )

  const { uuid } = createUuidBodySchema.parse(request.params)

  const userExists = await prisma.user.findUnique({
    where: {
      id: uuid,
    },
  })

  if (!userExists) {
    return reply.status(404).send()
  }

  const password_hash = await hash(password, 8)

  await prisma.user.update({
    where: {
      id: uuid,
    },
    data: {
      full_name,
      email,
      password_hash,
    },
  })

  return reply.status(200).send()
}

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  const createDeleteUserSchema = z.object({
    uuid: z.string().min(36).max(36),
  })

  const { uuid } = createDeleteUserSchema.parse(request.params)

  const userExists = await prisma.user.findUnique({
    where: {
      id: uuid,
    },
  })

  if (!userExists) {
    return reply.status(404).send()
  }

  await prisma.user.delete({
    where: {
      id: uuid,
    },
  })
  return reply.status(200).send()
}
