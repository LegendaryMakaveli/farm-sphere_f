import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectSidebarOpen } from '@/store/slices/uiSlice';
import { Sidebar } from '@/components/shared/Sidebar';
import { Topbar } from '@/components/shared/Topbar';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { cn } from '@/lib/utils';

export function MainLayout() {
  const sidebarOpen = useSelector(selectSidebarOpen);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn(
        'flex flex-col min-h-screen transition-all duration-300',
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-[68px]'
      )}>
        <Topbar />
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
