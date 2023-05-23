import { UserInterface } from '@/repositories/prisma/interfaces/user-interface'
import { hash } from 'bcryptjs'

interface CreateUser {
  full_name: string
  email: string
  password: string
}

export class CreateUserUseCase {
  constructor(private userRepository: UserInterface) {}

  async execute({
    full_name,
    email,
    password,
  }: CreateUser) {
    const userExists = await this.userRepository.findUnique(email)

    if (userExists) {
      throw new Error('User already exists')
    }

    const password_hash = await hash(password, 10)

    const user = await this.userRepository.create({
      full_name,
      email,
      password_hash
    })

    return user
  }
}
