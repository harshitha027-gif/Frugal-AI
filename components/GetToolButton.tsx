'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowUpRight } from 'lucide-react'

interface GetToolButtonProps {
    toolId: string
    url: string
}

export function GetToolButton({ toolId, url }: GetToolButtonProps) {
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleClick = async () => {
        setLoading(true)

        try {
            // Track click
            await Promise.all([
                supabase.from('analytics').insert({
                    tool_id: toolId,
                    visitor_id: crypto.randomUUID(),
                    geo_country: null,
                }),
                supabase.rpc('increment_tool_click', { tool_uuid: toolId })
            ])
        } catch (err) {
            console.error('Tracking error:', err)
        } finally {
            // Always redirect
            window.open(url, '_blank', 'noopener,noreferrer')
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-50 transition-colors"
        >
            {loading ? 'Loading...' : (
                <>
                    Get Tool <ArrowUpRight size={16} />
                </>
            )}
        </button>
    )
}
