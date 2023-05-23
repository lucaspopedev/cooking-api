import { Prisma, Tip } from '@prisma/client'

export interface TipInterface {
  create(data: Prisma.TipUncheckedCreateInput): Promise<Tip>
  findUnique(uuid: string): Promise<Tip | null>
  findMany(): Promise<Tip[]>
  update(data: Prisma.TipUncheckedUpdateInput): Promise<Tip>
  delete(uuid: string): void
}
