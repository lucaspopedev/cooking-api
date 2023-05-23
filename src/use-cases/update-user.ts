import { UserInterface } from '@/repositories/prisma/interfaces/user-interface'
import { hash } from 'bcryptjs'

interface UpdateUser {
  uuid: string
  full_name: string
  email: string
  password: string
}

export class UpdateUserUseCase {
  constructor(private userRepository: UserInterface) {}

  async execute({
    uuid,
    full_name,
    email,
    password,
  }: UpdateUser) {
    const userExists = await this.userRepository.findUnique(uuid)

    if (!userExists) {
      throw new Error('User not found')
    }

    const password_hash = await hash(password, 10)


    const user = await this.userRepository.update({
      full_name,
      email,
      password_hash
    })

    return user
  }
}
