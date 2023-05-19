import { Prisma, Recipe } from '@prisma/client'
import { RecipeInterface } from './interfaces/recipe-interface'
import { prisma } from '@/lib/prisma'

interface UpdateRecipeData {
  id: string
  title: string
  slug: string
  preparation_time: string
  difficulty: string
  people_serv: number
  ingredients: string
  preparation_steps: string
  images: string
  content: string
  category_id: string
  user_id: string
}

export class PrismaRecipeRepository implements RecipeInterface {
  create(data: Prisma.RecipeCreateInput): Promise<Recipe> {
    const recipe = prisma.recipe.create({
      data,
    })

    return recipe
  }

  findUnique(uuid: string): Promise<Recipe | null> {
    const recipe = prisma.recipe.findUnique({
      where: {
        id: uuid,
      },
    })

    return recipe
  }

  findMany(): Promise<Recipe[]> {
    const recipes = prisma.recipe.findMany()

    return recipes
  }

  update(data: UpdateRecipeData): Promise<Recipe> {
    const recipe = prisma.recipe.update({
      where: {
        id: data.id,
      },
      data,
    })

    return recipe
  }

  delete(uuid: string): void {
    prisma.recipe.delete({
      where: {
        id: uuid,
      },
    })
  }
}
