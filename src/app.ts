import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { appRoutes } from './routes/routes'
import multipart from '@fastify/multipart'
import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    algorithm: 'HS512',
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.register(multipart, {
  addToBody: true,
  limits: {
    files: 10,
    fileSize: 5 * 1024 * 1024,
  },
})

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error' })
})
