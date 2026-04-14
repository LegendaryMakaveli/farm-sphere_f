import { useState } from 'react';
import { useGetAllFarmCyclesQuery, useCreateTaskMutation, useGetTasksByFarmCycleQuery } from '@/store/api/adminApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import { Plus, ListTodo } from 'lucide-react';
import { useForm } from 'react-hook-form';

export function TaskManagementPage() {
  const { data: cyclesRes } = useGetAllFarmCyclesQuery();
  const cycles = cyclesRes?.data || [];
  const [selectedCycle, setSelectedCycle] = useState(null);
  const { data: tasksRes, isLoading } = useGetTasksByFarmCycleQuery(selectedCycle, { skip: !selectedCycle });
  const [createTask, { isLoading: creating }] = useCreateTaskMutation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const tasks = tasksRes?.data || [];
  const taskForm = useForm();

  return (
    <>
      <PageHeader title="Task Management" description="Create and manage farming tasks"
        action={<Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-1" /> Create Task</Button>}
      />

      <div className="mb-6">
        <Label className="mb-2 block">Select Farm Cycle</Label>
        <Select onValueChange={v => setSelectedCycle(v)}>
          <SelectTrigger className="w-64"><SelectValue placeholder="Choose a farm cycle" /></SelectTrigger>
          <SelectContent>{cycles.map(c => <SelectItem key={c.farmCycleId} value={String(c.farmCycleId)}>Cycle #{c.farmCycleId} — {c.status}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {!selectedCycle ? <EmptyState icon={ListTodo} title="Select a farm cycle" description="Choose a farm cycle above to view its tasks" /> :
       isLoading ? <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div> :
       tasks.length === 0 ? <EmptyState icon={ListTodo} title="No tasks" description="Create tasks for this farm cycle" /> :
        <div className="space-y-3">{tasks.map(t => (
          <Card key={t.taskId}><CardContent className="p-4 flex items-center justify-between">
            <div><p className="font-medium">{t.title}</p><p className="text-xs text-muted-foreground">{t.description} • Due: {formatDate(t.dueDate)} • Assigned to: {t.assignedFarmerEmail}</p></div>
            <StatusBadge status={t.status} />
          </CardContent></Card>
        ))}</div>}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>Create Task</DialogTitle></DialogHeader>
          <form onSubmit={taskForm.handleSubmit(async d => { await createTask(d); setDialogOpen(false); taskForm.reset(); })} className="space-y-3">
            <div className="space-y-1"><Label>Farm Cycle ID</Label><Input type="number" {...taskForm.register('farmCycleId', { valueAsNumber: true })} /></div>
            <div className="space-y-1"><Label>Title</Label><Input {...taskForm.register('title')} /></div>
            <div className="space-y-1"><Label>Description</Label><Textarea {...taskForm.register('description')} rows={2} /></div>
            <div className="space-y-1"><Label>Due Date</Label><Input type="date" {...taskForm.register('dueDate')} /></div>
            <div className="space-y-1"><Label>Assigned Farmer ID</Label><Input type="number" {...taskForm.register('assignedFarmerId', { valueAsNumber: true })} /></div>
            <DialogFooter><Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create Task'}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
