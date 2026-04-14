import { useGetMyPlotQuery } from '@/store/api/estateApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { KPICard } from '@/components/shared/KPICard';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageSkeleton } from '@/components/shared/LoadingSkeleton';
import { Map, Layers, Mountain, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function MyPlotPage() {
  const { data: response, isLoading } = useGetMyPlotQuery();
  const plot = response?.data;

  if (isLoading) return <PageSkeleton />;
  if (!plot) return <EmptyState icon={Map} title="No plot assigned" description="Contact your admin to get a plot assigned to your account" />;

  return (
    <>
      <PageHeader title="My Plot" description="Your assigned farming plot details" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard title="Plot ID" value={`#${plot.plotId}`} icon={Map} subtitle="Your plot identifier" />
        <KPICard title="Plot Size" value={`${plot.plotSize} ha`} icon={Layers} subtitle="Total hectares" />
        <KPICard title="Soil Type" value={plot.soilType} icon={Mountain} subtitle="Soil classification" />
        <KPICard title="Assigned Date" value={formatDate(plot.assignedDate)} icon={Calendar} subtitle="When you joined" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plot Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Status</span><StatusBadge status={plot.status} /></div>
              <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Location</span><span className="font-medium">{plot.location || '—'}</span></div>
              <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Cluster ID</span><span className="font-medium">#{plot.clusterId}</span></div>
              <div className="flex justify-between py-2"><span className="text-muted-foreground">Farmer Email</span><span className="font-medium">{plot.farmerEmail}</span></div>
            </div>
            <div className="h-48 rounded-xl bg-gradient-to-br from-forest-50 to-emerald-50 dark:from-forest-950 dark:to-emerald-950 flex items-center justify-center">
              <Map className="h-16 w-16 text-forest-300 dark:text-forest-700" />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
