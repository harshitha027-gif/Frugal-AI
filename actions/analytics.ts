'use server'

import { createClient } from '@/lib/supabase/server'

export async function logEvent(eventType: string, toolId?: string, meta: any = {}) {
    try {
        const supabase = await createClient()

        const { error } = await supabase.from('analytics_events').insert({
            event_type: eventType,
            tool_id: toolId || null,
            meta
        })

        if (error) {
            console.error('Analytics log error:', error)
        }
    } catch (e) {
        console.error('Analytics exception:', e)
    }
}
