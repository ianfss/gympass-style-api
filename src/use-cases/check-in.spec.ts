import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: '',
      description: '',
      phone: '',
      latitude: -11.1820679,
      longitude: -40.5228873,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -11.1820679,
      userLongitude: -40.5228873,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice on the same day', async () => {
    vi.setSystemTime(new Date(2024, 3, 11, 1, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -11.1820679,
      userLongitude: -40.5228873,
    })

    await expect(async () =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -11.1820679,
        userLongitude: -40.5228873,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice on different days', async () => {
    vi.setSystemTime(new Date(2024, 3, 11, 1, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -11.1820679,
      userLongitude: -40.5228873,
    })

    vi.setSystemTime(new Date(2024, 3, 12, 1, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -11.1820679,
      userLongitude: -40.5228873,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Distant gym',
      description: '',
      phone: '',
      latitude: new Decimal(-11.1849971),
      longitude: new Decimal(-40.516689),
    })

    await expect(async () => {
      await sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -11.1820679,
        userLongitude: -40.5228873,
      })
    }).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
