import { prisma } from '@/lib/prisma'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { CreateUserUseCase } from '@/use-cases/create-user'
import { UpdateUserUseCase } from '@/use-cases/update-user'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function listUsers(_: FastifyRequest, reply: FastifyReply) {
  const userRepository = new PrismaUserRepository()
  
  try {
    const users = await userRepository.findMany()

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

  const userRepository = new PrismaUserRepository()

  try {
    const user = await userRepository.findUnique(uuid)

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

  const userRepository = new PrismaUserRepository()
  const createUserUseCase = new CreateUserUseCase(userRepository)

  try {
    await createUserUseCase.execute({
      full_name,
      email,
      password,
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

  const userRepository = new PrismaUserRepository()
  const updateUserUseCase = new UpdateUserUseCase(userRepository)

  try {
    await updateUserUseCase.execute({
      uuid,
      full_name,
      email,
      password,
    })

    return reply.status(200).send()
  
  } catch (error) {}
}

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  const createDeleteUserSchema = z.object({
    uuid: z.string().min(36).max(36),
  })

  const { uuid } = createDeleteUserSchema.parse(request.params)

  const userRepository = new PrismaUserRepository()

  const userExists = await userRepository.findUnique(uuid)

  if (!userExists) {
    return reply.status(404).send()
  }

  try {
    await prisma.user.delete({
      where: {
        id: uuid,
      },
    })
    return reply.status(200).send()
  } catch (error) {}
}
