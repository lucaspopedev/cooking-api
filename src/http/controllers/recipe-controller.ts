import { PrismaRecipeRepository } from '@/repositories/prisma/prisma-recipe-repository'
import { CreateRecipeUseCase } from '@/use-cases/create-recipe'
import { UpdateRecipeUseCase } from '@/use-cases/update-recipe'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function listRecipes(_: FastifyRequest, reply: FastifyReply) {
  try {
    const recipeRepository = new PrismaRecipeRepository()

    const recipes = await recipeRepository.findMany()

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

  const recipeRepository = new PrismaRecipeRepository()

  try {
    const category = await recipeRepository.findUnique(uuid)

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
    category_id,
    user_id,
    preparation_time,
    difficulty,
    people_serv,
    ingredients,
    images,
    content,
    preparation_steps,
  } = createRecipeSchema.parse(request.body)

  try {
    const recipeRepository = new PrismaRecipeRepository()
    const recipeUseCase = new CreateRecipeUseCase(recipeRepository)

    const recipe = recipeUseCase.execute({
      title,
      category_id,
      user_id,
      preparation_time,
      difficulty,
      people_serv,
      ingredients,
      images,
      content,
      preparation_steps,
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
    const recipeRepository = new PrismaRecipeRepository()
    const updateRecipeUseCase = new UpdateRecipeUseCase(recipeRepository)

    const recipe = await updateRecipeUseCase.execute({
      uuid,
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
    const recipeRepository = new PrismaRecipeRepository()

    const recipeExists = recipeRepository.findUnique(uuid)

    if (!recipeExists) {
      return reply.status(404).send({ message: 'Recipe not found' })
    }

    recipeRepository.delete(uuid)

    return reply.status(200).send()
  } catch (error) {
    console.log(error)
  }
}
