import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/slugify'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function listTips(_: FastifyRequest, reply: FastifyReply) {
  try {
    const tips = await prisma.tip.findMany()

    return reply.status(200).send(tips)
  } catch (error) {
    console.log(error)
  }
}

export async function getTip(request: FastifyRequest, reply: FastifyReply) {
  const getTipBodySchema = z.object({
    uuid: z.string().min(36).max(36),
  })

  const { uuid } = getTipBodySchema.parse(request.params)

  try {
    const tip = await prisma.tip.findUnique({
      where: {
        id: uuid,
      },
    })

    if (!tip) {
      return reply.status(404).send({ message: 'Tip not found' })
    }

    return reply.status(200).send(tip)
  } catch (error) {}
}

export async function createTip(request: FastifyRequest, reply: FastifyReply) {
  const createTipSchema = z.object({
    title: z.string().nonempty(),
    images: z.string().nonempty(),
    content: z.string().nonempty(),
    user_id: z.string().min(36).max(36).nonempty(),
    category_id: z.string().min(36).max(36).nonempty(),
  })

  const { title, images, content, user_id, category_id } =
    createTipSchema.parse(request.body)

  try {
    const tip = await prisma.tip.create({
      data: {
        title,
        slug: slugify(title),
        images,
        content,
        user_id,
        category_id,
      },
    })

    return reply.status(201).send(tip)
  } catch (error) {
    console.error(error)
  }
}

export async function updateTip(request: FastifyRequest, reply: FastifyReply) {
  const createTipSchema = z.object({
    title: z.string().nonempty(),
    images: z.string().nonempty(),
    content: z.string().nonempty(),
    user_id: z.string().min(36).max(36).nonempty(),
    category_id: z.string().min(36).max(36).nonempty(),
  })

  const { title, images, content, user_id, category_id } =
    createTipSchema.parse(request.body)

  const getTipBodySchema = z.object({
    uuid: z.string().min(36).max(36),
  })

  const { uuid } = getTipBodySchema.parse(request.params)

  try {
    const tip = await prisma.tip.update({
      where: {
        id: uuid,
      },
      data: {
        title,
        slug: slugify(title),
        images,
        content,
        user_id,
        category_id,
      },
    })

    return reply.status(200).send(tip)
  } catch (error) {
    console.error(error)
  }
}

export async function deleteTip(request: FastifyRequest, reply: FastifyReply) {
  const getTipBodySchema = z.object({
    uuid: z.string().min(36).max(36),
  })

  const { uuid } = getTipBodySchema.parse(request.params)

  try {
    const tip = await prisma.tip.delete({
      where: {
        id: uuid,
      },
    })

    return reply.status(200).send(tip)
  } catch (error) {
    console.error(error)
  }
}
