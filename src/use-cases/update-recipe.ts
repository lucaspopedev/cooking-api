import { RecipeInterface } from '@/repositories/prisma/interfaces/recipe-interface'
import { slugify } from '@/utils/slugify'

interface UpdateRecipe {
  uuid: string
  title: string
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

export class UpdateRecipeUseCase {
  constructor(private recipeRepository: RecipeInterface) {}

  async execute({
    uuid,
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
  }: UpdateRecipe) {
    const recipeNotFound = await this.recipeRepository.findUnique(uuid)

    if (recipeNotFound) {
      throw new Error('Recipe not found')
    }

    const recipe = await this.recipeRepository.update({
      id: uuid,
      title,
      category_id,
      user_id,
      slug: slugify(title),
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
