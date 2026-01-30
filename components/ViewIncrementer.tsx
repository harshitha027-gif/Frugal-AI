'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export function ViewIncrementer({ toolId }: { toolId: string }) {
    const hasIncremented = useRef(false)
    const supabase = createClient()

    useEffect(() => {
        if (!hasIncremented.current) {
            hasIncremented.current = true
            supabase.rpc('increment_tool_view', { tool_id: toolId }).then(({ error }) => {
                if (error) console.error('Error incrementing view:', error)
            })
        }
    }, [toolId, supabase])

    return null
}
