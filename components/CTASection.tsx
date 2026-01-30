import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CTASection() {
    return (
        <section className="py-24 bg-[#0a0a0a]">
            <div className="container mx-auto px-4">
                <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#111]">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 to-teal-900/20 pointer-events-none" />
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative z-10 px-6 py-20 text-center">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Have a Tool to Share?
                        </h2>
                        <p className="text-lg text-neutral-400 max-w-2xl mx-auto mb-10">
                            Help the community discover great Frugal AI tools. Submit your project and join our growing collection.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/submit"
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full bg-white text-black hover:bg-neutral-200 transition-all hover:scale-105"
                            >
                                Submit a Tool
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                            <Link
                                href="/tools"
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full border border-white/10 text-white hover:bg-white/5 transition-all"
                            >
                                Explore Tools
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
