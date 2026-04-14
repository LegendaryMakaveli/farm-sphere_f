import { useState } from 'react';
import { useGetAllCropsQuery, useCreateCropMutation, useCreateCropPlanMutation } from '@/store/api/adminApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Leaf, Sprout } from 'lucide-react';
import { useForm } from 'react-hook-form';

export function CropManagementPage() {
  const { data: res, isLoading } = useGetAllCropsQuery();
  const [createCrop, { isLoading: creating }] = useCreateCropMutation();
  const [createCropPlan, { isLoading: creatingPlan }] = useCreateCropPlanMutation();
  const [cropDialog, setCropDialog] = useState(false);
  const [planDialog, setPlanDialog] = useState(false);
  const crops = res?.data || [];

  const cropForm = useForm();
  const planForm = useForm();

  return (
    <>
      <PageHeader title="Crop Management" description="Manage crops and crop plans"
        action={<div className="flex gap-2">
          <Button size="sm" onClick={() => setCropDialog(true)}><Plus className="h-4 w-4 mr-1" /> Crop</Button>
          <Button size="sm" variant="outline" onClick={() => setPlanDialog(true)}><Plus className="h-4 w-4 mr-1" /> Crop Plan</Button>
        </div>}
      />

      {isLoading ? <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}</div> :
       crops.length === 0 ? <EmptyState icon={Leaf} title="No crops" description="Add your first crop to get started" /> :
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {crops.map(crop => (
            <Card key={crop.cropId} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center flex-shrink-0"><Leaf className="h-5 w-5 text-forest-600" /></div>
                <div>
                  <p className="font-semibold">{crop.cropName}</p>
                  <Badge variant="secondary" className="mt-1">{crop.category?.replace(/_/g, ' ')}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">{crop.growthDurationDays} days</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>}

      <Dialog open={cropDialog} onOpenChange={setCropDialog}>
        <DialogContent><DialogHeader><DialogTitle>Create Crop</DialogTitle></DialogHeader>
          <form onSubmit={cropForm.handleSubmit(async d => { await createCrop(d); setCropDialog(false); cropForm.reset(); })} className="space-y-3">
            <div className="space-y-1"><Label>Crop Name</Label><Input {...cropForm.register('cropName')} /></div>
            <div className="space-y-1"><Label>Category</Label>
              <Select onValueChange={v => cropForm.setValue('category', v)}>
                <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>{['GRAINS','VEGETABLES','FRUITS','LEGUMES','TUBERS','CASH_CROPS'].map(c => <SelectItem key={c} value={c}>{c.replace(/_/g,' ')}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label>Growth Duration (days)</Label><Input type="number" {...cropForm.register('growthDurationDays', { valueAsNumber: true })} /></div>
            <div className="space-y-1"><Label>Description</Label><Input {...cropForm.register('description')} /></div>
            <DialogFooter><Button variant="outline" type="button" onClick={() => setCropDialog(false)}>Cancel</Button><Button type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create'}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={planDialog} onOpenChange={setPlanDialog}>
        <DialogContent><DialogHeader><DialogTitle>Create Crop Plan</DialogTitle></DialogHeader>
          <form onSubmit={planForm.handleSubmit(async d => { await createCropPlan(d); setPlanDialog(false); planForm.reset(); })} className="space-y-3">
            <div className="space-y-1"><Label>Plot ID</Label><Input type="number" {...planForm.register('plotId', { valueAsNumber: true })} /></div>
            <div className="space-y-1"><Label>Primary Crop ID</Label><Input type="number" {...planForm.register('primaryCropId', { valueAsNumber: true })} /></div>
            <div className="space-y-1"><Label>Expected Yield (kg)</Label><Input type="number" step="0.1" {...planForm.register('expectedYield', { valueAsNumber: true })} /></div>
            <DialogFooter><Button variant="outline" type="button" onClick={() => setPlanDialog(false)}>Cancel</Button><Button type="submit" disabled={creatingPlan}>{creatingPlan ? 'Creating...' : 'Create Plan'}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
