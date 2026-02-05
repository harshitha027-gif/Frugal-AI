import { Info } from 'lucide-react'

interface ScorecardProps {
    tool: any
}

export function Scorecard({ tool }: ScorecardProps) {
    // Use real scores, defaulting to 0 if not yet calculated
    const efficiencyScore = Math.round((tool.score_footprint / 30) * 100) || 0
    const transparencyScore = Math.round((tool.score_tco / 15) * 100) || 0 // TCO proxy for transparency/openness in this UI context? 
    // Actually, let's map correctly:
    // UI shows: "Resource Efficiency", "Transparency & License", "Maintenance Activity"

    // Resource Efficiency -> score_footprint (30) + score_energy (25) + score_hardware (20) ?
    // Or just score_footprint scaled? The prompt said "Efficiency Score" = Frugal Index.

    // Let's use the sub-scores accurately:
    // 1. "Resource Efficiency" -> Combined Footprint + Energy? 
    // Let's use score_footprint + score_energy scaled to 100% basis of their weights (30+25=55)
    const resourceRaw = (tool.score_footprint || 0) + (tool.score_energy || 0)
    const resourceMax = 30 + 25
    const resourceEfficientPercentage = Math.round((resourceRaw / resourceMax) * 100)

    // 2. "Transparency & License" -> TCO (has license check) + Data?
    // Let's use TCO (15) + Data (10)
    const transpRaw = (tool.score_tco || 0) + (tool.score_data || 0)
    const transpMax = 15 + 10
    const transpPercentage = Math.round((transpRaw / transpMax) * 100)

    // 3. "Maintenance Activity" -> We don't have a direct score for this in the formula unless we add it
    // The formula has: Footprint, Hardware, Energy, TCO, Data. 
    // Where is "Maintenance"?
    // Ah, "Activity check" is in the Vetting Phase 2 ("Flag abandonware"), but not explicitly in Frugal Index weights in spec?
    // Wait, spec says: "The current Carbon Efficiency Score is replaced by Frugal AI Index".
    // Spec Phase 3 Table matches the 5 I implemented.
    // So "Maintenance" is NOT in the score. 
    // I should probably replace "Maintenance Activity" in UI with "Hardware Agnosticism" (20%) or "Data Frugality" to match the actual score components.
    // Spec says: "Hardware Agnosticism 20%".
    // I will replace "Maintenance Activity" with "Hardware Agnosticism".

    const hwPercentage = Math.round((tool.score_hardware || 0) / 20 * 100)

    return (
        <div className="bg-[#1a1f2e] border border-white/5 rounded-xl p-5 w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                    Frugal AI Index
                    <div className="group relative">
                        <Info className="w-4 h-4 text-neutral-500 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-black border border-white/20 p-2 rounded text-xs text-neutral-300 hidden group-hover:block z-10 shadow-xl">
                            A composite score measuring efficiency, transparency, and maintenance.
                        </div>
                    </div>
                </h3>
                <span className="text-2xl font-bold text-[#00f0b5]">{tool.frugal_score_total || 0}/100</span>
            </div>

            <div className="space-y-3">
                {/* Efficiency */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-neutral-400">
                        <span>Resource Efficiency</span>
                        <span>{Math.round(((tool.score_footprint || 0) + (tool.score_energy || 0)) / 55 * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.round(((tool.score_footprint || 0) + (tool.score_energy || 0)) / 55 * 100)}%` }} />
                    </div>
                </div>

                {/* Transparency (TCO + Data) */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-neutral-400">
                        <span>Openness & TCO</span>
                        <span>{Math.round(((tool.score_tco || 0) + (tool.score_data || 0)) / 25 * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.round(((tool.score_tco || 0) + (tool.score_data || 0)) / 25 * 100)}%` }} />
                    </div>
                </div>

                {/* Hardware Agnosticism */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-neutral-400">
                        <span>Hardware Agnosticism</span>
                        <span>{Math.round((tool.score_hardware || 0) / 20 * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.round((tool.score_hardware || 0) / 20 * 100)}%` }} />
                    </div>
                </div>
            </div>
        </div>
    )
}
