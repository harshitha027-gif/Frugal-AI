import { getLeaderboardData } from '@/actions/leaderboard'
import { LeaderboardClient } from '@/components/leaderboard/LeaderboardClient'
import { FreshlyMinted } from '@/components/leaderboard/FreshlyMinted'

export const dynamic = 'force-dynamic'

export default async function LeaderboardPage() {
    const { rankings, fresh } = await getLeaderboardData()

    return (
        <div className="bg-background min-h-screen text-foreground font-sans">
            <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-8 flex flex-col lg:flex-row gap-8 pt-24">
                {/* Center Column (Leaderboard with interactive tabs) */}
                <LeaderboardClient allRankings={rankings} />

                {/* Right Sidebar (Freshly Minted) */}
                <FreshlyMinted tools={fresh} />
            </main>
        </div>
    )
}
