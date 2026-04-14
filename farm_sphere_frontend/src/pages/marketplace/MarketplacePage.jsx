import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAvailableProduceQuery } from '@/store/api/marketplaceApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { Search, Filter, Leaf, ShoppingCart, MapPin, Calendar, Package } from 'lucide-react';

const CATEGORIES = ['ALL', 'GRAINS', 'VEGETABLES', 'FRUITS', 'LEGUMES', 'TUBERS', 'CASH_CROPS'];

export function MarketplacePage() {
  const { data: response, isLoading, error } = useGetAvailableProduceQuery();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const produce = response?.data || [];

  const filtered = produce.filter((p) => {
    const matchSearch = p.cropName?.toLowerCase().includes(search.toLowerCase()) ||
                         p.farmerName?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <>
      <PageHeader
        title="Marketplace"
        description="Browse fresh produce from verified FarmSphere farmers"
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search produce or farmer..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="whitespace-nowrap"
            >
              {cat === 'ALL' ? 'All' : cat.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
            </Button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {!isLoading && (
        <p className="text-sm text-muted-foreground mb-4">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> produce items
        </p>
      )}

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full rounded-none" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No produce found"
          description="Try adjusting your search or filter criteria"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <Link key={item.produceId} to={`/marketplace/${item.produceId}`}>
              <Card className="overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 border-transparent hover:border-primary/20">
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-forest-50 to-emerald-50 dark:from-forest-950 dark:to-emerald-950 flex items-center justify-center relative overflow-hidden">
                  <Leaf className="h-12 w-12 text-forest-300 dark:text-forest-700 group-hover:scale-110 transition-transform" />
                  <Badge className="absolute top-3 left-3" variant="secondary">
                    {item.category?.replace(/_/g, ' ')}
                  </Badge>
                  <StatusBadge status={item.status} className="absolute top-3 right-3" />
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                    {item.cropName}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                    <MapPin className="h-3 w-3" />
                    by {item.farmerName}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-primary">
                        {formatCurrency(item.pricePerUnit)}
                      </p>
                      <p className="text-xs text-muted-foreground">per {item.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{item.quantityAvailable} {item.unit}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.harvestDate)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
