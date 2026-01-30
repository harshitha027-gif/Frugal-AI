import { Leaf, Cpu, Zap } from "lucide-react"

export function Features() {
    const features = [
        {
            icon: <Leaf className="w-6 h-6 text-emerald-500" />,
            title: "Eco-Friendly",
            description: "Reduce your carbon footprint with optimized, lightweight AI models that do more with less.",
        },
        {
            icon: <Cpu className="w-6 h-6 text-emerald-500" />,
            title: "Edge Ready",
            description: "Tools designed to run on consumer hardware like standard cloud compute required.",
        },
        {
            icon: <Zap className="w-6 h-6 text-emerald-500" />,
            title: "High Performance",
            description: "Speed and efficiency without sacrificing quality. Get results in milliseconds.",
        },
    ]

    return (
        <section id="features" className="py-24 bg-[#0a0a0a]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-emerald-500 uppercase bg-emerald-500/10 rounded-full">
                        Why Choose Frugal AI?
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Built for Efficiency
                    </h2>
                    <p className="text-neutral-400 max-w-2xl mx-auto">
                        Discover AI tools that respect your resources, time, and budget.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-8 bg-[#111] border border-white/5 rounded-2xl hover:border-emerald-500/20 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-neutral-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
