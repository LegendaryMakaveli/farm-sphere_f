import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { toggleTheme, selectTheme } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, MapPin, Sprout, RotateCcw,
  ListTodo, ShoppingCart, Wrench, TrendingUp, ArrowLeft,
  Sun, Moon, LogOut, Leaf,
} from 'lucide-react';

const ADMIN_NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'User Approvals', icon: Users, path: '/admin/approvals' },
  { label: 'Estate Management', icon: MapPin, path: '/admin/estates' },
  { label: 'Crop Management', icon: Sprout, path: '/admin/crops' },
  { label: 'Farm Cycles', icon: RotateCcw, path: '/admin/farm-cycles' },
  { label: 'Task Management', icon: ListTodo, path: '/admin/tasks' },
  { label: 'Order Management', icon: ShoppingCart, path: '/admin/orders' },
  { label: 'Tool Management', icon: Wrench, path: '/admin/tools' },
  { label: 'Investments', icon: TrendingUp, path: '/admin/investments' },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Admin sidebar */}
      <aside className="hidden lg:flex w-64 flex-col h-screen sticky top-0 bg-sidebar border-r">
        <div className="flex items-center gap-3 px-4 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-forest text-white">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-sm gradient-text">FarmSphere</p>
            <p className="text-2xs text-muted-foreground font-medium">Admin Portal</p>
          </div>
        </div>

        <Separator className="mx-3" />

        <nav className="flex-1 overflow-y-auto hide-scrollbar px-3 py-4 space-y-1">
          {ADMIN_NAV.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(isActive ? 'nav-item-active' : 'nav-item')}
              >
                <item.icon className="h-4.5 w-4.5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-3 space-y-2">
          <Separator />
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => navigate('/marketplace')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to App
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Admin topbar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 backdrop-blur-md px-6">
          <h2 className="text-sm font-semibold text-muted-foreground">Admin Portal</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-sm" onClick={() => dispatch(toggleTheme())}>
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon-sm" className="text-red-600" onClick={() => { dispatch(logout()); navigate('/login'); }}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="page-container">
            <Breadcrumbs />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
