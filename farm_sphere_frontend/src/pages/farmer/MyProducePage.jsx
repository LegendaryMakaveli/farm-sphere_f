import { useState } from 'react';
import { useGetMyProduceQuery, useDeleteProduceMutation } from '@/store/api/marketplaceApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus, Leaf, Trash2, Package } from 'lucide-react';
import { ListProduceDialog } from '@/components/farmer/ListProduceDialog';

export function MyProducePage() {
  const { data: response, isLoading } = useGetMyProduceQuery();
  const [deleteProduce] = useDeleteProduceMutation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const produce = response?.data || [];

  const handleDelete = async (produceId) => {
    if (window.confirm('Remove this listing?')) {
      await deleteProduce(produceId).unwrap();
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
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDelete(p.produceId)}><Trash2 className="h-4 w-4" /></Button>
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

      <ListProduceDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}

