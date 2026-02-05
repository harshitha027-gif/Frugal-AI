'use server'

import { createClient } from '@/lib/supabase/server'

// Helper to check admin permission
async function checkAdmin(supabase: any) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) return false

    // In production, this comes from ENV. 
    // For now, we allowed 'harshitha@example.com' and 'admin@frugalai.com' in .env.local
    const envEmails = process.env.ADMIN_EMAILS || ''
    const allowedEmails = envEmails.split(',').map(e => e.trim().toLowerCase())
    const userEmail = (user.email || '').toLowerCase()

    console.log('[Admin Check] User:', userEmail)
    console.log('[Admin Check] Allowed:', allowedEmails)
    console.log('[Admin Check] Match:', allowedEmails.includes(userEmail))

    return allowedEmails.includes(userEmail)
}

export async function getAdminTools() {
    const supabase = await createClient()

    // 1. Security Check
    const isAdmin = await checkAdmin(supabase)
    if (!isAdmin) {
        // Return null/empty to indicate unauthorized, or handle in UI
        // For better UX, we might want to redirect, but in a Server Action we return data.
        return { tools: [], stats: null, unauthorized: true }
    }

    // 2. Fetch Tools
    const { data: tools, error } = await supabase
        .from('tools')
        .select(`
            *,
            category:categories(name)
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching admin tools:', error)
        return { tools: [], stats: null }
    }

    // 3. Fetch KPI Analytics
    // We want: Total Views, Total Clicks, Form Starts
    const { data: events } = await supabase
        .from('analytics_events')
        .select('event_name, created_at')
    // Limiting to recent events might be good for perf later, but currently fetch all

    const viewCount = events?.filter(e => e.event_name === 'view_tool').length || 0
    const clickCount = events?.filter(e => e.event_name === 'click_outbound').length || 0
    const formStartCount = events?.filter(e => e.event_name === 'form_start').length || 0

    // For simplicity, we compare form_start to tools created (proxy for submissions)
    // In a real funnel, we'd track 'form_submit' event too.
    const submissionCount = tools.length
    const abandonmentRate = formStartCount > 0
        ? Math.round(((formStartCount - submissionCount) / formStartCount) * 100)
        : 0

    const conversionRate = viewCount > 0
        ? ((clickCount / viewCount) * 100).toFixed(1)
        : '0.0'

    // 4. Calculate Stats
    const stats = {
        pending: tools.filter(t => t.status === 'pending' || t.status === 'under_review').length,
        approvedToday: tools.filter(t => t.status === 'approved' && new Date(t.created_at).toDateString() === new Date().toDateString()).length,
        avgScore: Math.round(tools.reduce((acc, t) => acc + (t.frugal_score_total || 0), 0) / (tools.length || 1)),
        needsClarification: tools.filter(t => t.status === 'needs_clarification').length,
        total: tools.length,
        // New KPI Stats
        totalViews: viewCount,
        conversionRate: conversionRate,
        abandonmentRate: abandonmentRate
    }

    return { tools, stats }
}

export async function updateToolStatus(toolId: string, status: string, feedback?: string) {
    const supabase = await createClient()

    // Check if user is admin (TODO: Implement real admin auth check)
    // For now we assume the route protection middleware handles this or we rely on RLS if set up for admins

    const updateData: any = { status }
    if (feedback) {
        updateData.admin_feedback = feedback
    }

    if (status === 'approved') {
        updateData.approved_at = new Date().toISOString()
    }

    const { error } = await supabase
        .from('tools')
        .update(updateData)
        .eq('id', toolId)

    if (error) {
        console.error('Error updating tool:', error)
        // If error is about missing column, we fallback to just status update
        if (error.message.includes('column "admin_feedback" does not exist')) {
            const { error: retryError } = await supabase
                .from('tools')
                .update({ status })
                .eq('id', toolId)

            if (retryError) return { error: retryError.message }
            return { success: true, warning: 'Feedback could not be saved (missing column)' }
        }
        return { error: error.message }
    }
    return { success: true }
}
