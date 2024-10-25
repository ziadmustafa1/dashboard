'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export default function AddCategory() {
  const [name, setName] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (res.ok) {
        toast({ title: "Category added successfully" })
        router.push('/dashboard')
      } else {
        throw new Error('Failed to add category')
      }
    } catch (error) {
      console.error('Error adding category:', error)
      toast({ title: "Failed to add category", variant: "destructive" })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <Input
              placeholder="Category Name"
              value={name}

              onChange={(e) => setName(e.target.value)}
              required
            />
            <Button type="submit">Add Category</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}