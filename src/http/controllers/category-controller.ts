import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function listCategories(_: FastifyRequest, reply: FastifyReply) {
  try {
    const categories = await prisma.category.findMany()
    return reply.status(200).send(categories)
  } catch (error) {
    throw new Error()
  }
}

export async function getCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getCategoryBodySchema = z.object({
    uuid: z.string().min(36).max(36),
  })

  const { uuid } = getCategoryBodySchema.parse(request.params)

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: uuid,
      },
    })

    if (!category) {
      return reply.status(404).send({ message: 'Category not found' })
    }

    return reply.status(200).send(category)
  } catch (error) {}
}

export async function createCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createCategorySchema = z.object({
    title: z.string().nonempty().max(150, { message: 'Title is too long' }),
    images: z.string().nonempty({ message: 'Images are required' }),
  })

  const { title, images } = createCategorySchema.parse(request.body)
  const slug = title.toLowerCase().replace(/ /g, '-')

  try {
    const categoryExists = await prisma.category.findUnique({
      where: {
        slug,
      },
    })

    if (categoryExists) {
      return reply.status(400).send({ message: 'Category already exists' })
    }

    await prisma.category.create({
      data: {
        title,
        slug,
        images,
      },
    })
    return reply.status(201).send({ message: 'Category created' })
  } catch (error) {}
}

export async function updateCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createUpdateCategoryBodySchema = z.object({
    uuid: z.string().min(36).max(36),
  })

  const { uuid } = createUpdateCategoryBodySchema.parse(request.params)

  const createUpdateCategorySchema = z.object({
    title: z.string().nonempty().max(150, { message: 'Title is too long' }),
    images: z.string().nonempty({ message: 'Images are required' }),
  })

  const { title, images } = createUpdateCategorySchema.parse(request.body)
  const slug = title.toLowerCase().replace(/ /g, '-')

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: uuid,
      },
    })

    if (!category) {
      return reply.status(404).send({ message: 'Category not found' })
    }

    await prisma.category.update({
      where: {
        id: uuid,
      },
      data: {
        title,
        slug,
        images,
      },
    })

    return reply.status(200).send({ message: 'Category updated' })
  } catch (error) {}
}

export async function deleteCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createDeleteCategoryBodySchema = z.object({
    uuid: z.string().min(36).max(36),
  })

  const { uuid } = createDeleteCategoryBodySchema.parse(request.params)

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: uuid,
      },
    })

    if (!category) {
      return reply.status(404).send({ message: 'Category not found' })
    }

    await prisma.category.delete({
      where: {
        id: uuid,
      },
    })

    return reply.status(200).send({ message: 'Category deleted' })
  } catch (error) {}
}
