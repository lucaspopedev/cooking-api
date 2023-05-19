import { Prisma, Category } from '@prisma/client'
import { CategoryInterface } from './interfaces/category-interface'
import { prisma } from '@/lib/prisma'

interface UpdateCategoryData {
  id: string
  title: string
  slug: string
  images: string
}

export class PrismaCategoryRepository implements CategoryInterface {
  create(data: Prisma.CategoryCreateInput): Promise<Category> {
    const category = prisma.category.create({
      data,
    })

    return category
  }

  findUnique(uuid: string): Promise<Category | null> {
    const category = prisma.category.findUnique({
      where: {
        id: uuid,
      },
    })

    return category
  }

  findMany(): Promise<Category[]> {
    const categories = prisma.category.findMany()

    return categories
  }

  update(data: UpdateCategoryData): Promise<Category> {
    const category = prisma.category.update({
      where: {
        id: data.id,
      },
      data,
    })

    return category
  }

  delete(uuid: string): void {
    prisma.category.delete({
      where: {
        id: uuid,
      },
    })
  }
}
