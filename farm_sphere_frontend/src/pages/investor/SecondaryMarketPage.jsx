import { useGetOpenListingsQuery, useBuyFromListingMutation, useCancelListingMutation, useGetMyListingsQuery } from '@/store/api/investmentApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { BarChart3, ShoppingCart, Tag, X } from 'lucide-react';

export function SecondaryMarketPage() {
  const { data: listingsRes, isLoading: loadingListings } = useGetOpenListingsQuery();
  const { data: myListingsRes, isLoading: loadingMy } = useGetMyListingsQuery();
  const [buyFromListing, { isLoading: buying }] = useBuyFromListingMutation();
  const [cancelListing, { isLoading: cancelling }] = useCancelListingMutation();

  const listings = listingsRes?.data || [];
  const myListings = myListingsRes?.data || [];

  return (
    <>
      <PageHeader title="Secondary Market" description="Buy and sell tokens from other investors" />

      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse"><ShoppingCart className="h-3.5 w-3.5 mr-1" /> Browse Listings ({listings.length})</TabsTrigger>
          <TabsTrigger value="my"><Tag className="h-3.5 w-3.5 mr-1" /> My Listings ({myListings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          {loadingListings ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-36 w-full" />)}</div>
          ) : listings.length === 0 ? (
            <EmptyState icon={BarChart3} title="No listings" description="The secondary market is empty right now" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <Card key={listing.listingId} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold">{listing.cropName || 'Farm Token'}</p>
                        <p className="text-xs text-muted-foreground">by {listing.sellerName || 'Seller'}</p>
                      </div>
                      <StatusBadge status={listing.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                      <div><p className="text-muted-foreground">Units</p><p className="font-bold">{listing.units}</p></div>
                      <div><p className="text-muted-foreground">Price/Unit</p><p className="font-bold text-primary">{formatCurrency(listing.pricePerUnit)}</p></div>
                    </div>
                    <Button className="w-full" size="sm" onClick={() => buyFromListing(listing.listingId)} disabled={buying}>
                      {buying ? 'Buying...' : `Buy for ${formatCurrency(listing.units * listing.pricePerUnit)}`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my">
          {loadingMy ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
          ) : myListings.length === 0 ? (
            <EmptyState icon={Tag} title="No active listings" description="List tokens from your portfolio to sell on the secondary market" />
          ) : (
            <div className="space-y-3">
              {myListings.map((listing) => (
                <Card key={listing.listingId}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{listing.cropName || 'Token Listing'}</p>
                      <p className="text-xs text-muted-foreground">{listing.units} units @ {formatCurrency(listing.pricePerUnit)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={listing.status} />
                      {listing.status === 'OPEN' && (
                        <Button variant="destructive" size="sm" onClick={() => cancelListing(listing.listingId)} disabled={cancelling}>
                          <X className="h-3 w-3 mr-1" /> Cancel
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
