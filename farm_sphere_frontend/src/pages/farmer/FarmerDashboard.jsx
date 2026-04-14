import { useGetMyFarmCyclesQuery, useGetMyTasksQuery } from '@/store/api/farmingApi';
import { useGetMyProduceQuery } from '@/store/api/marketplaceApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { KPICard } from '@/components/shared/KPICard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sprout, ListTodo, RotateCcw, Leaf, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

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

  return (
    <>
      <PageHeader title="Farm Dashboard" description="Overview of your farming activities" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard title="Active Cycles" value={activeCycles} icon={RotateCcw} loading={loadingCycles} subtitle="farm cycles running" />
        <KPICard title="Pending Tasks" value={pendingTasks} icon={Clock} loading={loadingTasks} subtitle="tasks awaiting action" />
        <KPICard title="Completed Tasks" value={doneTasks} icon={CheckCircle2} loading={loadingTasks} subtitle="tasks done" />
        <KPICard title="Active Listings" value={activeProduce} icon={Leaf} loading={loadingProduce} subtitle="produce for sale" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Tasks</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/farmer/tasks')}>
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No tasks assigned</p>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.taskId} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <ListTodo className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.description?.slice(0, 50)}</p>
                      </div>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                ))}
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
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/farmer/my-produce')}>
              <Leaf className="h-5 w-5 text-forest-600" />
              <span className="text-xs">List Produce</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/farmer/tasks')}>
              <ListTodo className="h-5 w-5 text-blue-600" />
              <span className="text-xs">View Tasks</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/farmer/farm-cycles')}>
              <RotateCcw className="h-5 w-5 text-emerald-600" />
              <span className="text-xs">Farm Cycles</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/farmer/tools')}>
              <Sprout className="h-5 w-5 text-amber-600" />
              <span className="text-xs">Book Tools</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
