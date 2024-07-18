import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import dishTypes from '../src/__mocks__/dishTypes.json'
import diets from '../src/__mocks__/diets.json'
import brands from '../src/__mocks__/brands.json'

const prisma = new PrismaClient()

const main = async () => {
    try {
        await prisma.city.deleteMany()
        await prisma.brand.deleteMany()
        await prisma.dishType.deleteMany()
        await prisma.diet.deleteMany()
        // cleanup the existing database
        let cities = [...new Array(300)].map(() => ({
            name: faker.location.city(),
        }))
        cities = cities.filter((obj, index) => {
            return index === cities.findIndex((o) => obj.name === o.name)
        })

        await prisma.city.createMany({
            data: cities,
        })

        await prisma.brand.createMany({
            data: brands,
        })

        await prisma.dishType.createMany({
            data: dishTypes,
        })

        await prisma.diet.createMany({
            data: diets,
        })

        console.log(`Database has been seeded. 🌱`)
    } catch (error) {
        throw error
    }
}

main().catch((err) => {
    console.warn('Error While generating Seed: \n', err)
})
