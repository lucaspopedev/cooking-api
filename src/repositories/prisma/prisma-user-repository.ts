import { Prisma, User } from '@prisma/client'
import { UserInterface } from './interfaces/user-interface'
import { prisma } from '@/lib/prisma'

interface UpdateUserData {
  id: string
  full_name: string
  email: string
  password_hash: string
}

export class PrismaUserRepository implements UserInterface {
  create(data: Prisma.UserCreateInput): Promise<User> {
    const user = prisma.user.create({
      data,
    })

    return user
  }

  findUnique(uuid: string): Promise<User | null> {
    const user = prisma.user.findUnique({
      where: {
        id: uuid,
      },
    })

    return user
  }

  findMany(): Promise<User[]> {
    const user = prisma.user.findMany({
      select: {
        id: true,
        full_name: true,
        email: true,
        updated_at: true,
        created_at: true,
      },
    })

    return user
  }

  update(data: UpdateUserData): Promise<User> {
    const user = prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })

    return user
  }

  delete(uuid: string): void {
    prisma.user.delete({
      where: {
        id: uuid,
      },
    })
  }
}
