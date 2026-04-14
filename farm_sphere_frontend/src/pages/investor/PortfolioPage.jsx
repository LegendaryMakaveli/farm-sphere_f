import { useState } from 'react';
import { useGetMyPortfolioQuery, useListTokenForSaleMutation } from '@/store/api/investmentApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { KPICard } from '@/components/shared/KPICard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Wallet, Briefcase, TrendingUp, Tag } from 'lucide-react';
import { useForm } from 'react-hook-form';

export function PortfolioPage() {
  const { data: response, isLoading } = useGetMyPortfolioQuery();
  const [listToken, { isLoading: listing }] = useListTokenForSaleMutation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const tokens = response?.data || [];

  const totalInvested = tokens.reduce((sum, t) => sum + (t.totalInvested || 0), 0);
  const totalUnits = tokens.reduce((sum, t) => sum + (t.unitsOwned || 0), 0);

  const { register, handleSubmit, reset } = useForm();

  const openSellDialog = (token) => { setSelectedToken(token); setDialogOpen(true); reset(); };

  const onSell = async (data) => {
    try {
      await listToken({ tokenId: selectedToken.tokenId, ...data }).unwrap();
      setDialogOpen(false);
    } catch (err) {}
  };

  return (
    <>
      <PageHeader title="My Portfolio" description="Track your token holdings" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KPICard title="Total Invested" value={formatCurrency(totalInvested)} icon={Wallet} loading={isLoading} />
        <KPICard title="Total Tokens" value={totalUnits} icon={Briefcase} loading={isLoading} />
        <KPICard title="Assets" value={new Set(tokens.map(t => t.farmAsset?.id)).size} icon={TrendingUp} loading={isLoading} />
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
      ) : tokens.length === 0 ? (
        <EmptyState icon={Wallet} title="No tokens yet" description="Invest in open assets to build your portfolio" />
      ) : (
        <div className="space-y-3">
          {tokens.map((token) => (
            <Card key={token.tokenId}>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center"><Briefcase className="h-5 w-5 text-primary" /></div>
                    <div>
                      <p className="font-semibold">{token.farmAsset?.cropName || 'Farm Asset'}</p>
                      <p className="text-xs text-muted-foreground">
                        {token.unitsOwned} units @ {formatCurrency(token.purchasePricePerUnit)} • Bought {formatDate(token.purchaseDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(token.totalInvested)}</p>
                      {token.roiDistributed && <Badge variant="success" className="text-2xs">ROI Paid</Badge>}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => openSellDialog(token)}>
                      <Tag className="h-3 w-3 mr-1" /> Sell
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>List Token for Sale</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSell)} className="space-y-4">
            <p className="text-sm text-muted-foreground">Selling tokens from: <strong>{selectedToken?.farmAsset?.cropName}</strong></p>
            <div className="space-y-2"><Label>Units to Sell</Label><Input type="number" min={1} max={selectedToken?.unitsOwned} {...register('units', { valueAsNumber: true })} defaultValue={1} /></div>
            <div className="space-y-2"><Label>Price per Unit (₦)</Label><Input type="number" step="0.01" {...register('pricePerUnit', { valueAsNumber: true })} /></div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={listing}>{listing ? 'Listing...' : 'List for Sale'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
