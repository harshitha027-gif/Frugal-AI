'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { slugify } from '@/lib/utils'
import { calculateFrugalScore } from '@/lib/scoring'
import { logEvent } from './analytics' // Will create this later

export async function publishTool(formData: FormData) {
    const supabase = await createClient()

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Unauthorized' }
    }

    // 2. Extract Data
    const name = formData.get('name') as string
    const tagline = formData.get('tagline') as string
    const description_md = formData.get('description_md') as string
    const url = formData.get('url') as string
    const category_id = formData.get('category_id') as string
    const license_url = formData.get('license_url') as string

    // Hardware
    const min_ram = formData.get('min_ram') as string
    const storage_footprint = formData.get('storage_footprint') as string
    const is_offline_capable = formData.get('is_offline_capable') === 'on'
    const gpu_vram = formData.get('gpu_vram') as string

    // Collect Checkboxes for Arrays
    const supported_hardware: string[] = []
    if (formData.get('hardware_cpu')) supported_hardware.push('CPU')
    if (formData.get('hardware_gpu')) supported_hardware.push('GPU')
    if (formData.get('hardware_edge')) supported_hardware.push('Edge/NPU')
    if (formData.get('hardware_apple')) supported_hardware.push('Apple Silicon')

    const deployment_context: string[] = []
    if (formData.get('deploy_edge')) deployment_context.push('Edge / On-device')
    if (formData.get('deploy_prem')) deployment_context.push('On-prem / Sovereign')
    if (formData.get('deploy_enterprise')) deployment_context.push('Enterprise Backend')

    // Evidence
    const efficiency_justification = formData.get('efficiency_justification') as string
    const evidence_links: string[] = []
    if (formData.get('evidence_link_1')) evidence_links.push(formData.get('evidence_link_1') as string)
    if (formData.get('evidence_link_2')) evidence_links.push(formData.get('evidence_link_2') as string)

    // 3. Validation
    if (!name || !url || !category_id) {
        return { error: 'Missing required fields' }
    }
    if (!efficiency_justification || efficiency_justification.length < 20) {
        return { error: 'Please provide a valid efficiency justification (min 20 chars).' }
    }

    // Check for Edit Mode
    const tool_id = formData.get('tool_id') as string

    // Vetting & Analysis
    const vetting_results = formData.get('vetting_results')
        ? JSON.parse(formData.get('vetting_results') as string)
        : { has_weights: false, license_ok: false }

    // Calculate Scores
    const scores = calculateFrugalScore({
        min_ram,
        storage_footprint,
        is_offline_capable,
        supported_hardware,
        deployment_context,
        has_weights: vetting_results.has_weights,
        license_ok: vetting_results.license_ok
    })

    if (tool_id) {
        // UPDATE EXISTING TOOL

        // Check ownership first
        const { data: existingTool } = await supabase
            .from('tools')
            .select('owner_id')
            .eq('id', tool_id)
            .single()

        if (!existingTool || existingTool.owner_id !== user.id) {
            return { error: 'Unauthorized to edit this tool' }
        }

        const { error } = await supabase.from('tools').update({
            name,
            tagline,
            description_md,
            url,
            category_id,
            min_ram,
            storage_footprint,
            is_offline_capable,
            gpu_vram,
            supported_hardware,
            deployment_context,
            efficiency_justification,
            efficiency_evidence_links: evidence_links,
            license_url,
            status: 'submitted', // Reset to submitted for re-review

            // New Fields
            frugal_score_total: scores.total,
            score_footprint: scores.footprint,
            score_hardware: scores.hardware,
            score_energy: scores.energy,
            score_tco: scores.tco,
            score_data: scores.data,
            vetting_results
        }).eq('id', tool_id)

        if (error) {
            console.error('Update error:', error)
            return { error: `Failed to update: ${error.message}` }
        }
    } else {
        // INSERT NEW TOOL

        // 4. Generate Slug
        const baseSlug = slugify(name)
        const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`

        // 5. Insert
        const { error } = await supabase.from('tools').insert({
            name,
            slug,
            tagline,
            description_md,
            url: url,
            category_id,
            min_ram,
            storage_footprint,
            is_offline_capable,
            gpu_vram,
            supported_hardware,
            deployment_context,
            efficiency_justification,
            efficiency_evidence_links: evidence_links,
            license_url,
            status: 'submitted',
            owner_id: user.id,

            // New Fields
            frugal_score_total: scores.total,
            score_footprint: scores.footprint,
            score_hardware: scores.hardware,
            score_energy: scores.energy,
            score_tco: scores.tco,
            score_data: scores.data,
            vetting_results
        })

        if (error) {
            console.error('Submission error:', error)
            return { error: `Failed to submit: ${error.message}` }
        }
    }

    // 6. Redirect to Profile
    redirect('/profile')
}
