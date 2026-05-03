import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function TrainingItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: material } = await supabase
    .from('training_materials')
    .select('*')
    .eq('id', id)
    .single()

  if (!material) notFound()

  return (
    <div className="min-h-screen pb-10" style={{ background: '#1a1a1a' }}>
      <div className="px-6 pt-12 pb-4 flex items-center gap-4">
        <Link
          href="/training"
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#242424', border: '1px solid #333' }}
        >
          <span style={{ color: '#f5f0e8' }}>→</span>
        </Link>
        <h1 className="text-lg font-semibold" style={{ color: '#f5f0e8' }}>{material.title}</h1>
      </div>

      <div className="mx-6 h-px mb-6" style={{ background: '#4a6a7a33' }} />

      <div className="px-6 flex flex-col gap-5">
        {material.video_url && (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#000' }}>
            <video
              src={material.video_url}
              controls
              className="w-full"
              style={{ maxHeight: '240px' }}
            />
          </div>
        )}

        {material.pdf_url && (
          <a
            href={material.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl"
            style={{ background: '#242424', border: '1px solid #2e2e2e' }}
          >
            <span className="text-2xl">📄</span>
            <span className="text-sm" style={{ color: '#c4722a' }}>פתח מסמך PDF</span>
          </a>
        )}

        {material.content && (
          <div
            className="p-5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
            style={{ background: '#242424', color: '#d4c9b8', border: '1px solid #2e2e2e' }}
          >
            {material.content}
          </div>
        )}
      </div>
    </div>
  )
}
