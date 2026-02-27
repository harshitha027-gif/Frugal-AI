'use client'

import { useState } from 'react'
import { LeaderboardPodium } from './LeaderboardPodium'
import { LeaderboardTable } from './LeaderboardTable'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Cpu, Minimize2, GitBranch, TrendingUp } from 'lucide-react'

const TABS = [
    { id: 'frugal50', label: 'Frugal 50', icon: Trophy, description: 'Top 50 most efficient tools' },
    { id: 'edge', label: 'Edge Champions', icon: Cpu, description: 'Built for edge devices' },
    { id: 'tiny', label: 'Tiny Titans', icon: Minimize2, description: 'Under 1GB RAM footprint' },
    { id: 'opensource', label: 'Open Source Heroes', icon: GitBranch, description: '100% open source' },
    { id: 'trending', label: 'Trending', icon: TrendingUp, description: 'Rising in popularity' }
] as const

type TabId = typeof TABS[number]['id']

interface LeaderboardClientProps {
    allRankings: any[]
}

export function LeaderboardClient({ allRankings }: LeaderboardClientProps) {
    const [activeTab, setActiveTab] = useState<TabId>('frugal50')

    // Filter rankings based on active tab
    const getFilteredRankings = () => {
        // Always ensure we have an array
        if (!allRankings || !Array.isArray(allRankings)) {
            console.log('[LeaderboardClient] No rankings data:', allRankings)
            return []
        }

        console.log('[LeaderboardClient] Total rankings:', allRankings.length, 'Active tab:', activeTab)

        switch (activeTab) {
            case 'frugal50':
                // Top 50 by score (default behavior) - no filtering
                return allRankings.slice(0, 50)
            case 'edge':
                // Tools with high hardware score (edge-capable)
                return allRankings.filter(t => (t.score_hardware || 0) >= 60).slice(0, 50)
            case 'tiny':
                // Tools with high footprint score (small size)
                return allRankings.filter(t => (t.score_footprint || 0) >= 60).slice(0, 50)
            case 'opensource':
                // Open source tools
                return allRankings.filter(t =>
                    t.vetting_results?.license_ok === true ||
                    (t.score_tco || 0) >= 70
                ).slice(0, 50)
            case 'trending':
                // Sort by trend (popularity increase)
                return [...allRankings].sort((a, b) => (b.trend || 0) - (a.trend || 0)).slice(0, 50)
            default:
                return allRankings.slice(0, 50)
        }
    }

    const filteredRankings = getFilteredRankings()
    const activeTabInfo = TABS.find(t => t.id === activeTab)

    return (
        <div className="flex-1 min-w-0">
            {/* Page Header */}
            <div className="mb-8">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-foreground">
                    Global Leaderboard
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Tracking efficiency in the age of excess compute. Discover the most resource-efficient AI tools ranked by our proprietary Frugal Score™.
                </p>
            </div>

            {/* Interactive Tabs */}
            <div className="mb-8 border-b border-border overflow-x-auto no-scrollbar">
                <div className="flex space-x-1 md:space-x-2 min-w-max">
                    {TABS.map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    relative pb-3 px-3 md:px-4 flex items-center gap-2 
                                    font-medium text-sm tracking-wide transition-all duration-200
                                    ${isActive
                                        ? 'text-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }
                                `}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                                <span className="hidden sm:inline">{tab.label}</span>
                                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>

                                {/* Active indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                                        initial={false}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Tab Description */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="mb-6 flex items-center gap-3"
                >
                    <div className="h-8 w-1 bg-primary rounded-full" />
                    <div>
                        <span className="text-foreground font-semibold">{activeTabInfo?.label}</span>
                        <span className="text-muted-foreground ml-2">— {activeTabInfo?.description}</span>
                    </div>
                    <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {filteredRankings.length} tools
                    </span>
                </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            {filteredRankings.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-card border border-border rounded-xl p-12 text-center"
                >
                    <div className="size-16 mx-auto mb-4 rounded-full bg-[#1E2532] flex items-center justify-center">
                        {activeTabInfo && <activeTabInfo.icon className="w-8 h-8 text-[#9CA3AF]" />}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No tools found</h3>
                    <p className="text-[#9CA3AF] max-w-md mx-auto">
                        No tools match the {activeTabInfo?.label} criteria yet. Check back soon or submit your own tool!
                    </p>
                </motion.div>
            ) : (
                <>
                    {/* Podium Section */}
                    <LeaderboardPodium tools={filteredRankings} />

                    {/* Table Section */}
                    <LeaderboardTable tools={filteredRankings} />
                </>
            )}
        </div>
    )
}
