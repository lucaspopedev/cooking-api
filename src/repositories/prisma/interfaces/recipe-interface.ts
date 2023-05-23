import { Prisma, Recipe } from '@prisma/client'

export interface RecipeInterface {
  create(data: Prisma.RecipeUncheckedCreateInput): Promise<Recipe>
  findUnique(uuid: string): Promise<Recipe | null>
  findMany(): Promise<Recipe[]>
  update(data: Prisma.RecipeUncheckedCreateInput): Promise<Recipe>
  delete(uuid: string): void
}
