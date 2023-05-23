import { RecipeInterface } from '@/repositories/prisma/interfaces/recipe-interface'
import { slugify } from '@/utils/slugify'

interface CreateRecipe {
  title: string
  category_id: string
  user_id: string
  preparation_time: string
  difficulty: string
  people_serv: number
  ingredients: string
  preparation_steps: string
  images: string
  content: string
}

export class CreateRecipeUseCase {
  constructor(private recipeRepository: RecipeInterface) {}

  async execute({
    title,
    preparation_time,
    difficulty,
    people_serv,
    ingredients,
    preparation_steps,
    images,
    content,
    category_id,
    user_id,
  }: CreateRecipe) {
    const recipeAlreadyExists = await this.recipeRepository.findUnique(
      slugify(title),
    )

    if (recipeAlreadyExists) {
      throw new Error('Recipe already exists')
    }

    const recipe = await this.recipeRepository.create({
      title,
      slug: slugify(title),
      category_id,
      user_id,
      preparation_time,
      difficulty,
      people_serv,
      ingredients,
      preparation_steps,
      images,
      content,
    })

    return recipe
  }
}
