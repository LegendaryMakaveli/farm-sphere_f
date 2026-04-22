import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

// Layouts
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AdminLayout } from '@/layouts/AdminLayout';

// Guards
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

// Marketplace Pages
import { MarketplacePage } from '@/pages/marketplace/MarketplacePage';
import { ProduceDetailPage } from '@/pages/marketplace/ProduceDetailPage';
import { MyOrdersPage } from '@/pages/marketplace/MyOrdersPage';

// Farmer Pages
import { FarmerDashboard } from '@/pages/farmer/FarmerDashboard';
import { MyPlotPage } from '@/pages/farmer/MyPlotPage';
import { CropPlanPage } from '@/pages/farmer/CropPlanPage';
import { FarmCyclesPage } from '@/pages/farmer/FarmCyclesPage';
import { TasksPage } from '@/pages/farmer/TasksPage';
import { MyProducePage } from '@/pages/farmer/MyProducePage';
import { ToolsPage } from '@/pages/farmer/ToolsPage';

// Investor Pages
import { InvestorDashboard } from '@/pages/investor/InvestorDashboard';
import { OpenAssetsPage } from '@/pages/investor/OpenAssetsPage';
import { PortfolioPage } from '@/pages/investor/PortfolioPage';
import { SecondaryMarketPage } from '@/pages/investor/SecondaryMarketPage';

// Admin Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { UserApprovalPage } from '@/pages/admin/UserApprovalPage';
import { UserDirectoryPage } from '@/pages/admin/UserDirectoryPage';
import { EstateManagementPage } from '@/pages/admin/EstateManagementPage';
import { CropManagementPage } from '@/pages/admin/CropManagementPage';
import { FarmCycleManagementPage } from '@/pages/admin/FarmCycleManagementPage';
import { TaskManagementPage } from '@/pages/admin/TaskManagementPage';
import { OrderManagementPage } from '@/pages/admin/OrderManagementPage';
import { ToolManagementPage } from '@/pages/admin/ToolManagementPage';
import { InvestmentManagementPage } from '@/pages/admin/InvestmentManagementPage';

// Settings
import { SettingsPage } from '@/pages/settings/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Main app routes - all protected */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            {/* Default redirect to login page */}
            <Route index element={<Navigate to="/login" replace />} />

            {/* Marketplace (all authenticated users) */}
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/marketplace/:produceId" element={<ProduceDetailPage />} />
            <Route path="/orders" element={<MyOrdersPage />} />

            {/* Farmer routes */}
            <Route path="/farmer/dashboard" element={<ProtectedRoute requiredRole="FARMER"><FarmerDashboard /></ProtectedRoute>} />
            <Route path="/farmer/plot" element={<ProtectedRoute requiredRole="FARMER"><MyPlotPage /></ProtectedRoute>} />
            <Route path="/farmer/crop-plan" element={<ProtectedRoute requiredRole="FARMER"><CropPlanPage /></ProtectedRoute>} />
            <Route path="/farmer/farm-cycles" element={<ProtectedRoute requiredRole="FARMER"><FarmCyclesPage /></ProtectedRoute>} />
            <Route path="/farmer/tasks" element={<ProtectedRoute requiredRole="FARMER"><TasksPage /></ProtectedRoute>} />
            <Route path="/farmer/my-produce" element={<ProtectedRoute requiredRole="FARMER"><MyProducePage /></ProtectedRoute>} />
            <Route path="/farmer/tools" element={<ProtectedRoute requiredRole="FARMER"><ToolsPage /></ProtectedRoute>} />

            {/* Investor routes */}
            <Route path="/investor/dashboard" element={<ProtectedRoute requiredRole="INVESTOR"><InvestorDashboard /></ProtectedRoute>} />
            <Route path="/investor/assets" element={<ProtectedRoute requiredRole="INVESTOR"><OpenAssetsPage /></ProtectedRoute>} />
            <Route path="/investor/portfolio" element={<ProtectedRoute requiredRole="INVESTOR"><PortfolioPage /></ProtectedRoute>} />
            <Route path="/investor/secondary-market" element={<ProtectedRoute requiredRole="INVESTOR"><SecondaryMarketPage /></ProtectedRoute>} />

            {/* Settings */}
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute requiredRole="ADMIN"><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserDirectoryPage />} />
            <Route path="/admin/approvals" element={<UserApprovalPage />} />
            <Route path="/admin/estates" element={<EstateManagementPage />} />
            <Route path="/admin/crops" element={<CropManagementPage />} />
            <Route path="/admin/farm-cycles" element={<FarmCycleManagementPage />} />
            <Route path="/admin/tasks" element={<TaskManagementPage />} />
            <Route path="/admin/orders" element={<OrderManagementPage />} />
            <Route path="/admin/tools" element={<ToolManagementPage />} />
            <Route path="/admin/investments" element={<InvestmentManagementPage />} />
          </Route>

          {/* Catch-all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
