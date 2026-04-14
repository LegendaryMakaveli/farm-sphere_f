import { Link } from 'react-router-dom';
import { useGetPendingFarmersQuery, useGetPendingInvestorsQuery, useGetAllOrdersQuery, useGetAllFarmCyclesQuery } from '@/store/api/adminApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { KPICard } from '@/components/shared/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingCart, RotateCcw, UserPlus, Wrench, MapPin } from 'lucide-react';

export function AdminDashboard() {
  const { data: farmersRes, isLoading: lf } = useGetPendingFarmersQuery();
  const { data: investorsRes, isLoading: li } = useGetPendingInvestorsQuery();
  const { data: ordersRes, isLoading: lo } = useGetAllOrdersQuery();
  const { data: cyclesRes, isLoading: lc } = useGetAllFarmCyclesQuery();

  const pendingFarmers = farmersRes?.data?.length || 0;
  const pendingInvestors = investorsRes?.data?.length || 0;
  const totalOrders = ordersRes?.data?.length || 0;
  const activeCycles = (cyclesRes?.data || []).filter(c => c.status === 'ACTIVE').length;

  return (
    <>
      <PageHeader title="Admin Dashboard" description="Overview of FarmSphere platform" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard title="Pending Farmers" value={pendingFarmers} icon={UserPlus} loading={lf} subtitle="awaiting approval" />
        <KPICard title="Pending Investors" value={pendingInvestors} icon={Users} loading={li} subtitle="awaiting approval" />
        <KPICard title="Total Orders" value={totalOrders} icon={ShoppingCart} loading={lo} subtitle="marketplace orders" />
        <KPICard title="Active Cycles" value={activeCycles} icon={RotateCcw} loading={lc} subtitle="farming cycles" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Quick Navigation</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {[
              { label: 'User Approvals', icon: Users, path: '/admin/approvals', color: 'text-blue-600' },
              { label: 'Estate Management', icon: MapPin, path: '/admin/estates', color: 'text-green-600' },
              { label: 'Order Management', icon: ShoppingCart, path: '/admin/orders', color: 'text-purple-600' },
              { label: 'Tool Management', icon: Wrench, path: '/admin/tools', color: 'text-amber-600' },
            ].map((item) => (
              <Link key={item.path} directly="true" to={item.path} className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors">
                <item.icon className={`h-5 w-5 ${item.color}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Platform Health</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Server Status</span><span className="status-dot-success" /></div>
              <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Database</span><span className="status-dot-success" /></div>
              <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Email Service</span><span className="status-dot-success" /></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
