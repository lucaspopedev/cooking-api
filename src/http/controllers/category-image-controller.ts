import fs from 'node:fs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

interface Image {
  mimetype: string
  filename: string
  data: Buffer
}

export async function imagesUpload(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<{ message: string } | void> {
  const { body } = request

  const createImageSchema = z.object({
    slug: z.string().nonempty().max(150, { message: 'Slug is too long' }),
    type: z
      .string()
      .nonempty({ message: 'Type is required' })
      .refine(
        (type) => type === 'category' || type === 'recipe' || type === 'tip',
        {
          message: 'Type must be category, recipe or tip',
        },
      ),
  })

  try {
    const { slug, type } = createImageSchema.parse(body)

    const images = body.images as Image[]

    if (!images) {
      throw new Error('No images provided')
    }

    if (images.length > 10) {
      throw new Error('Too many images. Maximum of 10 images allowed.')
    }

    const acceptableTypes = ['image/png', 'image/jpeg', 'image/jpg']

    const hasUnacceptableType = images.some(
      (file) => !acceptableTypes.includes(file.mimetype),
    )

    if (hasUnacceptableType) {
      throw new Error('At least one image has an invalid type')
    }

    const images_dir = `./public/images/${type}/${slug}`

    if (!fs.existsSync(images_dir)) {
      fs.mkdirSync(images_dir, { recursive: true })
    }

    const promises = images.map(async (file) => {
      const { filename, data } = file
      await fs.promises.writeFile(
        `./public/images/${type}/${slug}/${filename}`,
        data,
      )
    })

    await Promise.all(promises)

    return { message: 'Upload successful!' }
  } catch (error) {
    reply.status(400).send({ error: error.message })
  }
}
