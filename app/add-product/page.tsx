'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

interface Brand {
  id: string;
  name: string;
}

export default function AddProduct() {
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    hoverImage: '',
    categoryId: '',
    subcategoryId: '',
    brandId: '',
    color: '',
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [categoriesRes, subcategoriesRes, brandsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/subcategories'),
        fetch('/api/brands'),
      ])
      const [categoriesData, subcategoriesData, brandsData] = await Promise.all([
        categoriesRes.json(),
        subcategoriesRes.json(),
        brandsRes.json(),
      ])
      setCategories(categoriesData)
      setSubcategories(subcategoriesData)
      setBrands(brandsData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({ title: "Failed to fetch data", variant: "destructive" })
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      })
      if (res.ok) {
        toast({ title: "Product added successfully" })
        router.push('/dashboard')
      } else {
        throw new Error('Failed to add product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      toast({ title: "Failed to add product", variant: "destructive" })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'hoverImage') => {
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
        setNewProduct(prev => ({ ...prev, [type]: data.secure_url }))
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
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <Input
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <Textarea
              placeholder="Product Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
              required
            />
            <Input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
              required
            />
            <Select
              value={newProduct.categoryId}
              onValueChange={(value) => setNewProduct(prev => ({ ...prev, categoryId: value }))}
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
            <Select
              value={newProduct.subcategoryId}
              onValueChange={(value) => setNewProduct(prev => ({ ...prev, subcategoryId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Subcategory" />
              </SelectTrigger>
              <SelectContent>
                {subcategories
                  .filter(sub => sub.categoryId === newProduct.categoryId)
                  .map(subcategory => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>{subcategory.name}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            <Select
              value={newProduct.brandId}
              onValueChange={(value) => setNewProduct(prev => ({ ...prev, brandId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map(brand => (
                  <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Color"
              value={newProduct.color}
              onChange={(e) => setNewProduct(prev => ({ ...prev, color: e.target.value }))}
              required
            />
            <Input
              type="file"
              onChange={(e) => handleImageUpload(e, 'image')}
              accept="image/*"
              required
            />
            <Input
              type="file"
              onChange={(e) => handleImageUpload(e, 'hoverImage')}
              accept="image/*"
              required
            />
            <Button type="submit">Add Product</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}