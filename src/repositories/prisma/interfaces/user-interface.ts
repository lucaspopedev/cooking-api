import { Prisma, User } from '@prisma/client'

export interface UserInterface {
  create(data: Prisma.UserCreateInput): Promise<User>
  findUnique(uuid: string): Promise<User | null>
  findMany(): Promise<User[]>
  update(data: Prisma.UserUpdateInput): Promise<User>
  delete(uuid: string): void
}
