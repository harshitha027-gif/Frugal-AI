
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ToolForm } from '@/components/forms/ToolForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Props {
    params: Promise<{ slug: string }>
}

export default async function EditToolPage({ params }: Props) {
    const { slug } = await params
    const supabase = await createClient()

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // 2. Fetch Tool Data
    const { data: tool } = await supabase
        .from('tools')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!tool) {
        notFound()
    }

    // 3. Authorization Check
    if (tool.owner_id !== user.id) {
        redirect('/profile')
    }

    // 4. Fetch Categories
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name')
        .order('name')

    // 5. Prepare Default Values
    const defaultValues = {
        name: tool.name,
        tagline: tool.tagline,
        description: tool.description_md || tool.description, // Fallback for old records
        url: tool.url,
        category_id: tool.category_id,
        license_url: tool.license_url,
        min_ram: tool.min_ram,
        storage_footprint: tool.storage_footprint,
        is_offline_capable: tool.is_offline_capable,
        gpu_vram: tool.gpu_vram,
        supported_hardware: tool.supported_hardware || [],
        deployment_context: tool.deployment_context || [],
        efficiency_justification: tool.efficiency_justification,
        efficiency_evidence_links: tool.efficiency_evidence_links || []
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">

                <Link href="/profile" className="inline-flex items-center text-neutral-400 hover:text-white mb-8 transition-colors gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Profile
                </Link>

                <div className="mb-10">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
                        Edit {tool.name}
                    </h1>
                    <p className="text-neutral-400">
                        Update your tool's details. Significant changes will require re-verification.
                    </p>
                </div>

                <ToolForm
                    categories={categories || []}
                    toolId={tool.id}
                    defaultValues={defaultValues}
                // Pass existing analysis if we had it, but for edit we might skip showing it or just not pass it
                />
            </div>
        </div>
    )
}
