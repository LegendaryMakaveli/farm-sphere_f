import { cn } from '@/lib/utils';
import { PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyState({ icon: Icon = PackageOpen, title = 'No data yet', description = 'There is nothing to display here.', action, actionLabel, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      {action && (
        <Button onClick={action} size="sm">
          {actionLabel || 'Get Started'}
        </Button>
      )}
    </div>
  );
}
