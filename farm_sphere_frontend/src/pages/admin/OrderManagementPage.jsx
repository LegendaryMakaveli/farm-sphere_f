import { useGetAllOrdersQuery, useMatchOrderMutation, useConfirmSaleMutation } from '@/store/api/adminApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { ShoppingCart, CheckCircle2, Truck } from 'lucide-react';

export function OrderManagementPage() {
  const { data: res, isLoading } = useGetAllOrdersQuery();
  const [matchOrder] = useMatchOrderMutation();
  const [confirmSale] = useConfirmSaleMutation();
  const orders = res?.data || [];

  const pending = orders.filter(o => o.status === 'PENDING');
  const matched = orders.filter(o => o.status === 'MATCHED');
  const confirmed = orders.filter(o => o.status === 'CONFIRMED');
  const cancelled = orders.filter(o => o.status === 'CANCELLED');

  const OrderList = ({ items, showMatch, showConfirm }) => items.length === 0 ?
    <EmptyState icon={ShoppingCart} title="No orders" /> :
    <div className="space-y-3">{items.map(o => (
      <Card key={o.orderId}><CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1"><p className="font-medium">Order #{o.orderId}</p><StatusBadge status={o.status} /></div>
          <p className="text-xs text-muted-foreground">{o.buyerName} ({o.buyerEmail}) • {formatDateTime(o.orderDate)}</p>
          <p className="text-sm font-semibold mt-1">{formatCurrency(o.totalAmount)}</p>
        </div>
        <div className="flex gap-2">
          {showMatch && <Button size="sm" variant="outline" onClick={() => matchOrder(o.orderId)}><Truck className="h-3 w-3 mr-1" /> Match</Button>}
          {showConfirm && <Button size="sm" variant="success" onClick={() => confirmSale({ orderId: o.orderId })}><CheckCircle2 className="h-3 w-3 mr-1" /> Confirm Sale</Button>}
        </div>
      </CardContent></Card>
    ))}</div>;

  return (
    <>
      <PageHeader title="Order Management" description="Process marketplace orders" />
      {isLoading ? <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div> :
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
            <TabsTrigger value="matched">Matched ({matched.length})</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed ({confirmed.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({cancelled.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="pending"><OrderList items={pending} showMatch /></TabsContent>
          <TabsContent value="matched"><OrderList items={matched} showConfirm /></TabsContent>
          <TabsContent value="confirmed"><OrderList items={confirmed} /></TabsContent>
          <TabsContent value="cancelled"><OrderList items={cancelled} /></TabsContent>
        </Tabs>}
    </>
  );
}
