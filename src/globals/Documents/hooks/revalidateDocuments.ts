import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateDocuments: GlobalAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating documents`)

  revalidateTag('global_documents')
  revalidatePath('/', 'layout')

  return doc
}
