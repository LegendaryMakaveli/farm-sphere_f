import { useState } from 'react';
import { useGetAllFarmCyclesQuery, useStartFarmCycleMutation, useActivateFarmCycleMutation, useRecordHarvestMutation } from '@/store/api/adminApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import { Plus, RotateCcw, Play, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

export function FarmCycleManagementPage() {
  const { data: res, isLoading } = useGetAllFarmCyclesQuery();
  const [startFarmCycle, { isLoading: starting }] = useStartFarmCycleMutation();
  const [activateFarmCycle] = useActivateFarmCycleMutation();
  const [recordHarvest, { isLoading: harvesting }] = useRecordHarvestMutation();
  const [startDialog, setStartDialog] = useState(false);
  const [harvestDialog, setHarvestDialog] = useState({ open: false, id: null });
  const cycles = res?.data || [];
  const startForm = useForm();
  const harvestForm = useForm();

  return (
    <>
      <PageHeader title="Farm Cycle Management" description="Manage farming cycles" action={<Button size="sm" onClick={() => setStartDialog(true)}><Plus className="h-4 w-4 mr-1" /> Start Cycle</Button>} />

      {isLoading ? <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div> :
       cycles.length === 0 ? <EmptyState icon={RotateCcw} title="No farm cycles" /> :
        <div className="space-y-3">
          {cycles.map(c => (
            <Card key={c.farmCycleId}><CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"><RotateCcw className="h-5 w-5 text-emerald-600" /></div>
                <div>
                  <p className="font-medium">Cycle #{c.farmCycleId}</p>
                  <p className="text-xs text-muted-foreground">Plot #{c.plotId} • Plan #{c.cropPlanId} • {new Date(c.startDate) > new Date() ? 'Starting on' : 'Started'} {formatDate(c.startDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={c.status} />
                {c.status === 'PLANNED' && <Button size="sm" variant="outline" onClick={() => activateFarmCycle(c.farmCycleId)}><Play className="h-3 w-3 mr-1" /> Activate</Button>}
                {c.status === 'ACTIVE' && <Button size="sm" variant="success" onClick={() => setHarvestDialog({ open: true, id: c.farmCycleId })}><CheckCircle2 className="h-3 w-3 mr-1" /> Harvest</Button>}
              </div>
            </CardContent></Card>
          ))}
        </div>}

      <Dialog open={startDialog} onOpenChange={setStartDialog}>
        <DialogContent><DialogHeader><DialogTitle>Start Farm Cycle</DialogTitle></DialogHeader>
          <form onSubmit={startForm.handleSubmit(async d => { const payload = { plotId: d.plotId, farmerId: d.farmerId, farmerEmail: d.farmerEmail, startDate: d.startDate ? d.startDate + 'T00:00:00' : null }; await startFarmCycle(payload); setStartDialog(false); startForm.reset(); })} className="space-y-3">
            <div className="space-y-1"><Label>Plot ID</Label><Input type="number" {...startForm.register('plotId', { valueAsNumber: true, required: 'Plot ID is required' })} /></div>
            <div className="space-y-1"><Label>Farmer ID</Label><Input type="number" {...startForm.register('farmerId', { valueAsNumber: true, required: 'Farmer ID is required' })} /></div>
            <div className="space-y-1"><Label>Farmer Email</Label><Input type="email" {...startForm.register('farmerEmail', { required: 'Farmer email is required' })} /></div>
            <div className="space-y-1"><Label>Start Date</Label><Input type="date" {...startForm.register('startDate', { required: 'Start date is required' })} /></div>
            <DialogFooter><Button variant="outline" type="button" onClick={() => setStartDialog(false)}>Cancel</Button><Button type="submit" disabled={starting}>{starting ? 'Starting...' : 'Start Cycle'}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={harvestDialog.open} onOpenChange={o => setHarvestDialog(p => ({ ...p, open: o }))}>
        <DialogContent><DialogHeader><DialogTitle>Record Harvest</DialogTitle></DialogHeader>
          <form onSubmit={harvestForm.handleSubmit(async d => { await recordHarvest({ farmCycleId: harvestDialog.id, ...d }); setHarvestDialog({ open: false, id: null }); harvestForm.reset(); })} className="space-y-3">
            <div className="space-y-1"><Label>Actual Yield (kg)</Label><Input type="number" step="0.1" {...harvestForm.register('actualYield', { valueAsNumber: true })} /></div>
            <DialogFooter><Button variant="outline" type="button" onClick={() => setHarvestDialog({ open: false, id: null })}>Cancel</Button><Button type="submit" disabled={harvesting}>{harvesting ? 'Recording...' : 'Record Harvest'}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
