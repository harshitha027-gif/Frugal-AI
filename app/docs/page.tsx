'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Zap, Leaf, Shield, Github, ArrowRight, Code, FileText, Menu, X } from 'lucide-react'

const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'mission', title: 'Our Mission' },
    { id: 'features', title: 'Key Features' },
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'submitting-tools', title: 'Submitting Tools' },
    { id: 'auto-import', title: 'Auto-Import API' },
    { id: 'carbon-score', title: 'Carbon Score' },
    { id: 'faq', title: 'FAQ' },
]

export default function DocumentationPage() {
    const [activeSection, setActiveSection] = useState('introduction')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            setActiveSection(id)
            setMobileMenuOpen(false)
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground pt-24">

            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden fixed top-24 left-0 right-0 z-40 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">Documentation Menu</span>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            <div className="container mx-auto px-6 max-w-7xl flex gap-12 relative">

                {/* Sidebar Navigation */}
                <aside className={`fixed lg:sticky top-24 lg:top-32 left-0 h-[calc(100vh-8rem)] w-64 bg-background border-r border-border lg:border-none p-6 lg:p-0 z-30 transition-transform duration-300 lg:translate-x-0 overflow-y-auto ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}>
                    <h5 className="text-sm font-bold text-foreground mb-6 uppercase tracking-wider px-4">Contents</h5>
                    <nav className="space-y-1">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${activeSection === section.id
                                    ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                    }`}
                            >
                                {section.title}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 w-full lg:max-w-4xl py-12 lg:py-0 pb-32 space-y-20">

                    {/* Introduction */}
                    <section id="introduction" className="space-y-6 scroll-mt-32">
                        <div className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
                            <FileText className="w-4 h-4" />
                            <span>Documentation v1.0</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Frugal AI Documentation</h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Welcome to the official documentation for the **Frugal AI Marketplace**. This platform connects developers, researchers, and sustainable tech enthusiasts with highly optimized, low-resource AI tools and models.
                        </p>
                    </section>

                    {/* Mission */}
                    <section id="mission" className="space-y-6 scroll-mt-32 pt-12 border-t border-border">
                        <h2 className="text-3xl font-bold flex items-center gap-3 text-foreground">
                            <Leaf className="w-6 h-6 text-emerald-500" />
                            Our Mission
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            As AI models grow exponentially in size and compute requirements, the environmental impact of training and inference becomes a critical concern. **Frugal AI** aims to reverse this trend by highlighting "small AI," quantized models, and efficient inference engines.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div className="bg-card p-6 rounded-2xl border border-border">
                                <h3 className="font-bold text-foreground mb-2">Democratize Access</h3>
                                <p className="text-sm text-muted-foreground">Making powerful AI accessible on consumer hardware (edge devices, laptops, mobile).</p>
                            </div>
                            <div className="bg-card p-6 rounded-2xl border border-border">
                                <h3 className="font-bold text-foreground mb-2">Reduce Carbon Footprint</h3>
                                <p className="text-sm text-muted-foreground">Promoting energy-efficient models effectively lowers global cognitive compute energy consumption.</p>
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section id="features" className="space-y-6 scroll-mt-32 pt-12 border-t border-border">
                        <h2 className="text-3xl font-bold flex items-center gap-3 text-foreground">
                            <Zap className="w-6 h-6 text-yellow-400" />
                            Key Features
                        </h2>
                        <ul className="space-y-4 text-muted-foreground list-disc list-inside">
                            <li><strong className="text-foreground">Curated Marketplace:</strong> Discover verified low-resource tools.</li>
                            <li><strong className="text-foreground">Smart Auto-Import:</strong> Instantly add tools from Hugging Face or GitHub.</li>
                            <li><strong className="text-foreground">Carbon Scoring:</strong> A community-driven metric (0-100) to rate efficiency.</li>
                            <li><strong className="text-foreground">Creator Profiles:</strong> Showcase your portfolio of efficient AI contributions.</li>
                        </ul>
                    </section>

                    {/* Getting Started */}
                    <section id="getting-started" className="space-y-6 scroll-mt-32 pt-12 border-t border-border">
                        <h2 className="text-3xl font-bold text-foreground">Getting Started</h2>
                        <p className="text-muted-foreground">
                            Whether you are a developer looking for a model or a creator wanting to share one, Frugal AI is designed for simplicity.
                        </p>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-foreground">For Users</h3>
                            <p className="text-muted-foreground">
                                Navigate to the <Link href="/tools" className="text-emerald-400 hover:underline">Tools Page</Link> to browse the collection. You can filter by category (LLMs, Computer Vision, Audio) or sort by "Most Viewed" and "Eco-Friendly" to find the best tools for your needs.
                            </p>
                        </div>

                        <div className="space-y-4 mt-6">
                            <h3 className="text-xl font-bold text-foreground">For Creators</h3>
                            <p className="text-muted-foreground">
                                <Link href="/login" className="text-emerald-400 hover:underline">Sign In</Link> to create your profile. Once logged in, you can start submitting tools immediately. You can track views and manage your submissions from your <Link href="/profile" className="text-emerald-400 hover:underline">Profile Dashboard</Link>.
                            </p>
                        </div>
                    </section>

                    {/* Submitting Tools */}
                    <section id="submitting-tools" className="space-y-6 scroll-mt-32 pt-12 border-t border-border">
                        <h2 className="text-3xl font-bold flex items-center gap-3 text-foreground">
                            <Github className="w-6 h-6 text-foreground" />
                            Submitting Tools
                        </h2>
                        <p className="text-muted-foreground">
                            We've optimized the submission process to take seconds, not minutes.
                        </p>
                        <ol className="list-decimal list-inside space-y-4 text-muted-foreground bg-card p-8 rounded-3xl border border-border">
                            <li>Go to the <Link href="/submit" className="text-emerald-400 font-medium">Submit Page</Link>.</li>
                            <li>
                                Locate the <strong>Auto-Import</strong> box at the top.
                            </li>
                            <li>
                                Paste a <strong>Hugging Face Repo ID</strong> (e.g., <code>TheBloke/Mistral-7B-GGUF</code>) OR a <strong>GitHub URL</strong>.
                            </li>
                            <li>
                                Click <strong>Import</strong>. The system will fetch the name, description, and README automatically.
                            </li>
                            <li>
                                Adjust the <strong>Carbon Score</strong> slider based on your tool's efficiency.
                            </li>
                            <li>Click <strong>Submit Tool</strong>.</li>
                        </ol>
                    </section>

                    {/* Auto-Import API */}
                    <section id="auto-import" className="space-y-6 scroll-mt-32 pt-12 border-t border-border">
                        <h2 className="text-3xl font-bold flex items-center gap-3 text-foreground">
                            <Code className="w-6 h-6 text-blue-400" />
                            Auto-Import API Logic
                        </h2>
                        <p className="text-muted-foreground">
                            Our ingestion engine is built to recognize multiple platform formats intelligently.
                        </p>
                        <div className="grid gap-4">
                            <div className="p-4 bg-muted border border-border rounded-xl">
                                <h4 className="font-bold text-foreground mb-2">Hugging Face Detection</h4>
                                <code className="text-xs text-muted-foreground block bg-background p-3 rounded-lg mb-2">
                                    Input: "TheBloke/Llama-2-7B-Chat-GGML"
                                </code>
                                <p className="text-sm text-muted-foreground">Fetches metadata from HF Hub API and resolves README.md from main/master branch.</p>
                            </div>
                            <div className="p-4 bg-muted border border-border rounded-xl">
                                <h4 className="font-bold text-foreground mb-2">GitHub Detection</h4>
                                <code className="text-xs text-muted-foreground block bg-background p-3 rounded-lg mb-2">
                                    Input: "https://github.com/microsoft/DeepSpeed"
                                </code>
                                <p className="text-sm text-muted-foreground">Extracts owner/repo, calls GitHub API for description, and fetches raw content of README.md.</p>
                            </div>
                        </div>
                    </section>

                    {/* Carbon Score */}
                    <section id="carbon-score" className="space-y-6 scroll-mt-32 pt-12 border-t border-border">
                        <h2 className="text-3xl font-bold flex items-center gap-3 text-foreground">
                            <Shield className="w-6 h-6 text-green-400" />
                            Carbon Efficiency Score
                        </h2>
                        <p className="text-muted-foreground">
                            The Carbon Score is a heuristic metric used to estimate the relative environmental friendliness of a tool.
                        </p>
                        <div className="flex gap-4 items-center mt-4">
                            <div className="h-4 flex-1 bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 rounded-full" />
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground font-mono">
                            <span>0 (Heavy Compute)</span>
                            <span>50 (Standard)</span>
                            <span>100 (Ultra Efficient)</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                            <strong className="text-foreground">Note:</strong> Since exact energy consumption varies by hardware, this score serves as a comparative guide rather than a precise scientific measurement.
                        </p>
                    </section>

                    {/* FAQ */}
                    <section id="faq" className="space-y-6 scroll-mt-32 pt-12 border-t border-border">
                        <h2 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h2>

                        <div className="space-y-4">
                            <details className="group bg-card p-6 rounded-2xl border border-border open:border-emerald-500/30 transition-all">
                                <summary className="flex justify-between items-center cursor-pointer font-bold text-foreground list-none">
                                    Is Frugal AI free to use?
                                    <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-muted-foreground mt-4 leading-relaxed">
                                    Yes! The directory is completely free for both creators and users. Our goal is to promote visibility for efficient tools.
                                </p>
                            </details>

                            <details className="group bg-card p-6 rounded-2xl border border-border open:border-emerald-500/30 transition-all">
                                <summary className="flex justify-between items-center cursor-pointer font-bold text-foreground list-none">
                                    Can I edit my tool after submission?
                                    <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-muted-foreground mt-4 leading-relaxed">
                                    Absolutely. Go to your <Link href="/profile" className="text-emerald-400 underline">Profile</Link>, find the tool, and click the Edit icon. Note that significant changes might require re-verification.
                                </p>
                            </details>

                            <details className="group bg-card p-6 rounded-2xl border border-border open:border-emerald-500/30 transition-all">
                                <summary className="flex justify-between items-center cursor-pointer font-bold text-foreground list-none">
                                    How is view count calculated?
                                    <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-muted-foreground mt-4 leading-relaxed">
                                    Views are incremented uniquely when a user visits the tool's detail page. We use a secure RPC function to prevent abuse.
                                </p>
                            </details>
                        </div>
                    </section>


                </main>
            </div>
        </div>
    )
}
