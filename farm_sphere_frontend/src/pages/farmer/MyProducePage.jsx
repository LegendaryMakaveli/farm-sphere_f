import { useState } from 'react';
import { useGetMyProduceQuery, useListProduceMutation, useDeleteProduceMutation } from '@/store/api/marketplaceApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus, Leaf, Trash2, Package } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const listSchema = z.object({
  cropName: z.string().min(1, 'Required'),
  category: z.string().min(1, 'Required'),
  quantityAvailable: z.coerce.number().positive(),
  unit: z.string().min(1, 'Required'),
  pricePerUnit: z.coerce.number().positive(),
  harvestDate: z.string().min(1, 'Required'),
  expiryDate: z.string().min(1, 'Required'),
  description: z.string().optional(),
});

export function MyProducePage() {
  const { data: response, isLoading } = useGetMyProduceQuery();
  const [listProduce, { isLoading: listing }] = useListProduceMutation();
  const [deleteProduce] = useDeleteProduceMutation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const produce = response?.data || [];

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    resolver: zodResolver(listSchema),
  });

  const onSubmit = async (data) => {
    try {
      await listProduce(data).unwrap();
      setDialogOpen(false);
      reset();
    } catch (err) {}
  };

  const handleDelete = async (produceId) => {
    if (window.confirm('Remove this listing?')) {
      await deleteProduce(produceId);
    }
  };

  return (
    <>
      <PageHeader
        title="My Produce"
        description="Manage your marketplace listings"
        action={<Button onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-2" /> List Produce</Button>}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}</div>
      ) : produce.length === 0 ? (
        <EmptyState icon={Package} title="No produce listed" description="List your first produce on the marketplace" action={() => setDialogOpen(true)} actionLabel="List Produce" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {produce.map((p) => (
            <Card key={p.produceId}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center"><Leaf className="h-5 w-5 text-forest-600" /></div>
                    <div>
                      <p className="font-semibold">{p.cropName}</p>
                      <p className="text-xs text-muted-foreground">{p.category?.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={p.status} />
                    <Button variant="ghost" size="icon-sm" className="text-red-500" onClick={() => handleDelete(p.produceId)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                  <div><p className="text-muted-foreground">Price</p><p className="font-semibold">{formatCurrency(p.pricePerUnit)}/{p.unit}</p></div>
                  <div><p className="text-muted-foreground">Available</p><p className="font-semibold">{p.quantityAvailable} {p.unit}</p></div>
                  <div><p className="text-muted-foreground">Expires</p><p className="font-semibold">{formatDate(p.expiryDate)}</p></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>List New Produce</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <div className="space-y-1"><Label>Crop Name</Label><Input {...register('cropName')} placeholder="e.g. Tomatoes" />{errors.cropName && <p className="text-xs text-destructive">{errors.cropName.message}</p>}</div>
            <div className="space-y-1">
              <Label>Category</Label>
              <Select onValueChange={(v) => setValue('category', v)} value={watch('category')}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {['GRAINS', 'VEGETABLES', 'FRUITS', 'LEGUMES', 'TUBERS', 'CASH_CROPS'].map(c => <SelectItem key={c} value={c}>{c.replace(/_/g, ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Quantity</Label><Input type="number" step="0.1" {...register('quantityAvailable')} /></div>
              <div className="space-y-1"><Label>Unit</Label><Input {...register('unit')} placeholder="kg" /></div>
            </div>
            <div className="space-y-1"><Label>Price per Unit (₦)</Label><Input type="number" step="0.01" {...register('pricePerUnit')} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Harvest Date</Label><Input type="date" {...register('harvestDate')} /></div>
              <div className="space-y-1"><Label>Expiry Date</Label><Input type="date" {...register('expiryDate')} /></div>
            </div>
            <div className="space-y-1"><Label>Description</Label><Textarea {...register('description')} rows={2} /></div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={listing}>{listing ? 'Listing...' : 'List Produce'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
