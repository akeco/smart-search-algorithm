import { PrismaClient } from '@prisma/client'
import { Entity, ModelName } from '../types'

const prisma = new PrismaClient()

const isCityModel = (model: any): model is 'city' => model === 'city'
const isBrandModel = (model: any): model is 'brand' => model === 'brand'
const isDishTypeModel = (model: any): model is 'dishType' =>
    model === 'dishType'
const isDietModel = (model: any): model is 'diet' => model === 'diet'

export const fetchEntities = async (
    model: ModelName,
    searchTerm: string
): Promise<Entity[]> => {
    if (isCityModel(model)) {
        return await prisma.city.findMany({
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
    } else if (isBrandModel(model)) {
        return await prisma.brand.findMany({
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
    } else if (isDishTypeModel(model)) {
        return await prisma.dishType.findMany({
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
    } else if (isDietModel(model)) {
        return await prisma.diet.findMany({
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
    } else {
        throw new Error('Invalid model name')
    }
}
