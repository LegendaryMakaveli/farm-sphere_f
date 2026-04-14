import { useGetMyFarmCyclesQuery } from '@/store/api/farmingApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import { RotateCcw, Calendar, Map, Sprout } from 'lucide-react';

export function FarmCyclesPage() {
  const { data: response, isLoading } = useGetMyFarmCyclesQuery();
  const cycles = response?.data || [];

  return (
    <>
      <PageHeader title="Farm Cycles" description="Track your farming cycles" />

      {isLoading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <Card key={i}><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>)}</div>
      ) : cycles.length === 0 ? (
        <EmptyState icon={RotateCcw} title="No farm cycles" description="Your admin will create farm cycles for your assigned plots" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cycles.map((cycle) => (
            <Card key={cycle.farmCycleId} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                      <RotateCcw className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Cycle #{cycle.farmCycleId}</p>
                      <p className="text-xs text-muted-foreground">Plot #{cycle.plotId}</p>
                    </div>
                  </div>
                  <StatusBadge status={cycle.status} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><Sprout className="h-3.5 w-3.5" /> Plan #{cycle.cropPlanId}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> {formatDate(cycle.startDate)}</div>
                  {cycle.endDate && <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> End: {formatDate(cycle.endDate)}</div>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
