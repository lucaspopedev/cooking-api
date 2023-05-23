import { CategoryInterface } from '@/repositories/prisma/interfaces/category-interface'
import { slugify } from '@/utils/slugify'

interface CreateCategory {
  title: string
  images: string
}

export class CreateCategoryUseCase {
  constructor(private categoryRepository: CategoryInterface) {}

  async execute({
    title,
    images,
  }: CreateCategory) {
    const categoryAlreadyExists = await this.categoryRepository.findUnique(
      slugify(title),
    )

    if (categoryAlreadyExists) {
      throw new Error('Category already exists')
    }

    const category = await this.categoryRepository.create({
      title,
      slug: slugify(title),
      images
    })

    return category
  }
}
