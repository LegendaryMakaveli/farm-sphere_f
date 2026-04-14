import { useState } from 'react';
import { useGetOpenAssetsQuery, useBuyFromAssetMutation } from '@/store/api/investmentApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Briefcase, TrendingUp, Calendar, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';

export function OpenAssetsPage() {
  const { data: response, isLoading } = useGetOpenAssetsQuery();
  const [buyFromAsset, { isLoading: buying }] = useBuyFromAssetMutation();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const assets = response?.data || [];

  const { register, handleSubmit, watch, reset } = useForm({ defaultValues: { units: 1 } });
  const units = watch('units') || 0;

  const openInvest = (asset) => { setSelectedAsset(asset); setDialogOpen(true); reset({ units: 1 }); };

  const onInvest = async (data) => {
    try {
      await buyFromAsset({ assetId: selectedAsset.id, units: data.units }).unwrap();
      setDialogOpen(false);
    } catch (err) {}
  };

  return (
    <>
      <PageHeader title="Open Assets" description="Invest in verified farm assets" />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-52 w-full" />)}</div>
      ) : assets.length === 0 ? (
        <EmptyState icon={Briefcase} title="No open assets" description="Check back later for new investment opportunities" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <Card key={asset.id} className="hover:shadow-card-hover transition-all hover:-translate-y-1">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-emerald-600" /></div>
                    <div>
                      <p className="font-semibold">{asset.cropName}</p>
                      <p className="text-xs text-muted-foreground">by {asset.farmerName}</p>
                    </div>
                  </div>
                  <StatusBadge status={asset.status} />
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{asset.unitsSold} / {asset.totalUnits} units sold</span>
                    <span className="font-medium">{Math.round((asset.unitsSold / asset.totalUnits) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-emerald rounded-full transition-all" style={{ width: `${(asset.unitsSold / asset.totalUnits) * 100}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div><p className="text-muted-foreground">Unit Price</p><p className="font-bold text-primary">{formatCurrency(asset.unitPrice)}</p></div>
                  <div><p className="text-muted-foreground">Expected ROI</p><p className="font-bold text-emerald-600">{asset.expectedROI}%</p></div>
                  <div className="flex items-center gap-1 text-muted-foreground"><Calendar className="h-3 w-3" />{formatDate(asset.fundingDeadline)}</div>
                  <div className="flex items-center gap-1 text-muted-foreground"><Users className="h-3 w-3" />{asset.totalUnits - asset.unitsSold} remaining</div>
                </div>

                <Button className="w-full" onClick={() => openInvest(asset)} disabled={asset.status !== 'OPEN'}>
                  Invest Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Invest in {selectedAsset?.cropName}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onInvest)} className="space-y-4">
            <div className="p-3 bg-muted/50 rounded-lg space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Unit Price</span><span className="font-medium">{formatCurrency(selectedAsset?.unitPrice)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Available Units</span><span className="font-medium">{(selectedAsset?.totalUnits || 0) - (selectedAsset?.unitsSold || 0)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Expected ROI</span><span className="font-medium text-emerald-600">{selectedAsset?.expectedROI}%</span></div>
            </div>
            <div className="space-y-2"><Label>Number of Units</Label><Input type="number" min={1} max={(selectedAsset?.totalUnits || 0) - (selectedAsset?.unitsSold || 0)} {...register('units', { valueAsNumber: true })} /></div>
            <div className="p-3 bg-primary/5 rounded-lg">
              <div className="flex justify-between font-bold text-lg"><span>Total Investment</span><span className="text-primary">{formatCurrency(units * (selectedAsset?.unitPrice || 0))}</span></div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={buying}>{buying ? 'Investing...' : 'Confirm Investment'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
