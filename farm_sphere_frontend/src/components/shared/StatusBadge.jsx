import { cn, STATUS_COLORS } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function StatusBadge({ status, className }) {
  const colorClass = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';

  return (
    <Badge variant="outline" className={cn('border-0 font-medium', colorClass, className)}>
      {status?.replace(/_/g, ' ')}
    </Badge>
  );
}
