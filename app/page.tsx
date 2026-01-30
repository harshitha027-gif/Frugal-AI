import { createClient } from '@/lib/supabase/server'
import { Hero } from "@/components/hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturedTools } from "@/components/FeaturedTools";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export default async function Home() {
    const supabase = await createClient()

    // Fetch Top 3 Tools by Views
    const { data: featuredTools } = await supabase
        .from('tools')
        .select(`
            *,
            categories (name)
        `)
        .order('views', { ascending: false })
        .limit(3)

    console.log("Featured tools:", featuredTools)

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-emerald-500/30">
            <Hero />
            <Features />
            <HowItWorks />
            <FeaturedTools tools={featuredTools || []} />
            <CTASection />
            <Footer />
        </main>
    );
}
