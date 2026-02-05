import { Construction } from 'lucide-react'
import Link from 'next/link'

export default function AdminUsersPage() {
    return (
        <div className="min-h-screen bg-[#0B0E14] text-neutral-200 font-sans flex flex-col items-center justify-center p-4">
            <div className="p-8 bg-[#11161f] rounded-2xl border border-white/10 shadow-2xl max-w-md w-full text-center">
                <div className="w-16 h-16 bg-[#00f0b5]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Construction className="w-8 h-8 text-[#00f0b5]" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">User Management</h1>
                <p className="text-neutral-400 mb-8">This module is currently under development. You will be able to manage user roles and permissions here soon.</p>
                <Link href="/admin" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#00f0b5] text-black font-bold hover:bg-emerald-400 transition-colors w-full">
                    Back to Dashboard
                </Link>
            </div>
        </div>
    )
}
