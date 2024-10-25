'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export default function AddBrand() {
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image }),
      })
      if (res.ok) {
        toast({ title: "Brand added successfully" })
        router.push('/dashboard')
      } else {
        throw new Error('Failed to add brand')
      }
    } catch (error) {
      console.error('Error adding brand:', error)
      toast({ title: "Failed to add brand", variant: "destructive" })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'my_uploads')
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        setImage(data.secure_url)
      } catch (error) {
        console.error('Error uploading image:', error)
        toast({ title: "Failed to upload image", variant: "destructive" })
      }
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Brand</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddBrand} className="space-y-4">
            <Input
              placeholder="Brand Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              required
            />
            {image && <img src={image} alt="Brand Image" className="w-32 h-32 object-cover" />}
            <Button type="submit">Add Brand</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}