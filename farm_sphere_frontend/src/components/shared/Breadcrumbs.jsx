import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const ROUTE_LABELS = {
  marketplace: 'Marketplace',
  produce: 'Produce',
  orders: 'My Orders',
  farmer: 'Farmer',
  dashboard: 'Dashboard',
  plot: 'My Plot',
  'crop-plan': 'Crop Plan',
  'farm-cycles': 'Farm Cycles',
  tasks: 'Tasks',
  'my-produce': 'My Produce',
  tools: 'Tools',
  investor: 'Investor',
  assets: 'Open Assets',
  portfolio: 'Portfolio',
  'secondary-market': 'Secondary Market',
  admin: 'Admin',
  approvals: 'Approvals',
  estates: 'Estates',
  crops: 'Crops',
  'farm-cycles-mgmt': 'Farm Cycles',
  'tasks-mgmt': 'Tasks',
  'orders-mgmt': 'Orders',
  'tools-mgmt': 'Tools',
  settings: 'Settings',
};

export function Breadcrumbs({ className }) {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-sm mb-4', className)}>
      <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      {segments.map((segment, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;
        const label = ROUTE_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

        return (
          <span key={path} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link to={path} className="text-muted-foreground hover:text-foreground transition-colors">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
