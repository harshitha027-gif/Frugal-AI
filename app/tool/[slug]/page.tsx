import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { ViewIncrementer } from '@/components/ViewIncrementer'
import { ToolDetailView } from '@/components/tool/ToolDetailView'

interface Props {
    params: Promise<{ slug: string }>
}

export default async function ToolDetailPage(props: Props) {
    const params = await props.params
    const supabase = await createClient()

    const { data: tool } = await supabase
        .from('tools')
        .select('*') // Simplified select to ensure we get everything for now, can optimize later
        .eq('slug', params.slug)
        .single()

    // Fetch related data manually if joins are failing or simple select is preferred, 
    // but the original query had joins. Keeping user's original query structure is safer if it works.
    // Reverting to original query pattern but ensuring we have the fields.
    const { data: toolWithRelations } = await supabase
        .from('tools')
        .select('*, categories(name, slug), profiles(full_name)')
        .eq('slug', params.slug)
        .single()

    const finalTool = toolWithRelations || tool; // Fallback

    if (!finalTool) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-background text-foreground pt-24 pb-12">
            <ViewIncrementer toolId={finalTool.id} />
            <Link href="/" className="container mx-auto px-6 max-w-7xl inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors group">
                <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Marketplace
            </Link>

            <ToolDetailView tool={finalTool} />
        </div>
    )
}
