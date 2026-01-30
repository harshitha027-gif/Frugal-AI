'use client'

import { SplineScene } from "@/components/ui/spline"
import { Spotlight } from "@/components/ui/spotlight"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
    return (
        <section className="relative w-full min-h-screen bg-[#0a0a0a] overflow-hidden">
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
            />

            {/* Main content wrapper - split layout */}
            <div className="relative z-10 min-h-screen flex items-center">
                <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        {/* Left side - Content */}
                        <div className="flex flex-col justify-center pt-32 pb-12 lg:py-0">
                            <span className="inline-block w-fit px-4 py-1.5 mb-8 text-sm font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-sm">
                                🚀 The future of efficient AI
                            </span>

                            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tighter text-white leading-[0.9] text-balance">
                                Frugal <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
                                    Intelligence.
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-neutral-400 mb-12 max-w-xl leading-relaxed font-light">
                                Discover lightweight, offline-capable AI models that respect your resources. Run inference on the edge, not the cloud.
                            </p>

                            <div className="flex flex-wrap gap-5">
                                <Link
                                    href="/tools"
                                    className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold rounded-full bg-emerald-500 text-black overflow-hidden transition-all hover:scale-105 hover:bg-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)]"
                                >
                                    <span className="relative z-10">Get Started</span>
                                    <ArrowRight className="h-5 w-5 relative z-10 transition-transform group-hover:translate-x-1" />
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                </Link>

                                <Link
                                    href="/docs"
                                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-600 hover:bg-white/5 transition-all"
                                >
                                    How it works
                                </Link>
                            </div>

                            {/* Trust Badge / Social Proof - Optional addition for credibility */}
                            <div className="mt-12 flex items-center gap-4 text-sm text-neutral-500">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-neutral-800 border-2 border-[#0a0a0a]" />
                                    ))}
                                </div>
                                <span>Trusted by 1000+ developers</span>
                            </div>
                        </div>

                        {/* Right side - 3D Robot */}
                        <div className="relative h-[50vh] lg:h-[85vh] flex items-center justify-center">
                            <div className="absolute inset-[-10%] sm:inset-[-20%] lg:inset-[-25%] pointer-events-auto">
                                <SplineScene
                                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                                    className="w-full h-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gradient overlay at bottom for smooth transition */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent z-20 pointer-events-none" />
        </section>
    )
}


