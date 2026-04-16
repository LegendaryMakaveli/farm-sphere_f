import { useState } from 'react';
import { useGetAllCropsQuery, useCreateCropMutation, useCreateCropPlanMutation, useGetAllCropPlansQuery, useEnableIntercroppingMutation } from '@/store/api/adminApi';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Leaf, Sprout, ClipboardList, MapPin, ToggleRight, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

export function CropManagementPage() {
  const { data: cropsRes, isLoading: loadingCrops } = useGetAllCropsQuery();
  const { data: plansRes, isLoading: loadingPlans } = useGetAllCropPlansQuery();
  const [createCrop, { isLoading: creating }] = useCreateCropMutation();
  const [createCropPlan, { isLoading: creatingPlan }] = useCreateCropPlanMutation();
  const [enableIntercropping, { isLoading: enabling }] = useEnableIntercroppingMutation();
  const [cropDialog, setCropDialog] = useState(false);
  const [planDialog, setPlanDialog] = useState(false);
  const crops = cropsRes?.data || [];
  const plans = plansRes?.data || [];

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

      <Tabs defaultValue="crops" className="space-y-4">
        <TabsList>
          <TabsTrigger value="crops"><Leaf className="h-3.5 w-3.5 mr-1" /> Crops</TabsTrigger>
          <TabsTrigger value="plans"><ClipboardList className="h-3.5 w-3.5 mr-1" /> Crop Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="crops">
          {loadingCrops ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}</div> :
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
        </TabsContent>

        <TabsContent value="plans">
          {loadingPlans ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}</div> :
           plans.length === 0 ? <EmptyState icon={ClipboardList} title="No crop plans" description="Create a plan from a plot to get started" /> :
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map(plan => {
                const primaryItem = plan.items?.find(i => i.role === 'PRIMARY') || plan.items?.[0];
                return (
                <Card key={plan.cropPlanId} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center"><ClipboardList className="h-4 w-4 text-indigo-600" /></div>
                        <div>
                          <p className="font-semibold">Plan #{plan.cropPlanId}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> Plot #{plan.plotId}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{plan.intercroppingEnabled ? 'INTERCROP' : 'SINGLE'}</Badge>
                    </div>
                    <div className="bg-muted/30 p-2 rounded-lg space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Crop:</span>
                        <span className="font-medium text-emerald-600">{primaryItem?.cropName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Expected Yield:</span>
                        <span className="font-medium">{primaryItem?.expectedYield || '—'} {primaryItem?.yieldUnit?.replace(/_/g, ' ') || ''}</span>
                      </div>
                    </div>

                    <Button 
                      variant={plan.intercroppingEnabled ? "ghost" : "soft"} 
                      size="sm" 
                      className={plan.intercroppingEnabled 
                        ? "w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-50 cursor-default opacity-80" 
                        : "w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300"
                      }
                      onClick={() => !plan.intercroppingEnabled && enableIntercropping(plan.plotId)}
                      disabled={enabling || plan.intercroppingEnabled}
                    >
                      {plan.intercroppingEnabled ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Intercrop Enabled
                        </>
                      ) : (
                        <>
                          <ToggleRight className="h-4 w-4 mr-2" />
                          {enabling ? 'Enabling...' : 'Enable Intercropping'}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
                );
              })}
            </div>}
        </TabsContent>
      </Tabs>

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
            <div className="space-y-1">
              <Label>Expected Yield</Label>
              <Input 
                type="number" 
                step="0.1" 
                {...planForm.register('expectedYield', { 
                  required: 'Expected yield is required',
                  min: { value: 0.1, message: 'Expected yield must be greater than 0' },
                  valueAsNumber: true 
                })} 
              />
              {planForm.formState.errors.expectedYield && (
                <p className="text-xs text-destructive">{planForm.formState.errors.expectedYield.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Yield Unit</Label>
              <Select onValueChange={v => {
                planForm.setValue('yieldUnit', v);
                planForm.trigger('yieldUnit');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                  <input type="hidden" {...planForm.register('yieldUnit', { required: 'Yield unit is required' })} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KG_PER_HECTARE">KG Per Hectare</SelectItem>
                  <SelectItem value="TON_PER_HECTARE">TON Per Hectare</SelectItem>
                  <SelectItem value="BAG_PER_ACRE">BAG Per Acre</SelectItem>
                </SelectContent>
              </Select>
              {planForm.formState.errors.yieldUnit && (
                <p className="text-xs text-destructive">{planForm.formState.errors.yieldUnit.message}</p>
              )}
            </div>
            <DialogFooter><Button variant="outline" type="button" onClick={() => setPlanDialog(false)}>Cancel</Button><Button type="submit" disabled={creatingPlan}>{creatingPlan ? 'Creating...' : 'Create Plan'}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
