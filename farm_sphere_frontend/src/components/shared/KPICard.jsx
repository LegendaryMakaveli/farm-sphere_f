import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export function KPICard({ title, value, subtitle, icon: Icon, trend, trendValue, className, loading }) {
  if (loading) {
    return (
      <div className={cn('glass-card-hover p-5', className)}>
        <div className="flex items-start justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
        <Skeleton className="h-8 w-32 mt-3" />
        <Skeleton className="h-3 w-20 mt-2" />
      </div>
    );
  }

  return (
    <div className={cn('glass-card-hover p-5 group', className)}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/15 text-primary transition-transform group-hover:scale-110">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold tracking-tight animate-count-up">{value}</p>
        <div className="flex items-center gap-2 mt-1">
          {trend && (
            <span className={cn(
              'text-xs font-semibold px-1.5 py-0.5 rounded',
              trend === 'up' ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' :
              trend === 'down' ? 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30' :
              'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800'
            )}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </span>
          )}
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
