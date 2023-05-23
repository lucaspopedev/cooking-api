import { TipInterface } from '@/repositories/prisma/interfaces/tip-interface'
import { slugify } from '@/utils/slugify'

interface UpdateTip {
  uuid: string
  title: string
  images: string
  content: string
  category_id: string
  user_id: string
}

export class UpdateTipUseCase {
  constructor(private tipRepository: TipInterface) {}

  async execute({
    uuid,
    title,
    images,
    content,
    category_id,
    user_id,
  }: UpdateTip) {
    const tipExists = await this.tipRepository.findUnique(uuid)

    if (!tipExists) {
      throw new Error('Tip not found')
    }

    const tip = await this.tipRepository.update({
      title,
      slug: slugify(title),
      content,
      category_id,
      user_id,
      images
    })

    return tip
  }
}
