import { createClient } from '@/lib/supabase/server'
import { GetToolButton } from '@/components/GetToolButton'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Eye } from 'lucide-react'
import { ViewIncrementer } from '@/components/ViewIncrementer'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { ReviewsSection } from '@/components/ReviewsSection'

export const revalidate = 0 // Disable caching for now to see updates

interface Props {
    params: Promise<{ slug: string }>
}

export default async function ToolDetailPage(props: Props) {
    const params = await props.params
    const supabase = await createClient()

    const { data: tool } = await supabase
        .from('tools')
        .select('*, categories(name, slug), profiles(full_name)')
        .eq('slug', params.slug)
        .single()

    if (!tool) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12">
            <ViewIncrementer toolId={tool.id} />
            <div className="container mx-auto px-6 max-w-5xl">
                <Link href="/tools" className="inline-flex items-center text-neutral-400 hover:text-white mb-8 transition-colors group">
                    <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Marketplace
                </Link>

                <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                                    {tool.categories?.name || 'Uncategorized'}
                                </span>
                                {tool.pricing_model && (
                                    <span className="text-xs font-semibold text-white bg-white/10 border border-white/20 px-3 py-1 rounded-full">
                                        {tool.pricing_model}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{tool.name}</h1>
                            <p className="text-xl text-neutral-400 max-w-2xl">{tool.tagline}</p>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-3">
                            <a
                                href={tool.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 text-sm font-bold bg-white text-black hover:bg-neutral-200 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                Visit Website
                            </a>
                            <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                                <Eye className="w-3 h-3" />
                                {tool.views || 0} Views
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-white/5 mb-8">
                        <div>
                            <label className="text-xs text-neutral-500 block mb-1 uppercase tracking-wider">Carbon Score</label>
                            <div className={`text-2xl font-mono font-bold ${tool.carbon_score > 70 ? 'text-emerald-400' :
                                tool.carbon_score > 40 ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                {tool.carbon_score}/100
                            </div>
                        </div>
                        {tool.pricing_model && (
                            <div>
                                <label className="text-xs text-neutral-500 block mb-1 uppercase tracking-wider">Pricing</label>
                                <div className="text-lg text-white font-medium">{tool.pricing_model}</div>
                            </div>
                        )}
                        <div>
                            <label className="text-xs text-neutral-500 block mb-1 uppercase tracking-wider">Creator</label>
                            <div className="text-lg text-white font-medium truncate">{tool.profiles?.full_name || 'Anonymous'}</div>
                        </div>
                        <div>
                            <label className="text-xs text-neutral-500 block mb-1 uppercase tracking-wider">Submitted</label>
                            <div className="text-lg text-white font-medium">
                                {new Date(tool.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-invert max-w-none text-neutral-300">
                        <h3 className="text-xl font-bold text-white mb-4">About this Tool</h3>
                        <div className="leading-relaxed opacity-90 markdown-content">
                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                {tool.description || "No description provided."}
                            </ReactMarkdown>
                        </div>
                    </div>

                    <ReviewsSection toolId={tool.id} />
                </div>
            </div>
        </div>
    )
}
