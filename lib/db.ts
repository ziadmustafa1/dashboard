import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma

// Helper functions remain the same
export async function getProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      subcategory: true,
      brand: true,
    },
  })
}

export async function getCategories() {
  return prisma.category.findMany()
}

export async function getSubcategories() {
  return prisma.subcategory.findMany({
    include: {
      category: true,
    },
  })
}

export async function getBrands() {
  return prisma.brand.findMany()
}

export async function getOrders() {
  return prisma.order.findMany({
    include: {
      product: true,
    },
  })
}

export async function createProduct(data: any) {
  return prisma.product.create({
    data,
  })
}

export async function createCategory(data: any) {
  return prisma.category.create({
    data,
  })
}

export async function createSubcategory(data: any) {
  return prisma.subcategory.create({
    data,
  })
}

export async function createBrand(data: any) {
  return prisma.brand.create({
    data,
  })
}

export async function createOrder(data: any) {
  return prisma.order.create({
    data,
  })
}

export async function updateProduct(id: string, data: any) {
  return prisma.product.update({
    where: { id },
    data,
  })
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({
    where: { id },
  })
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  })
}

export async function createUser(data: any) {
  return prisma.user.create({
    data,
  })
}