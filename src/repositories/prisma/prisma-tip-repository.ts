import { Prisma, Tip } from '@prisma/client'
import { TipInterface } from './interfaces/tip-interface'
import { prisma } from '@/lib/prisma'

interface UpdateTipData {
  id: string
  title: string
  slug: string
  images: string
  content: string
  category_id: string
  user_id: string
}

export class PrismaTipRepository implements TipInterface {
  create(data: Prisma.TipUncheckedCreateInput): Promise<Tip> {
    const tip = prisma.tip.create({
      data,
    })

    return tip
  }

  findUnique(uuid: string): Promise<Tip | null> {
    const tip = prisma.tip.findUnique({
      where: {
        id: uuid,
      },
    })

    return tip
  }

  findMany(): Promise<Tip[]> {
    const tips = prisma.tip.findMany()

    return tips
  }

  update(data: UpdateTipData): Promise<Tip> {
    const tip = prisma.tip.update({
      where: {
        id: data.id,
      },
      data,
    })

    return tip
  }

  delete(uuid: string): void {
    prisma.tip.delete({
      where: {
        id: uuid,
      },
    })
  }
}
