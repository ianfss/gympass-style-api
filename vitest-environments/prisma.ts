import { Environment } from 'vitest'

export default <Environment>{
  name: 'Prisma',
  async setup() {
    console.log('Setup')

    return {
      teardown() {
        console.log('Teardown')
      },
    }
  },
  transformMode: 'ssr',
}
