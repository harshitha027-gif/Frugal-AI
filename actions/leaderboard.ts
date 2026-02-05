'use server'

import { createClient } from '@/lib/supabase/server'

export async function getLeaderboardData() {
    const supabase = await createClient()

    // 1. Fetch Top 50 by Frugal Score
    // In a real app we might combine score + views, but for now just score is fine
    const { data: rankings, error: rankError } = await supabase
        .from('tools')
        .select(`
            id,
            name,
            slug,
            frugal_score_total,
            score_footprint,
            score_hardware,
            score_energy,
            score_tco,
            score_data,
            vetting_results,
            category:categories(name)
        `)
        .eq('status', 'approved')
        .order('frugal_score_total', { ascending: false, nullsFirst: false })
        .limit(100)

    console.log('[Leaderboard] Query results:', rankings?.length || 0, 'tools, error:', rankError?.message || 'none')

    if (rankError) {
        console.error('Error fetching leaderboard:', rankError)
        return { rankings: [], fresh: [] }
    }

    // 2. Fetch Freshly Minted (Newest approved)
    const { data: fresh, error: freshError } = await supabase
        .from('tools')
        .select(`
            id,
            name,
            slug,
            tagline,
            created_at,
            approved_at
        `)
        .eq('status', 'approved')
        .order('approved_at', { ascending: false })
        .limit(5)

    // Process rankings to include popularity proxy if needed
    // (For now, just mapping simple structure)
    const processedRankings = rankings.map((r: any) => ({
        ...r,
        // Mocking popularity trend for visual UI since we don't have historical trend data yet
        trend: Math.random() > 0.5 ? Math.floor(Math.random() * 10) + 1 : 0,
        category_name: r.category?.name || 'Uncategorized'
    }))

    return {
        rankings: processedRankings,
        fresh: fresh || []
    }
}
