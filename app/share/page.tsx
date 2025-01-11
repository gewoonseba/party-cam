'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function SharePage() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState('')

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return
    
    try {
      setUploading(true)
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      const { error: dbError } = await supabase
        .from('images')
        .insert([
          {
            url: publicUrl,
            caption: caption,
          },
        ])

      if (dbError) throw dbError

      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-4 bg-[#1a1a1a] text-white">
      <h1 className="text-6xl font-bold text-[#00ff95] mb-2 filter drop-shadow-[0_0_10px_rgba(0,255,149,0.8)]">
        Thirty
      </h1>
      <p className="text-xl mb-4">
        Sharing is caring, deel iets met ons!
      </p>

      <div className="w-full max-w-md">
        <label className="w-full aspect-[4/3] border-2 border-dashed border-[#00ff95]/40 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#00ff95]/60 transition-colors mb-4">
          <Upload className="w-12 h-12 text-[#00ff95] mb-4" />
          <p className="text-[#00ff95] font-bold">LACHEVODEFOTOO</p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileSelected}
            disabled={uploading}
          />
        </label>

        <input
          type="text"
          placeholder="Een leeg blad, laat u gaan"
          className="w-full p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-white mb-4"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <button
          className="w-full p-4 rounded-lg bg-[#00ff95] text-black font-bold text-lg disabled:opacity-50 transition-opacity"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Okaaaaaaay let\'sgo'}
        </button>

        <p className="text-center mt-4 text-gray-400">
          1 woord zegt meer dan 1000 foto's
        </p>
      </div>
    </main>
  )
}

