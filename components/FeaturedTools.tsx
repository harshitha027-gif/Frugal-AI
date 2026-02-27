import Link from "next/link"
import { ArrowRight, Cpu, Zap, Star, Eye } from "lucide-react"

interface FeaturedTool {
    id: string
    name: string
    slug: string
    tagline: string
    description: string
    carbon_score: number
    views: number
    categories: {
        name: string
    } | null
    pricing_model: string
}

interface Props {
    tools: FeaturedTool[]
}

export function FeaturedTools({ tools }: Props) {
    return (
        <section id="featured" className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
                            Popular Picks
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                            Featured Tools
                        </h2>
                    </div>
                    <Link
                        href="/tools"
                        className="hidden md:flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                    >
                        View all tools
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.length > 0 ? (
                        tools.map((tool) => (
                            <Link href={`/tool/${tool.slug}`} key={tool.id} className="group">
                                <div className="h-full bg-card border border-border rounded-2xl p-6 hover:border-emerald-500/20 transition-all hover:-translate-y-1 relative overflow-hidden">
                                    {/* Hover Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-teal-500/20 flex items-center justify-center border border-border">
                                                <Cpu className="w-6 h-6 text-primary" />
                                            </div>
                                            <span className={`px-2 py-1 text-[10px] font-bold rounded-full border ${tool.pricing_model === 'Free'
                                                ? 'text-primary bg-primary/10 border-primary/20'
                                                : 'text-foreground bg-foreground/10 border-foreground/20'
                                                }`}>
                                                {tool.pricing_model || 'Free'}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                            {tool.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-grow">
                                            {tool.tagline}
                                        </p>

                                        <div className="flex items-center justify-between pt-6 border-t border-border mt-auto">
                                            <div className="flex items-center gap-1">
                                                <div className="flex items-center gap-1 hover:text-foreground transition-colors">
                                                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-xs font-medium text-foreground">4.9</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>{tool.views}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        // Fallback/Empty State
                        <div className="col-span-full text-center py-12">
                            <p className="text-neutral-500">No featured tools available yet.</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link
                        href="/tools"
                        className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                    >
                        View all tools
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
