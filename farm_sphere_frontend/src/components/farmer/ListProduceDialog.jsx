import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useListProduceMutation } from '@/store/api/marketplaceApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

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

export function ListProduceDialog({ open, onOpenChange }) {
  const [listProduce, { isLoading: listing }] = useListProduceMutation();
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    resolver: zodResolver(listSchema),
  });

  const onSubmit = async (data) => {
    try {
      await listProduce({
        ...data,
        dateCreated: new Date().toISOString().split('T')[0]
      }).unwrap();
      onOpenChange(false);
      reset();
    } catch (err) {}
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>List New Produce</DialogTitle>
          <DialogDescription>
            Enter details of your harvest to list it on the marketplace.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 pt-2">
          <div className="space-y-1">
            <Label>Crop Name</Label>
            <Input {...register('cropName')} placeholder="e.g. Tomatoes" />
            {errors.cropName && <p className="text-xs text-destructive">{errors.cropName.message}</p>}
          </div>
          <div className="space-y-1">
            <Label>Category</Label>
            <Select onValueChange={(v) => setValue('category', v)} value={watch('category')}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {['GRAINS', 'VEGETABLES', 'FRUITS', 'LEGUMES', 'TUBERS', 'CASH_CROPS'].map(c => (
                  <SelectItem key={c} value={c}>{c.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Quantity</Label>
              <Input type="number" step="0.1" {...register('quantityAvailable')} />
            </div>
            <div className="space-y-1">
              <Label>Unit</Label>
              <Input {...register('unit')} placeholder="kg" />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Price per Unit (₦)</Label>
            <Input type="number" step="0.01" {...register('pricePerUnit')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Harvest Date</Label>
              <Input type="date" {...register('harvestDate')} />
            </div>
            <div className="space-y-1">
              <Label>Expiry Date</Label>
              <Input type="date" {...register('expiryDate')} />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea {...register('description')} rows={2} />
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={listing}>{listing ? 'Listing...' : 'List Produce'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
