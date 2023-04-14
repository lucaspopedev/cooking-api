import { app } from './app'
import { env } from './env'

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log(
      `Cooking blog api is running on port ${env.PORT}. \nHave a good coding! ☕`,
    )
  })
