'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { slugify } from '@/lib/utils'

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
    const model_size = formData.get('model_size') as string
    const carbon_score = parseInt(formData.get('carbon_score') as string)
    const is_offline_capable = formData.get('is_offline_capable') === 'on'

    // 3. Validation (Basic)
    if (!name || !url || !category_id) {
        return { error: 'Missing required fields' }
    }

    // 4. Generate Slug
    const baseSlug = slugify(name)
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`

    // 5. Insert
    const { error } = await supabase.from('tools').insert({
        name,
        slug,
        tagline,
        description_md,
        destination_url: url,
        category_id,
        model_size,
        carbon_score,
        is_offline_capable,
        owner_id: user.id // Critical for RLS
    })

    if (error) {
        return { error: error.message }
    }

    // 6. Redirect
    redirect('/dashboard')
}
