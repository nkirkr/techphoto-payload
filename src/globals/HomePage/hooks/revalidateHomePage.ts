import type { GlobalAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateHomePage: GlobalAfterChangeHook = ({ doc, req }) => {
  req.payload.logger.info(`Revalidating home page`)

  revalidateTag('global_home-page')
  revalidatePath('/', 'layout')
  revalidatePath('/en', 'layout')

  return doc
}
