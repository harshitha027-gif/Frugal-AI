'use client'

import { useState } from 'react'
import { MoreHorizontal, Clock, CheckCircle, X, MessageSquare, Eye, AlertTriangle, FileText, HelpCircle, Activity, Lock } from 'lucide-react'
import { updateToolStatus } from '@/actions/admin'

export function ToolRow({ tool, onStatusUpdate }: { tool: any, onStatusUpdate: (id: string, status: string) => void }) {
    const [loading, setLoading] = useState(false)

    const handleAction = async (newStatus: string) => {
        let feedback = ''
        if (newStatus === 'needs_clarification') {
            const message = prompt('Please enter the clarification request for the user:')
            if (message === null) return // Cancelled
            if (message.trim() === '') return alert('Message cannot be empty')
            feedback = message
        } else if (!confirm(`Are you sure you want to mark this as ${newStatus}?`)) {
            return
        }

        setLoading(true)
        const result = await updateToolStatus(tool.id, newStatus, feedback)
        if (result?.success) {
            onStatusUpdate(tool.id, newStatus)
        } else {
            alert('Failed to update status')
        }
        setLoading(false)
    }

    const status = tool.status
    // const [status, setStatus] = useState(tool.status) // Removed local state in favor of props

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50'
            case 'under_review': return 'bg-blue-900/30 text-blue-300 border-blue-700/50'
            case 'approved': return 'bg-[#00f0b5]/10 text-[#00f0b5] border-[#00f0b5]/30'
            case 'rejected': return 'bg-red-900/30 text-red-300 border-red-700/50'
            case 'needs_clarification': return 'bg-orange-900/30 text-orange-300 border-orange-700/50'
            default: return 'bg-gray-800 text-gray-400 border-gray-700'
        }
    }

    const getStatusLabel = (status: string) => {
        return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }

    return (
        <tr className={`hover:bg-white/[0.02] transition-colors group border-l-2 border-l-transparent hover:border-l-[#00f0b5] ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]">
                        {tool.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-white group-hover:text-[#00f0b5] transition-colors">{tool.name}</div>
                        <div className="text-xs text-neutral-500">ID: #{tool.id.slice(0, 4)} • {new Date(tool.created_at).toLocaleDateString()}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-md border ${getStatusStyle(status)}`}>
                    {getStatusLabel(status)}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col gap-1.5">
                    {tool.vetting_results?.license_ok || tool.license_url ? (
                        <div className="flex items-center text-xs text-neutral-300">
                            <FileText className="w-4 h-4 mr-1.5 text-emerald-500" /> Open Source
                        </div>
                    ) : (
                        <div className="flex items-center text-xs text-neutral-500">
                            <FileText className="w-4 h-4 mr-1.5 text-neutral-600" /> License Unverified
                        </div>
                    )}

                    {tool.vetting_results?.is_active ? (
                        <div className="flex items-center text-xs text-neutral-300">
                            <Activity className="w-4 h-4 mr-1.5 text-emerald-500" /> Active Dev
                        </div>
                    ) : (
                        <div className="flex items-center text-xs text-neutral-500">
                            <Clock className="w-4 h-4 mr-1.5" /> Recent Commit Unknown
                        </div>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="inline-flex items-center justify-center px-3 py-1 rounded-md border border-[#00f0b5]/30 bg-[#00f0b5]/5 shadow-[0_0_10px_rgba(0,240,181,0.1)]">
                    <span className="text-lg font-bold text-[#00f0b5]">{tool.frugal_score_total || 0}</span>
                    <span className="text-[10px] text-[#00f0b5]/70 ml-1">/100</span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleAction('rejected')} className="text-neutral-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors" title="Reject">
                        <X className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleAction('needs_clarification')} className="text-neutral-500 hover:text-orange-300 p-2 rounded-lg hover:bg-orange-500/10 transition-colors" title="Request Clarification">
                        <MessageSquare className="w-5 h-5" />
                    </button>
                    {status !== 'approved' && (
                        <button onClick={() => handleAction('approved')} className="bg-[#00f0b5] hover:bg-emerald-400 text-black px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-all hover:scale-105">
                            Approve
                        </button>
                    )}
                </div>
            </td>
        </tr>
    )
}
