'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface Category {
  id: string;
  name: string;
}

export default function AddSubcategory() {
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast({ title: "Failed to fetch categories", variant: "destructive" })
    }
  }

  const handleAddSubcategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, categoryId }),
      })
      if (res.ok) {
        toast({ title: "Subcategory added successfully" })
        router.push('/dashboard')
      } else {
        throw new Error('Failed to add subcategory')
      }
    } catch (error) {
      console.error('Error adding subcategory:', error)
      toast({ title: "Failed to add subcategory", variant: "destructive" })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Subcategory</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSubcategory} className="space-y-4">
            <Input
              placeholder="Subcategory Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Select
              value={categoryId}
              onValueChange={(value) => setCategoryId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Add Subcategory</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}