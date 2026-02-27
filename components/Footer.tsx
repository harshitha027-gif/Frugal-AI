import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-background border-t border-border pt-16 pb-8">
            <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-1 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-teal-600 rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg">
                                F
                            </div>
                            <span className="text-xl font-bold text-foreground">
                                Frugal <span className="text-primary">AI</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                            Discover lightweight, offline-capable AI models that respect your resources. Run inference on the edge, not the cloud.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 bg-foreground/5 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors">
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 bg-foreground/5 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors">
                                <Github className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 bg-foreground/5 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors">
                                <Linkedin className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-6">Platform</h3>
                        <ul className="space-y-4">
                            <li><Link href="/tools" className="text-sm text-muted-foreground hover:text-primary transition-colors">Browse Tools</Link></li>
                            <li><Link href="/submit" className="text-sm text-muted-foreground hover:text-primary transition-colors">Submit Tool</Link></li>
                            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Categories</Link></li>
                            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">New Arrivals</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-6">Resources</h3>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Documentation</Link></li>
                            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">API Reference</Link></li>
                            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Community</Link></li>
                            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-6">Company</h3>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link></li>
                            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</Link></li>
                            <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
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
