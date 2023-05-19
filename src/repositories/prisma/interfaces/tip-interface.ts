import { Prisma, Tip } from '@prisma/client'

export interface TipInterface {
  create(data: Prisma.CategoryCreateInput): Promise<Tip>
  findUnique(uuid: string): Promise<Tip | null>
  findMany(): Promise<Tip[]>
  update(data: Prisma.TipUpdateInput): Promise<Tip>
  delete(uuid: string): void
}
