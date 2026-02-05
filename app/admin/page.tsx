import { getAdminTools } from '@/actions/admin'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default async function AdminDashboardPage() {
    const { tools, stats, unauthorized } = await getAdminTools()

    if (unauthorized) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-white">
                <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
                <p className="text-neutral-400">You do not have permission to view this page.</p>
                <p className="text-sm text-neutral-600 mt-2">Check ADMIN_EMAILS configuration.</p>
            </div>
        )
    }

    return <AdminDashboard initialTools={tools} stats={stats} />
}
