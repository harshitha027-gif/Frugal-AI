import { createClient } from '@/lib/supabase/server'
import { ToolsList } from '@/components/ToolsList'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default async function ToolsPage() {
    const supabase = await createClient()

    // Fetch Tools with nested relations
    const { data: tools } = await supabase
        .from('tools')
        .select(`
            *,
            categories (name),
            profiles (full_name)
        `)
        .order('created_at', { ascending: false })

    // Fetch Categories
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name')
        .order('name')

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        Discover
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 ml-3">
                            Frugal AI Tools
                        </span>
                    </h1>
                    <p className="text-lg text-neutral-400 leading-relaxed">
                        Explore our curated collection of carbon-efficient, optimized, and high-performance AI tools submitted by the community.
                    </p>
                </div>

                <Suspense fallback={<div className="text-center py-20 text-neutral-500">Loading tools...</div>}>
                    <ToolsList
                        initialTools={tools || []}
                        categories={categories || []}
                    />
                </Suspense>
            </div>
        </div>
    )
}
