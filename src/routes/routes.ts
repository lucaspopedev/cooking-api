import { login } from '@/http/controllers/auth-controller'
import {
  createCategory,
  getCategory,
  listCategories,
  updateCategory,
} from '@/http/controllers/category-controller'
import { imagesUpload } from '@/http/controllers/category-image-controller'
import {
  createRecipe,
  deleteRecipe,
  getRecipe,
  listRecipes,
  updateRecipe,
} from '@/http/controllers/recipe-controller'
import { refresh } from '@/http/controllers/refresh-token-controller'
import {
  createTip,
  deleteTip,
  getTip,
  listTips,
  updateTip,
} from '@/http/controllers/tip-controller'
import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUser,
} from '@/http/controllers/user-controller'
import { verifyToken } from '@/http/middlewares/check-jwt-token'
import { FastifyInstance } from 'fastify'

interface UploadRequest {
  Body: {
    slug: string
    type: string
    images: Array<{
      data: Buffer
      filename: string
      mimetype: string
    }>
  }
}

export async function appRoutes(app: FastifyInstance) {
  app.get('/users', { preHandler: verifyToken }, listUsers)
  app.post('/users', { preHandler: verifyToken }, createUser)
  app.get('/users/:uuid', { preHandler: verifyToken }, getUser)
  app.put('/users/:uuid', { preHandler: verifyToken }, updateUser)
  app.delete('/users/:uuid', { preHandler: verifyToken }, deleteUser)

  app.get('/categories', { preHandler: verifyToken }, listCategories)
  app.post('/categories', { preHandler: verifyToken }, createCategory)
  app.get('/categories/:uuid', { preHandler: verifyToken }, getCategory)
  app.put('/categories/:uuid', { preHandler: verifyToken }, updateCategory)
  app.delete('/categories/:uuid', { preHandler: verifyToken }, deleteUser)

  app.get('/recipes', { preHandler: verifyToken }, listRecipes)
  app.get('/recipes/:uuid', { preHandler: verifyToken }, getRecipe)
  app.post('/recipes', { preHandler: verifyToken }, createRecipe)
  app.put('/recipes', { preHandler: verifyToken }, updateRecipe)
  app.delete('/recipes/:uuid', { preHandler: verifyToken }, deleteRecipe)

  app.get('/tips', { preHandler: verifyToken }, listTips)
  app.get('/tips/:uuid', { preHandler: verifyToken }, getTip)
  app.post('/tips', { preHandler: verifyToken }, createTip)
  app.put('/tips/:uuid', { preHandler: verifyToken }, updateTip)
  app.delete('/tips/:uuid', { preHandler: verifyToken }, deleteTip)

  app.post('/login', login)
  app.patch('/token/refresh', refresh)

  app.post<{ Body: UploadRequest }>('/images/upload', imagesUpload)
}
