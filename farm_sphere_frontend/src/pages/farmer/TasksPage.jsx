import { useGetMyTasksQuery, useUpdateTaskStatusMutation } from '@/store/api/farmingApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils';
import { ListTodo, CheckCircle2, Clock, Play } from 'lucide-react';

export function TasksPage() {
  const { data: response, isLoading } = useGetMyTasksQuery();
  const [updateStatus, { isLoading: updating }] = useUpdateTaskStatusMutation();
  const tasks = response?.data || [];

  const pending = tasks.filter(t => t.status === 'PENDING');
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS');
  const done = tasks.filter(t => t.status === 'DONE');

  const handleStatusUpdate = async (taskId, status) => {
    await updateStatus({ taskId, status });
  };

  const TaskList = ({ items }) => items.length === 0 ? (
    <p className="text-sm text-muted-foreground py-8 text-center">No tasks in this category</p>
  ) : (
    <div className="space-y-3">
      {items.map(task => (
        <Card key={task.taskId}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">{task.title}</p>
                  <StatusBadge status={task.status} />
                </div>
                {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                <p className="text-xs text-muted-foreground mt-1">Due: {formatDate(task.dueDate)} • Cycle #{task.farmCycleId}</p>
              </div>
              <div className="flex gap-2">
                {task.status === 'PENDING' && (
                  <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(task.taskId, 'IN_PROGRESS')} disabled={updating}>
                    <Play className="h-3 w-3 mr-1" /> Start
                  </Button>
                )}
                {task.status === 'IN_PROGRESS' && (
                  <Button size="sm" variant="success" onClick={() => handleStatusUpdate(task.taskId, 'DONE')} disabled={updating}>
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Done
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <PageHeader title="My Tasks" description="Manage your farming tasks" />

      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : (
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2"><Clock className="h-3.5 w-3.5" /> Pending ({pending.length})</TabsTrigger>
            <TabsTrigger value="in_progress" className="gap-2"><Play className="h-3.5 w-3.5" /> In Progress ({inProgress.length})</TabsTrigger>
            <TabsTrigger value="done" className="gap-2"><CheckCircle2 className="h-3.5 w-3.5" /> Done ({done.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="pending"><TaskList items={pending} /></TabsContent>
          <TabsContent value="in_progress"><TaskList items={inProgress} /></TabsContent>
          <TabsContent value="done"><TaskList items={done} /></TabsContent>
        </Tabs>
      )}
    </>
  );
}
