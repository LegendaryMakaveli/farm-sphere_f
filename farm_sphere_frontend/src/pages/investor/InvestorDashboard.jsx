import { useGetMyPortfolioQuery, useGetOpenAssetsQuery, useGetMyListingsQuery } from '@/store/api/investmentApi';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared/PageHeader';
import { KPICard } from '@/components/shared/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Wallet, Briefcase, BarChart3, ArrowRight } from 'lucide-react';

export function InvestorDashboard() {
  const navigate = useNavigate();
  const { data: portfolioRes, isLoading: loadingPortfolio } = useGetMyPortfolioQuery();
  const { data: assetsRes, isLoading: loadingAssets } = useGetOpenAssetsQuery();
  const { data: listingsRes, isLoading: loadingListings } = useGetMyListingsQuery();

  const portfolio = portfolioRes?.data || [];
  const assets = assetsRes?.data || [];
  const listings = listingsRes?.data || [];

  const totalInvested = portfolio.reduce((sum, t) => sum + (t.totalInvested || 0), 0);
  const totalUnits = portfolio.reduce((sum, t) => sum + (t.unitsOwned || 0), 0);

  return (
    <>
      <PageHeader title="Investor Dashboard" description="Your investment overview" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard title="Total Invested" value={formatCurrency(totalInvested)} icon={Wallet} loading={loadingPortfolio} subtitle="across all assets" />
        <KPICard title="Tokens Held" value={totalUnits} icon={Briefcase} loading={loadingPortfolio} subtitle="total units owned" />
        <KPICard title="Open Assets" value={assets.length} icon={TrendingUp} loading={loadingAssets} subtitle="available to invest" />
        <KPICard title="Active Listings" value={listings.length} icon={BarChart3} loading={loadingListings} subtitle="on secondary market" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Investments</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/investor/portfolio')}>View All <ArrowRight className="h-4 w-4 ml-1" /></Button>
          </CardHeader>
          <CardContent>
            {portfolio.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No investments yet</p>
            ) : (
              <div className="space-y-3">
                {portfolio.slice(0, 5).map((token) => (
                  <div key={token.tokenId} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{token.farmAsset?.cropName || 'Asset'}</p>
                      <p className="text-xs text-muted-foreground">{token.unitsOwned} units @ {formatCurrency(token.purchasePricePerUnit)}</p>
                    </div>
                    <p className="font-semibold text-sm">{formatCurrency(token.totalInvested)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Hot Assets</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/investor/assets')}>Browse <ArrowRight className="h-4 w-4 ml-1" /></Button>
          </CardHeader>
          <CardContent>
            {assets.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No open assets</p>
            ) : (
              <div className="space-y-3">
                {assets.slice(0, 5).map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{asset.cropName}</p>
                      <p className="text-xs text-muted-foreground">{asset.unitsSold}/{asset.totalUnits} units sold • {asset.expectedROI}% ROI</p>
                    </div>
                    <StatusBadge status={asset.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
