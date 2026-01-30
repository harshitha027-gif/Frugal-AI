import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-[#050505] border-t border-white/5 pt-16 pb-8">
            <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-1 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                F
                            </div>
                            <span className="text-xl font-bold text-white">
                                Frugal <span className="text-emerald-500">AI</span>
                            </span>
                        </Link>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                            Discover lightweight, offline-capable AI models that respect your resources. Run inference on the edge, not the cloud.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 bg-white/5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors">
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 bg-white/5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors">
                                <Github className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 bg-white/5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors">
                                <Linkedin className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h3 className="font-semibold text-white mb-6">Platform</h3>
                        <ul className="space-y-4">
                            <li><Link href="/tools" className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors">Browse Tools</Link></li>
                            <li><Link href="/submit" className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors">Submit Tool</Link></li>
                            <li><Link href="#" className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors">Categories</Link></li>
                            <li><Link href="#" className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors">New Arrivals</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-6">Resources</h3>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors">Documentation</Link></li>
                            <li><Link href="#" className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors">API Reference</Link></li>
                            <li><Link href="#" className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors">Community</Link></li>
                            <li><Link href="#" className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-6">Company</h3>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors">About</Link></li>
                            <li><Link href="#" className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors">Careers</Link></li>
                            <li><Link href="#" className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors">Privacy</Link></li>
                            <li><Link href="#" className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-neutral-500">
                        © {new Date().getFullYear()} Frugal AI. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="text-sm text-neutral-500 hover:text-neutral-300">Privacy Policy</Link>
                        <Link href="#" className="text-sm text-neutral-500 hover:text-neutral-300">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
