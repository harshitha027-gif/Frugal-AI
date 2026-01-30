'use client'

import { publishTool } from '@/actions/publish-tool'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function ToolForm({ categories }: { categories: any[] }) {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        const result = await publishTool(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
        // If success, publishTool redirects, so we don't need to do anything here strictly,
        // though the component might unmount.
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="flex-col gap-2">
                    <label className="text-sm font-medium">Tool Name</label>
                    <Input name="name" placeholder="e.g. TinyLlama Edge" required />
                </div>
                <div className="flex-col gap-2">
                    <label className="text-sm font-medium">Tagline</label>
                    <Input name="tagline" placeholder="Short and catchy..." required />
                </div>
            </div>

            <div className="flex-col gap-2">
                <label className="text-sm font-medium">Destination URL</label>
                <Input name="url" type="url" placeholder="https://..." required />
            </div>

            <div className="flex-col gap-2">
                <label className="text-sm font-medium">Category</label>
                <select name="category_id" className="input" required defaultValue="">
                    <option value="" disabled>Select a Category</option>
                    {categories?.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <div className="flex-col gap-2">
                    <label className="text-sm font-medium">Model Size</label>
                    <Input name="model_size" placeholder="e.g. 4GB" />
                </div>
                <div className="flex-col gap-2">
                    <label className="text-sm font-medium">Carbon Score (1-100)</label>
                    <Input name="carbon_score" type="number" min="1" max="100" placeholder="100" required />
                </div>
                <div className="flex items-center gap-2 pt-8">
                    <input type="checkbox" name="is_offline_capable" id="offline" className="w-4 h-4" />
                    <label htmlFor="offline" className="text-sm cursor-pointer">Offline Capable</label>
                </div>
            </div>

            <div className="flex-col gap-2">
                <label className="text-sm font-medium">Description (Markdown)</label>
                <textarea
                    name="description_md"
                    className="input min-h-[150px] font-mono text-sm"
                    placeholder="# Features..."
                ></textarea>
            </div>

            {error && (
                <div className="text-red-500 text-sm">{error}</div>
            )}

            <Button type="submit" size="lg" className="mt-4" disabled={loading}>
                {loading ? 'Publishing...' : '🚀 Publish Tool'}
            </Button>
        </form>
    )
}
