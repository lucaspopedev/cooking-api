import { prisma } from '@/lib/prisma'
import { slugify } from '@/utils/slugify'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function listRecipes(_: FastifyRequest, reply: FastifyReply) {
  try {
    const recipes = await prisma.recipe.findMany()
    return reply.status(200).send(recipes)
  } catch (error) {
    console.log(error)

    throw new Error()
  }
}

export async function getRecipe(request: FastifyRequest, reply: FastifyReply) {
  const createGetCategoryBodySchema = z.object({
    uuid: z.string().min(36).max(36),
  })

  const { uuid } = createGetCategoryBodySchema.parse(request.params)

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: uuid,
      },
    })

    if (!category) {
      return reply.status(404).send({ message: 'Recipe not found' })
    }

    return reply.status(200).send(category)
  } catch (error) {}
}

export async function createRecipe(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createRecipeSchema = z.object({
    title: z.string().nonempty(),
    preparation_time: z.string().nonempty(),
    difficulty: z.string().nonempty(),
    people_serv: z.coerce.number().int(),
    ingredients: z.string().nonempty(),
    images: z.string().nonempty(),
    content: z.string().nonempty(),
    preparation_steps: z.string().nonempty(),
    category_id: z.string().min(36).max(36).nonempty(),
    user_id: z.string().min(36).max(36).nonempty(),
  })

  const {
    title,
    preparation_time,
    difficulty,
    people_serv,
    ingredients,
    images,
    content,
    preparation_steps,
    category_id,
    user_id,
  } = createRecipeSchema.parse(request.body)

  try {
    const recipeExists = await prisma.recipe.findUnique({
      where: {
        slug: slugify(title),
      },
    })

    if (recipeExists) {
      return reply.status(400).send({ message: 'Recipe already exists' })
    }

    const recipe = await prisma.recipe.create({
      data: {
        title,
        slug: slugify(title),
        preparation_time,
        difficulty,
        people_serv,
        ingredients,
        images,
        content,
        preparation_steps,
        category_id,
        user_id,
      },
    })

    return reply.status(201).send(recipe)
  } catch (error) {
    console.log(error)
  }
}

export async function updateRecipe(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createRecipeSchema = z.object({
    title: z.string().nonempty(),
    preparation_time: z.string().nonempty(),
    difficulty: z.string().nonempty(),
    people_serv: z.coerce.number().int(),
    ingredients: z.string().nonempty(),
    images: z.string().nonempty(),
    content: z.string().nonempty(),
    preparation_steps: z.string().nonempty(),
    category_id: z.string().nonempty(),
    user_id: z.string().nonempty(),
  })

  const {
    title,
    preparation_time,
    difficulty,
    people_serv,
    ingredients,
    images,
    content,
    preparation_steps,
    category_id,
    user_id,
  } = createRecipeSchema.parse(request.body)

  const createGetCategoryBodySchema = z.object({
    uuid: z.string().min(36).max(36),
  })

  const { uuid } = createGetCategoryBodySchema.parse(request.params)

  try {
    const recipe = await prisma.recipe.update({
      where: {
        id: uuid,
      },
      data: {
        title,
        slug: slugify(title),
        preparation_time,
        difficulty,
        people_serv,
        ingredients,
        images,
        content,
        preparation_steps,
        category_id,
        user_id,
      },
    })

    return reply.status(200).send(recipe)
  } catch (error) {
    console.log(error)
  }
}

export async function deleteRecipe(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createGetCategoryBodySchema = z.object({
    uuid: z.string().min(36).max(36),
  })

  const { uuid } = createGetCategoryBodySchema.parse(request.params)

  try {
    const recipe = await prisma.recipe.findUnique({
      where: {
        id: uuid,
      },
    })

    if (!recipe) {
      return reply.status(404).send({ message: 'Recipe not found' })
    }

    await prisma.recipe.delete({
      where: {
        id: uuid,
      },
    })

    return reply.status(200).send()
  } catch (error) {
    console.log(error)
  }
}
