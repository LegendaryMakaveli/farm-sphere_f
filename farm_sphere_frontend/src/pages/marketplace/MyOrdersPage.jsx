import { useGetMyOrdersQuery, useCancelOrderMutation } from '@/store/api/marketplaceApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { ShoppingBag, Package, Clock } from 'lucide-react';

export function MyOrdersPage() {
  const { data: response, isLoading } = useGetMyOrdersQuery();
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();

  const orders = response?.data || [];

  const handleCancel = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      await cancelOrder({ orderId, reason: 'Cancelled by buyer' });
    }
  };

  return (
    <>
      <PageHeader
        title="My Orders"
        description="Track your marketplace orders"
      />

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="Browse the marketplace and place your first order"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.orderId} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold">Order #{order.orderId}</p>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Package className="h-3.5 w-3.5" />
                        {order.items?.length || 0} item(s)
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDateTime(order.orderDate)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatCurrency(order.totalAmount)}</p>
                    </div>
                    {order.status === 'PENDING' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancel(order.orderId)}
                        disabled={cancelling}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>

                {/* Order items */}
                {order.items && order.items.length > 0 && (
                  <div className="mt-4 pt-4 border-t space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.cropName || 'Produce'} × {item.quantity} {item.unit || 'units'}
                        </span>
                        <span className="font-medium">{formatCurrency(item.subtotal || item.pricePerUnit * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
