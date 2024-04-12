import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Fetch User Check-ins Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to fetch user check-ins history', async () => {
    await gymsRepository.create({
      title: 'Gym 1',
      description: null,
      phone: null,
      latitude: -11.1820679,
      longitude: -40.5228873,
    })

    await gymsRepository.create({
      title: 'Gym 2',
      description: null,
      phone: null,
      latitude: -11.1820679,
      longitude: -40.5228873,
    })

    const { gyms } = await sut.execute({
      query: '2',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Gym 2' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Gym ${i}`,
        description: null,
        phone: null,
        latitude: -11.1820679,
        longitude: -40.5228873,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Gym',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym 21' }),
      expect.objectContaining({ title: 'Gym 22' }),
    ])
  })
})
