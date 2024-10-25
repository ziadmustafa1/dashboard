import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const subcategories = await prisma.subcategory.findMany({
      include: {
        category: true,
      },
    })
    return NextResponse.json(subcategories)
  } catch (error) {
    console.error('Error fetching subcategories:', error)
    return NextResponse.json({ error: 'Failed to fetch subcategories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const subcategory = await prisma.subcategory.create({
      data: {
        name: body.name,
        categoryId: body.categoryId,
      },
    })
    return NextResponse.json(subcategory)
  } catch (error) {
    console.error('Error creating subcategory:', error)
    return NextResponse.json({ error: 'Failed to create subcategory' }, { status: 500 })
  }
}