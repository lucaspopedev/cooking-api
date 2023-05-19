import { Prisma, Recipe } from '@prisma/client'

export interface RecipeInterface {
  create(data: Prisma.CategoryCreateInput): Promise<Recipe>
  findUnique(uuid: string): Promise<Recipe | null>
  findMany(): Promise<Recipe[]>
  update(data: Prisma.RecipeUpdateInput): Promise<Recipe>
  delete(uuid: string): void
}
