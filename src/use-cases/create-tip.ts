import { TipInterface } from '@/repositories/prisma/interfaces/tip-interface'
import { slugify } from '@/utils/slugify'

interface CreateTip {
  title: string
  images: string
  content: string
  category_id: string
  user_id: string
}

export class CreateTipUseCase {
  constructor(private tipRepository: TipInterface) {}

  async execute({
    title,
    images,
    content,
    category_id,
    user_id,
  }: CreateTip) {
    const tipAlreadyExists = await this.tipRepository.findUnique(
      slugify(title),
    )

    if (tipAlreadyExists) {
      throw new Error('Tip already exists')
    }

    const tip = await this.tipRepository.create({
      title,
      slug: slugify(title),
      images,
      content,
      category_id,
      user_id,
    })

    return tip
  }
}
