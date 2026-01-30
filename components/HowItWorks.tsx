import { Search, Scale, Wrench } from "lucide-react"

export function HowItWorks() {
    const steps = [
        {
            icon: <Search className="w-6 h-6 text-emerald-500" />,
            title: "Browse",
            description: "Explore our curated collection of efficient AI tools across multiple categories.",
        },
        {
            icon: <Scale className="w-6 h-6 text-emerald-500" />,
            title: "Compare",
            description: "Review specs, pricing, and community feedback to find the best fit.",
        },
        {
            icon: <Wrench className="w-6 h-6 text-emerald-500" />,
            title: "Use",
            description: "Start building with your chosen tool—save on time and compute.",
        },
    ]

    return (
        <section id="how-it-works" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-emerald-500 uppercase bg-emerald-500/10 rounded-full">
                        Simple Process
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        How It Works
                    </h2>
                    <p className="text-neutral-400 max-w-2xl mx-auto">
                        Find your perfect AI tool in three simple steps
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connector Line (Desktop only) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent -z-10" />

                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-[#111] border border-emerald-500/20 rounded-full flex items-center justify-center mb-8 relative z-10 group-hover:border-emerald-500/50 transition-colors shadow-[0_0_30px_-10px_rgba(16,185,129,0.1)]">
                                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                    {step.icon}
                                </div>
                                <div className="absolute -bottom-3 text-[10px] font-bold text-emerald-500 bg-[#0a0a0a] px-2 py-0.5 border border-emerald-500/30 rounded-full">
                                    Step {index + 1}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">
                                {step.title}
                            </h3>
                            <p className="text-neutral-400 max-w-xs leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
