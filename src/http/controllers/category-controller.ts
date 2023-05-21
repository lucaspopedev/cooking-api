import { PrismaCategoryRepository } from '@/repositories/prisma/prisma-category-repository'
import { UpdateCategoryUseCase } from '@/use-cases/update-category'
import { slugify } from '@/utils/slugify'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function listCategories(_: FastifyRequest, reply: FastifyReply) {
  try {
    const categoryRepository = new PrismaCategoryRepository()

    const categories = await categoryRepository.findMany()

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

  const categoryRepository = new PrismaCategoryRepository()

  try {
    const category = await categoryRepository.findUnique(uuid)

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

  const categoryRepository = new PrismaCategoryRepository()

  try {
    await categoryRepository.create({
      title,
      slug: slugify(title),
      images,
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

  const categoryRepository = new PrismaCategoryRepository()
  const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository)

  try {
    await updateCategoryUseCase.execute({
      uuid,
      title,
      images,
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

  const categoryRepository = new PrismaCategoryRepository()

  try {
    const category = await categoryRepository.findUnique(uuid)

    if (!category) {
      return reply.status(404).send({ message: 'Category not found' })
    }

    categoryRepository.delete(uuid)

    return reply.status(200).send({ message: 'Category deleted' })
  } catch (error) {}
}
