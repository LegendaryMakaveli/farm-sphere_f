import { useState } from 'react';
import { useGetMyPlotQuery } from '@/store/api/estateApi';
import { useGetCropPlanByPlotQuery, useAddIntercropMutation } from '@/store/api/farmingApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { PageSkeleton } from '@/components/shared/LoadingSkeleton';
import { Sprout, Plus, Leaf } from 'lucide-react';
import { useForm } from 'react-hook-form';

export function CropPlanPage() {
  const { data: plotRes } = useGetMyPlotQuery();
  const plotId = plotRes?.data?.plotId;
  const { data: response, isLoading } = useGetCropPlanByPlotQuery(plotId, { skip: !plotId });
  const [addIntercrop, { isLoading: adding }] = useAddIntercropMutation();
  const [dialogOpen, setDialogOpen] = useState(false);

  const cropPlan = response?.data;

  const { register, handleSubmit, reset } = useForm();

  const onAddIntercrop = async (data) => {
    try {
      await addIntercrop({ plotId, ...data }).unwrap();
      setDialogOpen(false);
      reset();
    } catch (err) {}
  };

  if (isLoading) return <PageSkeleton />;
  if (!cropPlan) return <EmptyState icon={Sprout} title="No crop plan" description="Your admin hasn't created a crop plan for your plot yet" />;

  return (
    <>
      <PageHeader
        title="Crop Plan"
        description={`Crop plan for Plot #${plotId}`}
        action={
          <Button onClick={() => setDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" /> Add Intercrop
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-forest-600" />
            Plan #{cropPlan.cropPlanId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cropPlan.items && cropPlan.items.length > 0 ? (
            <div className="space-y-3">
              {cropPlan.items.map((item) => (
                <div key={item.itemId} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                  <div className="flex items-center gap-3">
                    <Leaf className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="font-medium">{item.cropName}</p>
                      <p className="text-xs text-muted-foreground">
                        Expected: {item.expectedYield} {item.yieldUnit?.replace(/_/g, ' ').toLowerCase()} • Actual: {item.actualYield}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={item.role === 'PRIMARY' ? 'default' : 'secondary'}>{item.role}</Badge>
                    {item.spacingPattern && <span className="text-xs text-muted-foreground">{item.spacingPattern}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">No crop items in this plan</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Intercrop</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onAddIntercrop)} className="space-y-4">
            <div className="space-y-2"><Label>Crop ID</Label><Input type="number" {...register('cropId', { valueAsNumber: true })} placeholder="Enter crop ID" /></div>
            <div className="space-y-2"><Label>Expected Yield (kg)</Label><Input type="number" step="0.1" {...register('expectedYield', { valueAsNumber: true })} placeholder="Expected yield" /></div>
            <div className="space-y-2"><Label>Spacing Pattern</Label><Input {...register('spacingPattern')} placeholder="e.g., 1m x 0.5m" /></div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={adding}>{adding ? 'Adding...' : 'Add Intercrop'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
