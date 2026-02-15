import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Upload, Loader2 } from 'lucide-react'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: { id: string; name: string; slug: string }[]
  onUploaded: () => void
}

export function WallpaperUploadDialog({ open, onOpenChange, categories, onUploaded }: Props) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    if (f.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(f))
    } else {
      setPreview(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !file || !title) return

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const filePath = `${user.id}/${Date.now()}.${ext}`
      
      const { error: uploadError } = await supabase.storage
        .from('wallpapers')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('wallpapers').getPublicUrl(filePath)
      const mediaType = file.type.startsWith('video/') ? 'video' : 'image'

      const { error: insertError } = await supabase.from('wallpapers').insert({
        user_id: user.id,
        title,
        description: description || null,
        file_url: urlData.publicUrl,
        category_id: categoryId || null,
        media_type: mediaType,
        file_size: file.size,
      })

      if (insertError) throw insertError

      toast({ title: 'Publié !', description: 'Votre fond d\'écran a été ajouté.' })
      setTitle('')
      setDescription('')
      setCategoryId('')
      setFile(null)
      setPreview(null)
      onUploaded()
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Publier un fond d'écran</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Titre *</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Coucher de soleil..." required />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description optionnelle..." rows={2} />
          </div>
          <div>
            <Label>Catégorie</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Fichier (image ou vidéo) *</Label>
            <Input type="file" accept="image/*,video/*" onChange={handleFileChange} required />
            {preview && <img src={preview} alt="Aperçu" className="mt-2 rounded-lg max-h-40 object-cover" />}
          </div>
          <Button type="submit" disabled={uploading || !file || !title} className="w-full">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
            {uploading ? 'Upload en cours...' : 'Publier'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
