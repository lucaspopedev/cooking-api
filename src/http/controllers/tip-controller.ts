import { PrismaTipRepository } from '@/repositories/prisma/prisma-tip-repository'
import { slugify } from '@/utils/slugify'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function listTips(_: FastifyRequest, reply: FastifyReply) {
  const tipRepository = new PrismaTipRepository()

  try {
    const tips = await tipRepository.findMany()

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

  const tipRepository = new PrismaTipRepository()

  try {
    const tip = await tipRepository.findUnique(uuid)

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

  const tipRepository = new PrismaTipRepository()

  try {
    const tip = await tipRepository.create({
        title,
        slug: slugify(title),
        images,
        content,
        user_id,
        category_id,
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

  const tipRepository = new PrismaTipRepository()

  try {
    const tip = await tipRepository.update({
        id: uuid,
        title,
        slug: slugify(title),
        images,
        content,
        user_id,
        category_id,
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

  const tipRepository = new PrismaTipRepository()

  try {
    const tip = tipRepository.delete(uuid)

    return reply.status(200).send(tip)
  } catch (error) {
    console.error(error)
  }
}
