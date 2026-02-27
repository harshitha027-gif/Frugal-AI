'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Star, User as UserIcon, Loader2, Send } from 'lucide-react'
import Link from 'next/link'

interface Review {
    id: string
    rating: number
    comment: string
    created_at: string
    profiles: {
        full_name: string
        avatar_url: string
    }
}

export function ReviewsSection({ toolId }: { toolId: string }) {
    const supabase = createClient()
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [submitting, setSubmitting] = useState(false)

    // Form State
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            // Check Auth
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            // Fetch Reviews
            const { data } = await supabase
                .from('reviews')
                .select(`
                    id, rating, comment, created_at,
                    profiles (full_name, avatar_url)
                `)
                .eq('tool_id', toolId)
                .order('created_at', { ascending: false })

            if (data) setReviews(data as any)
            setLoading(false)
        }
        fetchData()
    }, [toolId, supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setSubmitting(true)
        const { error } = await supabase
            .from('reviews')
            .insert({
                tool_id: toolId,
                user_id: user.id,
                rating,
                comment,
            })

        if (error) {
            alert('Error submitting review')
            console.error(error)
        } else {
            // Optimistic Update can be tricky with partial profile data, 
            // so let's just re-fetch or construct a local object if possible.
            // For simplicity/reliability, re-fetch or mock:
            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', user.id)
                .single()

            const newReview: Review = {
                id: Math.random().toString(), // temp id
                rating,
                comment,
                created_at: new Date().toISOString(),
                profiles: profile || { full_name: 'You', avatar_url: '' }
            }

            setReviews([newReview, ...reviews])
            setComment('')
            setRating(5)
        }
        setSubmitting(false)
    }

    const averageRating = reviews.length
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 'New'

    if (loading) return <div className="py-8 text-center text-neutral-500">Loading reviews...</div>

    return (
        <div className="mt-16 border-t border-border pt-12">
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                User Reviews
                <span className="text-lg font-normal text-muted-foreground bg-foreground/5 px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {averageRating} <span className="text-muted-foreground/60">({reviews.length})</span>
                </span>
            </h2>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Reviews List */}
                <div className="space-y-6">
                    {reviews.length === 0 ? (
                        <div className="text-neutral-500 italic">No reviews yet. Be the first to share your thoughts!</div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="bg-card p-6 rounded-2xl border border-border">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex items-center justify-center border border-border">
                                            {review.profiles?.avatar_url ? (
                                                <img src={review.profiles.avatar_url} alt={review.profiles.full_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <UserIcon className="w-5 h-5 text-neutral-500" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-foreground font-medium">{review.profiles?.full_name || 'Anonymous'}</div>
                                            <div className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400' : 'text-neutral-700 fill-neutral-700'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Write Review Form */}
                <div className="bg-card p-8 rounded-3xl border border-border h-fit sticky top-32">
                    <h3 className="text-xl font-bold text-foreground mb-6">Drop a Review</h3>

                    {user ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star className={`w-8 h-8 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-700'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Your Experience</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="How was the performance? Is it truly frugal?"
                                    rows={4}
                                    required
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 transition-all resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 bg-foreground text-background font-bold rounded-xl hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                Submit Review
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-neutral-400 mb-6">Please sign in to leave a review.</p>
                            <Link
                                href="/login"
                                className="inline-block px-6 py-3 bg-emerald-500 text-black font-bold rounded-full hover:bg-emerald-400 transition-colors"
                            >
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
