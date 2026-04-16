import { useState } from 'react';
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
  Sun, Moon, LogOut, Leaf, Menu, X,
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

function SidebarContent({ location, navigate, dispatch, onNavClick }) {
  return (
    <>
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
              onClick={onNavClick}
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
          onClick={() => { navigate('/marketplace'); onNavClick?.(); }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to App
        </Button>
      </div>
    </>
  );
}

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col h-screen sticky top-0 bg-sidebar border-r">
        <SidebarContent location={location} navigate={navigate} dispatch={dispatch} onNavClick={() => {}} />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Sidebar panel */}
          <aside
            className="absolute left-0 top-0 h-full w-72 flex flex-col bg-sidebar border-r shadow-2xl animate-slide-in-left"
          >
            <div className="absolute top-3 right-3">
              <Button variant="ghost" size="icon-sm" onClick={() => setMobileOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <SidebarContent location={location} navigate={navigate} dispatch={dispatch} onNavClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Admin topbar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 backdrop-blur-md px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-sm font-semibold text-muted-foreground">Admin Portal</h2>
          </div>
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
