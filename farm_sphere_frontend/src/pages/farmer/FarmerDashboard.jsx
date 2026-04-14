import { useGetMyFarmCyclesQuery, useGetMyTasksQuery } from '@/store/api/farmingApi';
import { useGetMyProduceQuery } from '@/store/api/marketplaceApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { KPICard } from '@/components/shared/KPICard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sprout, ListTodo, RotateCcw, Leaf, ArrowRight, CheckCircle2, Clock, Plus } from 'lucide-react';
import { useState } from 'react';
import { ListProduceDialog } from '@/components/farmer/ListProduceDialog';
import { formatCurrency } from '@/lib/utils';

export function FarmerDashboard() {
  const navigate = useNavigate();
  const { data: cyclesRes, isLoading: loadingCycles } = useGetMyFarmCyclesQuery();
  const { data: tasksRes, isLoading: loadingTasks } = useGetMyTasksQuery();
  const { data: produceRes, isLoading: loadingProduce } = useGetMyProduceQuery();

  const cycles = cyclesRes?.data || [];
  const tasks = tasksRes?.data || [];
  const produce = produceRes?.data || [];

  const activeCycles = cycles.filter(c => c.status === 'ACTIVE').length;
  const pendingTasks = tasks.filter(t => t.status === 'PENDING').length;
  const doneTasks = tasks.filter(t => t.status === 'DONE').length;
  const activeProduce = produce.filter(p => p.status === 'AVAILABLE').length;

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <PageHeader 
        title="Farm Dashboard" 
        description="Overview of your farming activities" 
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> List New Produce
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard title="Active Cycles" value={activeCycles} icon={RotateCcw} loading={loadingCycles} subtitle="farm cycles running" />
        <KPICard title="Pending Tasks" value={pendingTasks} icon={Clock} loading={loadingTasks} subtitle="tasks awaiting action" />
        <KPICard title="Completed Tasks" value={doneTasks} icon={CheckCircle2} loading={loadingTasks} subtitle="tasks done" />
        <KPICard title="Active Listings" value={activeProduce} icon={Leaf} loading={loadingProduce} subtitle="produce for sale" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Produce Listings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base text-forest-700 dark:text-forest-400">Marketplace Listings</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/farmer/my-produce')}>
              Manage All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {loadingProduce ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => <div key={i} className="h-12 w-full bg-muted animate-pulse rounded-md" />)}
              </div>
            ) : produce.length === 0 ? (
              <div className="py-8 text-center border-2 border-dashed rounded-xl">
                <Leaf className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-20" />
                <p className="text-sm text-muted-foreground mb-3">No active listings</p>
                <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>List some produce</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {produce.slice(0, 3).map((item) => (
                  <div key={item.produceId} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-forest-50 dark:bg-forest-900/20 flex items-center justify-center text-forest-600">
                        <Leaf className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.cropName}</p>
                        <p className="text-xs text-muted-foreground">{item.quantityAvailable} {item.unit} • {formatCurrency(item.pricePerUnit)}/{item.unit}</p>
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2" onClick={() => setDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Create New Listing
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 hover:bg-forest-50 dark:hover:bg-forest-900/10 hover:border-forest-200" onClick={() => setDialogOpen(true)}>
              <div className="h-10 w-10 rounded-full bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center text-forest-600">
                <Plus className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Add Listing</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/farmer/tasks')}>
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                <ListTodo className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">View Tasks</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/farmer/farm-cycles')}>
              <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                <RotateCcw className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Manage Cycles</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/farmer/tools')}>
              <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                <Sprout className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Book Tools</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      <ListProduceDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
