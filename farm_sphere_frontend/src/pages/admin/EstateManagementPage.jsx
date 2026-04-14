import { useState } from 'react';
import { useGetAllEstatesQuery, useCreateEstateMutation, useGetClustersByEstateQuery, useCreateClusterMutation, useGetAllPlotsQuery, useCreatePlotMutation, useAssignPlotMutation, useUnassignPlotMutation } from '@/store/api/adminApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, MapPin, Layers, Map } from 'lucide-react';
import { useForm } from 'react-hook-form';

export function EstateManagementPage() {
  const { data: estatesRes, isLoading: le } = useGetAllEstatesQuery();
  const { data: plotsRes, isLoading: lp } = useGetAllPlotsQuery();
  const [createEstate, { isLoading: ce }] = useCreateEstateMutation();
  const [createCluster, { isLoading: cc }] = useCreateClusterMutation();
  const [createPlot, { isLoading: cp }] = useCreatePlotMutation();
  const [assignPlot] = useAssignPlotMutation();
  const [unassignPlot] = useUnassignPlotMutation();

  const estates = estatesRes?.data || [];
  const plots = plotsRes?.data || [];

  const [estateDialog, setEstateDialog] = useState(false);
  const [clusterDialog, setClusterDialog] = useState(false);
  const [plotDialog, setPlotDialog] = useState(false);
  const [assignDialog, setAssignDialog] = useState({ open: false, plotId: null });

  const estateForm = useForm();
  const clusterForm = useForm();
  const plotForm = useForm();
  const assignForm = useForm();

  return (
    <>
      <PageHeader title="Estate Management" description="Manage estates, clusters, and plots" />

      <Tabs defaultValue="estates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="estates"><MapPin className="h-3.5 w-3.5 mr-1" /> Estates</TabsTrigger>
          <TabsTrigger value="plots"><Map className="h-3.5 w-3.5 mr-1" /> Plots</TabsTrigger>
        </TabsList>

        <TabsContent value="estates">
          <div className="flex justify-end mb-4 gap-2">
            <Button size="sm" onClick={() => setEstateDialog(true)}><Plus className="h-4 w-4 mr-1" /> Estate</Button>
            <Button size="sm" variant="outline" onClick={() => setClusterDialog(true)}><Plus className="h-4 w-4 mr-1" /> Cluster</Button>
          </div>
          {le ? <Skeleton className="h-40 w-full" /> : estates.length === 0 ? <EmptyState icon={MapPin} title="No estates" /> :
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {estates.map(e => (
                <Card key={e.id}><CardContent className="p-5">
                  <h3 className="font-semibold text-lg mb-1">{e.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{e.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Location:</span> {e.location}</div>
                    <div><span className="text-muted-foreground">Size:</span> {e.totalSize} ha</div>
                  </div>
                </CardContent></Card>
              ))}
            </div>}
        </TabsContent>

        <TabsContent value="plots">
          <div className="flex justify-end mb-4">
            <Button size="sm" onClick={() => setPlotDialog(true)}><Plus className="h-4 w-4 mr-1" /> Create Plot</Button>
          </div>
          {lp ? <Skeleton className="h-40 w-full" /> : plots.length === 0 ? <EmptyState icon={Map} title="No plots" /> :
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plots.map(p => (
                <Card key={p.plotId}><CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2"><p className="font-medium">Plot #{p.plotId}</p><StatusBadge status={p.status} /></div>
                  <div className="text-sm space-y-1">
                    <p className="text-muted-foreground">Size: {p.plotSize} ha • Soil: {p.soilType}</p>
                    {p.farmerEmail && <p className="text-muted-foreground">Farmer: {p.farmerEmail}</p>}
                  </div>
                  <div className="mt-3 flex gap-2">
                    {p.status === 'AVAILABLE' && <Button size="sm" variant="outline" onClick={() => setAssignDialog({ open: true, plotId: p.plotId })}>Assign</Button>}
                    {p.status === 'ASSIGNED' && <Button size="sm" variant="destructive" onClick={() => unassignPlot(p.plotId)}>Unassign</Button>}
                  </div>
                </CardContent></Card>
              ))}
            </div>}
        </TabsContent>
      </Tabs>

      {/* Create Estate Dialog */}
      <Dialog open={estateDialog} onOpenChange={setEstateDialog}>
        <DialogContent><DialogHeader><DialogTitle>Create Estate</DialogTitle></DialogHeader>
          <form onSubmit={estateForm.handleSubmit(async d => { await createEstate(d); setEstateDialog(false); estateForm.reset(); })} className="space-y-3">
            <div className="space-y-1"><Label>Name</Label><Input {...estateForm.register('name')} /></div>
            <div className="space-y-1"><Label>Location</Label><Input {...estateForm.register('location')} /></div>
            <div className="space-y-1"><Label>Total Size (ha)</Label><Input type="number" step="0.1" {...estateForm.register('totalSize', { valueAsNumber: true })} /></div>
            <div className="space-y-1"><Label>Description</Label><Input {...estateForm.register('description')} /></div>
            <DialogFooter><Button variant="outline" type="button" onClick={() => setEstateDialog(false)}>Cancel</Button><Button type="submit" disabled={ce}>{ce ? 'Creating...' : 'Create'}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Cluster Dialog */}
      <Dialog open={clusterDialog} onOpenChange={setClusterDialog}>
        <DialogContent><DialogHeader><DialogTitle>Create Cluster</DialogTitle></DialogHeader>
          <form onSubmit={clusterForm.handleSubmit(async d => { await createCluster(d); setClusterDialog(false); clusterForm.reset(); })} className="space-y-3">
            <div className="space-y-1"><Label>Estate ID</Label><Input type="number" {...clusterForm.register('estateId', { valueAsNumber: true })} /></div>
            <div className="space-y-1"><Label>Cluster Name</Label><Input {...clusterForm.register('clusterName')} /></div>
            <div className="space-y-1"><Label>Primary Crop ID</Label><Input type="number" {...clusterForm.register('primaryCropId', { valueAsNumber: true })} /></div>
            <div className="space-y-1"><Label>Farming Model</Label>
              <Select onValueChange={v => clusterForm.setValue('farmingModel', v)}>
                <SelectTrigger><SelectValue placeholder="Select model" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEMONSTRATION_MODEL">Demonstration</SelectItem>
                  <SelectItem value="COOPERATIVE_MODEL">Cooperative</SelectItem>
                  <SelectItem value="CLUSTER_BASE_MODEL">Cluster Base</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter><Button variant="outline" type="button" onClick={() => setClusterDialog(false)}>Cancel</Button><Button type="submit" disabled={cc}>{cc ? 'Creating...' : 'Create'}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Plot Dialog */}
      <Dialog open={plotDialog} onOpenChange={setPlotDialog}>
        <DialogContent><DialogHeader><DialogTitle>Create Plot</DialogTitle></DialogHeader>
          <form onSubmit={plotForm.handleSubmit(async d => { await createPlot(d); setPlotDialog(false); plotForm.reset(); })} className="space-y-3">
            <div className="space-y-1"><Label>Cluster ID</Label><Input type="number" {...plotForm.register('clusterId', { valueAsNumber: true })} /></div>
            <div className="space-y-1"><Label>Plot Size (ha)</Label><Input type="number" step="0.1" {...plotForm.register('plotSize', { valueAsNumber: true })} /></div>
            <div className="space-y-1"><Label>Soil Type</Label><Input {...plotForm.register('soilType')} /></div>
            <div className="space-y-1"><Label>Location</Label><Input {...plotForm.register('location')} /></div>
            <DialogFooter><Button variant="outline" type="button" onClick={() => setPlotDialog(false)}>Cancel</Button><Button type="submit" disabled={cp}>{cp ? 'Creating...' : 'Create'}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Assign Plot Dialog */}
      <Dialog open={assignDialog.open} onOpenChange={(o) => setAssignDialog(prev => ({ ...prev, open: o }))}>
        <DialogContent><DialogHeader><DialogTitle>Assign Plot #{assignDialog.plotId}</DialogTitle></DialogHeader>
          <form onSubmit={assignForm.handleSubmit(async d => { await assignPlot({ plotId: assignDialog.plotId, ...d }); setAssignDialog({ open: false, plotId: null }); assignForm.reset(); })} className="space-y-3">
            <div className="space-y-1"><Label>Farmer ID</Label><Input type="number" {...assignForm.register('farmerId', { valueAsNumber: true })} /></div>
            <DialogFooter><Button variant="outline" type="button" onClick={() => setAssignDialog({ open: false, plotId: null })}>Cancel</Button><Button type="submit">Assign</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
