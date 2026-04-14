import { useParams, useNavigate } from 'react-router-dom';
import { useGetProduceByIdQuery } from '@/store/api/marketplaceApi';
import { usePlaceOrderMutation } from '@/store/api/marketplaceApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PageSkeleton } from '@/components/shared/LoadingSkeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Leaf, MapPin, Calendar, Package, ShoppingCart, ArrowLeft, Clock } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export function ProduceDetailPage() {
  const { produceId } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading } = useGetProduceByIdQuery(produceId);
  const [placeOrder, { isLoading: ordering }] = usePlaceOrderMutation();

  const produce = response?.data;

  const orderSchema = z.object({
    quantity: z.coerce.number().min(1, 'Minimum 1 unit').max(produce?.quantityAvailable || 1, `Max ${produce?.quantityAvailable || 0} available`),
  });

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: { quantity: 1 },
  });

  const quantity = watch('quantity') || 0;
  const total = quantity * (produce?.pricePerUnit || 0);

  const onSubmit = async (data) => {
    try {
      await placeOrder({
        items: [{ produceId: Number(produceId), quantity: data.quantity }],
      }).unwrap();
      navigate('/orders');
    } catch (err) { /* toast middleware */ }
  };

  if (isLoading) return <PageSkeleton />;
  if (!produce) return <div className="text-center py-20 text-muted-foreground">Produce not found</div>;

  return (
    <div className="animate-fade-in">
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="h-72 rounded-xl bg-gradient-to-br from-forest-50 to-emerald-50 dark:from-forest-950 dark:to-emerald-950 flex items-center justify-center relative overflow-hidden">
            <Leaf className="h-20 w-20 text-forest-300 dark:text-forest-700" />
            <Badge className="absolute top-4 left-4" variant="secondary">{produce.category?.replace(/_/g, ' ')}</Badge>
            <StatusBadge status={produce.status} className="absolute top-4 right-4" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">{produce.cropName}</h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-2">
              <MapPin className="h-4 w-4" /> by {produce.farmerName}
            </p>
          </div>

          {produce.description && (
            <Card>
              <CardHeader><CardTitle className="text-base">Description</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{produce.description}</p></CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle className="text-base">Product Details</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2"><Package className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Available:</span><span className="font-medium">{produce.quantityAvailable} {produce.unit}</span></div>
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Harvested:</span><span className="font-medium">{formatDate(produce.harvestDate)}</span></div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Expires:</span><span className="font-medium">{formatDate(produce.expiryDate)}</span></div>
                <div className="flex items-center gap-2"><Leaf className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Category:</span><span className="font-medium">{produce.category?.replace(/_/g, ' ')}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Place Order</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-primary">{formatCurrency(produce.pricePerUnit)}</p>
                  <p className="text-sm text-muted-foreground">per {produce.unit}</p>
                </div>

                <div className="space-y-2">
                  <Label>Quantity ({produce.unit})</Label>
                  <Input type="number" min={1} max={produce.quantityAvailable} {...register('quantity')} />
                  {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
                </div>

                <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t border-border pt-2">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={ordering || produce.status !== 'AVAILABLE'}>
                  {ordering ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Placing Order...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" /> Place Order
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
