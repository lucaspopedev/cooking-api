import { login } from '@/http/controllers/authController'
import {
  createCategory,
  getCategory,
  listCategories,
  updateCategory,
} from '@/http/controllers/categoryController'
import { imagesUpload } from '@/http/controllers/ImageController'
import {
  createRecipe,
  deleteRecipe,
  getRecipe,
  listRecipes,
  updateRecipe,
} from '@/http/controllers/recipeController'
import {
  createTip,
  deleteTip,
  getTip,
  listTips,
  updateTip,
} from '@/http/controllers/tipController'
import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUser,
} from '@/http/controllers/userController'
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
  app.get('/users', listUsers)
  app.post('/users', createUser)
  app.get('/users/:uuid', getUser)
  app.put('/users/:uuid', updateUser)
  app.delete('/users/:uuid', deleteUser)

  app.get('/categories', listCategories)
  app.post('/categories', createCategory)
  app.get('/categories/:uuid', getCategory)
  app.put('/categories/:uuid', updateCategory)
  app.delete('/categories/:uuid', deleteUser)

  app.get('/recipes', listRecipes)
  app.get('/recipes/:uuid', getRecipe)
  app.post('/recipes', createRecipe)
  app.put('/recipes', updateRecipe)
  app.delete('/recipes/:uuid', deleteRecipe)

  app.get('/tips', listTips)
  app.get('/tips/:uuid', getTip)
  app.post('/tips', createTip)
  app.put('/tips/:uuid', updateTip)
  app.delete('/tips/:uuid', deleteTip)

  app.post('/login', login)

  app.post<{ Body: UploadRequest }>('/images/upload', imagesUpload)
}
