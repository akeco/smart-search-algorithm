import { PrismaClient } from '@prisma/client'
import { Entity, ModelName } from '../types'

const prisma = new PrismaClient()

// Define a type for valid Prisma models
type PrismaModel = 'city' | 'brand' | 'dishType' | 'diet'

// Helper function to fetch entities from a given model
const fetchFromModel = async (
    model: PrismaModel,
    searchTerm: string
): Promise<Entity[]> => {
    const modelInstance = prisma[model as keyof PrismaClient]
    return await (modelInstance as any).findMany({
        where: {
            name: {
                contains: searchTerm,
                mode: 'insensitive',
            },
        },
        select: {
            id: true,
            name: true,
        },
    })
}

// Dictionary to map model names to Prisma model names
const modelMap: { [key in ModelName]: PrismaModel } = {
    city: 'city',
    brand: 'brand',
    dishType: 'dishType',
    diet: 'diet',
}

export const fetchEntities = async (
    model: ModelName,
    searchTerm: string
): Promise<Entity[]> => {
    const modelName = modelMap[model]
    if (modelName) {
        return fetchFromModel(modelName, searchTerm)
    } else {
        throw new Error('Invalid model name')
    }
}
