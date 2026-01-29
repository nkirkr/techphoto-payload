import type { GlobalAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateContacts: GlobalAfterChangeHook = ({ doc, req }) => {
  req.payload.logger.info(`Revalidating contacts`)

  revalidateTag('global_contacts')
  revalidatePath('/', 'layout')
  revalidatePath('/en', 'layout')

  return doc
}
