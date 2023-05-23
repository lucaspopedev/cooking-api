import { Prisma, Category } from '@prisma/client'

export interface CategoryInterface {
  create(data: Prisma.CategoryCreateInput): Promise<Category>
  findUnique(uuid: string): Promise<Category | null>
  findMany(): Promise<Category[]>
  update(data: Prisma.CategoryUpdateInput): Promise<Category>
  delete(uuid: string): void
}
