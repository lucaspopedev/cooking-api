import { CategoryInterface } from '@/repositories/prisma/interfaces/category-interface'
import { slugify } from '@/utils/slugify'

interface UpdateCategory {
  uuid: string
  title: string
  images: string
}

export class UpdateCategoryUseCase {
  constructor(private categoryRepository: CategoryInterface) {}

  async execute({
    uuid,
    title,
    images,
  }: UpdateCategory) {
    const categoryExists = await this.categoryRepository.findUnique(uuid)

    if (!categoryExists) {
      throw new Error('Category not found')
    }

    const category = await this.categoryRepository.update({
      title,
      slug: slugify(title),
      images
    })

    return category
  }
}
