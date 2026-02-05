'use client'

import Link from 'next/link'
import React, { useState, useMemo } from 'react'
import { ToolRow } from '@/components/admin/ToolRow'
import {
    Bell,
    Search,
    Filter,
    ArrowUpDown,
    Clock,
    CheckCircle,
    TrendingUp,
    ArrowUp,
    Activity,
    Flag,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'

interface AdminDashboardProps {
    initialTools: any[]
    stats: any
}

export function AdminDashboard({ initialTools, stats: initialStats }: AdminDashboardProps) {
    const [tools, setTools] = useState(initialTools)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 10

    // Dynamic Stats Calculation
    const stats = useMemo(() => {
        const derivedStats = {
            pending: tools.filter((t: any) => t.status === 'pending' || t.status === 'under_review').length,
            approvedToday: tools.filter((t: any) => t.status === 'approved' && new Date(t.created_at).toDateString() === new Date().toDateString()).length,
            avgScore: Math.round(tools.reduce((acc: number, t: any) => acc + (t.frugal_score_total || 0), 0) / (tools.length || 1)),
            needsClarification: tools.filter((t: any) => t.status === 'needs_clarification').length,
            total: tools.length
        }

        // Merge with initialStats to keep server-side analytics (views, conversion, etc.)
        return {
            ...initialStats,
            ...derivedStats
        }
    }, [tools, initialStats])

    const handleToolUpdate = (toolId: string, newStatus: string) => {
        setTools(prev => prev.map((t: any) => t.id === toolId ? { ...t, status: newStatus } : t))
    }

    // Filter and Sort Logic
    const filteredTools = useMemo(() => {
        return tools
            .filter((tool: any) => {
                const matchesSearch =
                    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    tool.id.toLowerCase().includes(searchQuery.toLowerCase())

                const matchesStatus = statusFilter === 'all' || tool.status === statusFilter

                return matchesSearch && matchesStatus
            })
            .sort((a: any, b: any) => {
                const dateA = new Date(a.created_at).getTime()
                const dateB = new Date(b.created_at).getTime()
                return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
            })
    }, [tools, searchQuery, statusFilter, sortOrder])

    // Pagination Logic
    const totalPages = Math.ceil(filteredTools.length / ITEMS_PER_PAGE)
    const paginatedTools = filteredTools.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    // Reset page when filters change
    React.useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, statusFilter])

    return (
        <div className="min-h-screen bg-[#0B0E14] text-neutral-200 font-sans selection:bg-[#00f0b5]/30 selection:text-white pb-20">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0B0E14]/90 backdrop-blur-md">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
                                <div className="w-8 h-8 bg-[#00f0b5] rounded-md flex items-center justify-center text-black font-bold text-xl shadow-[0_0_10px_rgba(0,240,181,0.2)] group-hover:shadow-[0_0_15px_rgba(0,240,181,0.4)] transition-all">F</div>
                                <span className="font-bold text-xl tracking-tight text-white">Frugal <span className="text-[#00f0b5]">AI</span></span>
                                <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-white/5 text-[#00f0b5] border border-white/10">Super Admin</span>
                            </Link>
                            <div className="hidden md:block">
                                <div className="flex items-baseline space-x-1">
                                    <Link className="px-3 py-2 rounded-md text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-all" href="/admin">Overview</Link>
                                    <Link className="px-3 py-2 rounded-md text-sm font-medium text-[#00f0b5] bg-[#00f0b5]/10 border border-[#00f0b5]/20 shadow-[0_0_10px_rgba(0,240,181,0.1)]" href="/admin">Review Queue</Link>
                                    <Link className="px-3 py-2 rounded-md text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-all" href="/admin/users">Users</Link>
                                    <Link className="px-3 py-2 rounded-md text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-all" href="/admin/settings">Configuration</Link>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/5 transition-colors relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-[#00f0b5] rounded-full animate-pulse shadow-[0_0_5px_#00f0b5]"></span>
                            </button>
                            <Link href="/profile" className="flex items-center gap-3 pl-4 border-l border-white/10 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-white">Admin User</p>
                                    <p className="text-xs text-neutral-400">Lead Reviewer</p>
                                </div>
                                <div className="h-9 w-9 rounded-full ring-2 ring-[#00f0b5]/20 bg-[#11161f] flex items-center justify-center overflow-hidden">
                                    {/* Placeholder Avatar */}
                                    <div className="w-full h-full bg-gradient-to-tr from-emerald-500 to-teal-500" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Review Dashboard</h1>
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> System Online</span>
                            <span className="text-white/20">|</span>
                            <span>v2.4.0</span>
                        </div>
                    </div>
                    {/* Analytics Health Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* Views */}
                        <div className="bg-[#11161f] p-5 rounded-xl border border-white/10 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <p className="text-sm font-medium text-neutral-400">Total Views</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{stats.totalViews}</h3>
                            <div className="mt-2 text-xs text-purple-400 flex items-center gap-1">
                                <Activity className="w-3 h-3" />
                                <span>Global traffic</span>
                            </div>
                        </div>

                        {/* Conversion Rate */}
                        <div className="bg-[#11161f] p-5 rounded-xl border border-white/10 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-[#00f0b5]/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <p className="text-sm font-medium text-neutral-400">Conversion Rate</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{stats.conversionRate}%</h3>
                            <div className="mt-2 text-xs text-[#00f0b5] flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                <span>Click-through to Repos</span>
                            </div>
                        </div>

                        {/* Form Abandonment */}
                        <div className="bg-[#11161f] p-5 rounded-xl border border-white/10 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <p className="text-sm font-medium text-neutral-400">Abandonment Rate</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{stats.abandonmentRate}%</h3>
                            <div className="mt-2 text-xs text-red-400 flex items-center gap-1">
                                <ArrowUp className="w-3 h-3" />
                                <span>Forms started vs submitted</span>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-4 mt-8 flex items-center gap-2">
                        <Filter className="w-5 h-5 text-neutral-400" />
                        Submission Queue
                    </h2>

                    {/* KPI Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Card 1: Pending */}
                        <div className="bg-[#11161f] p-5 rounded-xl border border-white/10 shadow-sm hover:border-[#00f0b5]/30 transition-all duration-300 group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-neutral-400 group-hover:text-[#00f0b5]/80 transition-colors">Pending Reviews</p>
                                    <h3 className="text-3xl font-bold text-white mt-1">{stats.pending}</h3>
                                </div>
                                <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                    <Clock className="w-6 h-6 text-yellow-500" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-neutral-400">
                                <span className="text-yellow-500 flex items-center mr-2 bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/10">
                                    <ArrowUp className="w-3 h-3 mr-0.5" /> +2
                                </span> since yesterday
                            </div>
                        </div>

                        {/* Card 2: Approved */}
                        <div className="bg-[#11161f] p-5 rounded-xl border border-white/10 shadow-sm hover:border-[#00f0b5]/30 transition-all duration-300 group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-neutral-400 group-hover:text-[#00f0b5]/80 transition-colors">Approved Today</p>
                                    <h3 className="text-3xl font-bold text-white mt-1">{stats.approvedToday}</h3>
                                </div>
                                <div className="p-2 bg-[#00f0b5]/10 rounded-lg border border-[#00f0b5]/20">
                                    <CheckCircle className="w-6 h-6 text-[#00f0b5]" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-neutral-400">
                                <span className="text-[#00f0b5] flex items-center mr-2 bg-[#00f0b5]/10 px-1.5 py-0.5 rounded border border-[#00f0b5]/10">
                                    <TrendingUp className="w-3 h-3 mr-0.5" /> 12%
                                </span> vs last week
                            </div>
                        </div>

                        {/* Card 3: Avg Score */}
                        <div className="bg-[#11161f] p-5 rounded-xl border border-white/10 shadow-sm hover:border-[#00f0b5]/30 transition-all duration-300 group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-neutral-400 group-hover:text-[#00f0b5]/80 transition-colors">Avg. Frugal Score</p>
                                    <h3 className="text-3xl font-bold text-white mt-1">{stats.avgScore}</h3>
                                </div>
                                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                    <Activity className="w-6 h-6 text-blue-500" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-neutral-400">
                                <div className="w-full bg-white/5 rounded-full h-1.5 mt-1 border border-white/5">
                                    <div className="bg-blue-500 h-1.5 rounded-full shadow-[0_0_8px_#3b82f6]" style={{ width: `${stats.avgScore}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Card 4: Needs Clarification */}
                        <div className="bg-[#11161f] p-5 rounded-xl border border-white/10 shadow-sm hover:border-[#00f0b5]/30 transition-all duration-300 group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-neutral-400 group-hover:text-[#00f0b5]/80 transition-colors">Needs Clarification</p>
                                    <h3 className="text-3xl font-bold text-white mt-1">{stats.needsClarification}</h3>
                                </div>
                                <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                                    <Flag className="w-6 h-6 text-orange-500" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-neutral-400">
                                <span className="text-red-400 flex items-center mr-2 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/10">
                                    Urgent: 1
                                </span> waiting &gt; 48h
                            </div>
                        </div>
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 mt-8">
                        <div className="relative w-full sm:w-96 group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-neutral-500 group-focus-within:text-[#00f0b5] transition-colors" />
                            </div>
                            <input
                                className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-lg leading-5 bg-[#11161f] text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#00f0b5] focus:border-[#00f0b5] sm:text-sm transition-all shadow-sm"
                                placeholder="Search by tool name or ID..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => setStatusFilter(prev => prev === 'all' ? 'pending' : prev === 'pending' ? 'approved' : 'all')}
                                className={`flex items-center justify-center px-4 py-2 border rounded-lg shadow-sm text-sm font-medium transition-all ${statusFilter !== 'all' ? 'border-[#00f0b5] text-[#00f0b5] bg-[#00f0b5]/10' : 'border-white/10 text-neutral-400 bg-[#11161f] hover:bg-white/5 hover:text-white'}`}
                            >
                                <Filter className="w-5 h-5 mr-2" />
                                {statusFilter === 'all' ? 'All Status' : statusFilter === 'pending' ? 'Pending' : 'Approved'}
                            </button>
                            <button
                                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                                className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-lg shadow-sm text-sm font-medium text-neutral-400 bg-[#11161f] hover:bg-white/5 hover:text-white transition-all"
                            >
                                <ArrowUpDown className="w-5 h-5 mr-2" />
                                {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-[#11161f] rounded-xl border border-white/10 shadow-xl overflow-hidden ring-1 ring-white/5">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-white/10">
                                <thead className="bg-black/20">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">Tool Details</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">License & Activity</th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-neutral-400 uppercase tracking-wider">Frugal Index</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-[#11161f] divide-y divide-white/10">
                                    {paginatedTools.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                                                No tools found matching your criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedTools.map((tool: any) => (
                                            <ToolRow
                                                key={tool.id}
                                                tool={tool}
                                                onStatusUpdate={handleToolUpdate}
                                            />
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination Footer */}
                    <div className="bg-black/20 px-4 py-3 border-t border-white/10 sm:px-6 mt-0">
                        <div className="flex items-center justify-between">
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-neutral-400">
                                        Showing <span className="font-medium text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-white">{Math.min(currentPage * ITEMS_PER_PAGE, filteredTools.length)}</span> of <span className="font-medium text-white">{filteredTools.length}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav aria-label="Pagination" className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-white/10 bg-[#11161f] text-sm font-medium text-neutral-400 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>

                                        {/* Simple page indicator for now */}
                                        <span className="relative inline-flex items-center px-4 py-2 border border-white/10 bg-[#00f0b5]/10 text-sm font-medium text-[#00f0b5]">
                                            {currentPage}
                                        </span>

                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages || totalPages === 0}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-white/10 bg-[#11161f] text-sm font-medium text-neutral-400 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <span className="sr-only">Next</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}
