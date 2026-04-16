import { useState } from 'react';
import { useGetMyPlotQuery } from '@/store/api/estateApi';
import { useGetCropPlanByPlotQuery, useAddIntercropMutation, useGetAllCropsQuery } from '@/store/api/farmingApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageSkeleton } from '@/components/shared/LoadingSkeleton';
import { Sprout, Plus, Leaf } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';

export function CropPlanPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: plotRes } = useGetMyPlotQuery();
  const plotId = plotRes?.data?.plotId;
  const { data: response, isLoading } = useGetCropPlanByPlotQuery(plotId, { skip: !plotId });
  const { data: cropsRes } = useGetAllCropsQuery();
  const crops = cropsRes?.data || [];

  const [addIntercrop, { isLoading: adding }] = useAddIntercropMutation();

  const { register, handleSubmit, reset, control, setValue } = useForm();

  const cropPlan = response?.data;
  const primaryCropId = cropPlan?.items?.find(item => item.role === 'PRIMARY')?.cropId;
  const filteredCrops = crops.filter(c => c.cropId !== primaryCropId);

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
            <div className="space-y-2">
              <Label>Plot ID</Label>
              <Input readOnly value={plotId || ''} className="bg-muted cursor-not-allowed" />
            </div>

            <div className="space-y-2">
              <Label>Select Intercrop</Label>
              <Controller
                name="intercropCropId"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={(val) => field.onChange(Number(val))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a crop" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCrops.map(c => (
                        <SelectItem key={c.cropId} value={c.cropId.toString()}>
                          {c.cropName} ({c.category?.toLowerCase()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expected Yield</Label>
                <Input type="number" step="0.1" {...register('expectedYield', { valueAsNumber: true, required: true })} placeholder="0.0" />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Controller
                  name="yieldUnit"
                  control={control}
                  defaultValue="KG_PER_HECTARE"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KG_PER_HECTARE">KG/Ha</SelectItem>
                        <SelectItem value="TON_PER_HECTARE">Ton/Ha</SelectItem>
                        <SelectItem value="BAG_PER_ACRE">Bag/Acre</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Spacing Pattern</Label>
              <Controller
                name="spacingPattern"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose spacing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m x 1m">1m x 1m (Standard)</SelectItem>
                      <SelectItem value="2m x 1m">2m x 1m (Wide)</SelectItem>
                      <SelectItem value="2.5m x 0.5m">2.5m x 0.5m (Dense)</SelectItem>
                      <SelectItem value="3m x 0.5m">3m x 0.5m (Intercrop Mix)</SelectItem>
                      <SelectItem value="Square (1.5m)">Square (1.5m)</SelectItem>
                      <SelectItem value="Double Row">Double Row</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

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
