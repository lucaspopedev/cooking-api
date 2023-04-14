import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { appRoutes } from './routes/routes'
import multipart from '@fastify/multipart'

export const app = fastify()

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
