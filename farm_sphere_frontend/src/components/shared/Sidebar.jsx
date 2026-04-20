import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { cn } from '@/lib/utils';
import { selectRoles, selectProfileStatus, selectCurrentUser } from '@/store/slices/authSlice';
import { selectSidebarOpen, toggleSidebar, selectMobileSidebarOpen, setMobileSidebarOpen } from '@/store/slices/uiSlice';
import { useUpgradeToFarmerMutation, useUpgradeToInvestorMutation, useGetProfileStatusQuery } from '@/store/api/authApi';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Store, LayoutDashboard, Map, Sprout, ListTodo, Wrench,
  TrendingUp, Wallet, BarChart3, Settings, ChevronLeft,
  X, Leaf, ShieldCheck, UserPlus, Briefcase,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const USER_NAV = [
  { label: 'Marketplace', icon: Store, path: '/marketplace' },
  { label: 'My Orders', icon: ListTodo, path: '/orders' },
];

const FARMER_NAV = [
  { label: 'Farm Dashboard', icon: LayoutDashboard, path: '/farmer/dashboard' },
  { label: 'My Plot', icon: Map, path: '/farmer/plot' },
  { label: 'Crop Plan', icon: Sprout, path: '/farmer/crop-plan' },
  { label: 'Farm Cycles', icon: BarChart3, path: '/farmer/farm-cycles' },
  { label: 'Tasks', icon: ListTodo, path: '/farmer/tasks' },
  { label: 'My Produce', icon: Leaf, path: '/farmer/my-produce' },
  { label: 'Tools', icon: Wrench, path: '/farmer/tools' },
];

const INVESTOR_NAV = [
  { label: 'Investor Dashboard', icon: TrendingUp, path: '/investor/dashboard' },
  { label: 'Open Assets', icon: Briefcase, path: '/investor/assets' },
  { label: 'My Portfolio', icon: Wallet, path: '/investor/portfolio' },
  { label: 'Secondary Market', icon: BarChart3, path: '/investor/secondary-market' },
];

export function Sidebar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarOpen = useSelector(selectSidebarOpen);
  const mobileSidebarOpen = useSelector(selectMobileSidebarOpen);
  const roles = useSelector(selectRoles);
  const profileStatus = useSelector(selectProfileStatus);
  const user = useSelector(selectCurrentUser);

  const { data: profileStatusRes } = useGetProfileStatusQuery(undefined, { refetchOnMountOrArgChange: true });
  const liveStatus = profileStatusRes?.data || profileStatus;

  const isFarmer = roles.includes('FARMER');
  const isInvestor = roles.includes('INVESTOR');

  const [farmerDialogOpen, setFarmerDialogOpen] = useState(false);
  const [investorDialogOpen, setInvestorDialogOpen] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState('');

  const [farmerExpired, setFarmerExpired] = useState(false);
  const [investorExpired, setInvestorExpired] = useState(false);

  useEffect(() => {
    const checkExpiration = (status, type, setExpired) => {
      const key = `${type}_reject_${user?.userId}`;
      if (status !== 'REJECTED') {
        localStorage.removeItem(key);
        setExpired(false);
        return;
      }
      
      let rejectedAt = localStorage.getItem(key);
      if (!rejectedAt) {
        rejectedAt = Date.now().toString();
        localStorage.setItem(key, rejectedAt);
      }
      
      const elapsed = Date.now() - parseInt(rejectedAt, 10);
      setExpired(elapsed > 24 * 60 * 60 * 1000); // 24 hours
    };

    checkExpiration(liveStatus?.farmerStatus, 'farmer', setFarmerExpired);
    checkExpiration(liveStatus?.investorStatus, 'investor', setInvestorExpired);
  }, [liveStatus?.farmerStatus, liveStatus?.investorStatus, user?.userId]);

  const [upgradeToFarmer, { isLoading: upgradingFarmer }] = useUpgradeToFarmerMutation();
  const [upgradeToInvestor, { isLoading: upgradingInvestor }] = useUpgradeToInvestorMutation();

  const handleUpgradeFarmer = async () => {
    if (!experienceLevel) return;
    try {
      await upgradeToFarmer({ 
        experienceLevel,
        dateCreated: new Date().toISOString().split('T')[0]
      }).unwrap();
      setFarmerDialogOpen(false);
    } catch (err) { /* toast handled by middleware */ }
  };

  const handleUpgradeInvestor = async () => {
    try {
      await upgradeToInvestor({
        dateCreated: new Date().toISOString().split('T')[0]
      }).unwrap();
      setInvestorDialogOpen(false);
    } catch (err) { /* toast handled by middleware */ }
  };

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
    return (
      <Link
        to={item.path}
        onClick={() => dispatch(setMobileSidebarOpen(false))}
        className={cn(isActive ? 'nav-item-active' : 'nav-item')}
      >
        <item.icon className="h-4.5 w-4.5 flex-shrink-0" />
        {sidebarOpen && <span className="truncate">{item.label}</span>}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-forest text-white font-bold text-sm">
          FS
        </div>
        {sidebarOpen && (
          <span className="font-bold text-lg tracking-tight gradient-text">FarmSphere</span>
        )}
      </div>

      <Separator className="mx-3" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto hide-scrollbar px-3 py-4 space-y-1">
        {/* Everyone sees marketplace */}
        <p className={cn('text-2xs uppercase tracking-wider text-muted-foreground font-semibold mb-2', !sidebarOpen && 'text-center')}>
          {sidebarOpen ? 'Marketplace' : '•'}
        </p>
        {USER_NAV.map((item) => <NavItem key={item.path} item={item} />)}

        {/* Farmer section */}
        {isFarmer && (
          <>
            <Separator className="my-3" />
            <p className={cn('text-2xs uppercase tracking-wider text-muted-foreground font-semibold mb-2', !sidebarOpen && 'text-center')}>
              {sidebarOpen ? 'Farming' : '🌾'}
            </p>
            {FARMER_NAV.map((item) => <NavItem key={item.path} item={item} />)}
          </>
        )}

        {/* Investor section */}
        {isInvestor && (
          <>
            <Separator className="my-3" />
            <p className={cn('text-2xs uppercase tracking-wider text-muted-foreground font-semibold mb-2', !sidebarOpen && 'text-center')}>
              {sidebarOpen ? 'Investments' : '📈'}
            </p>
            {INVESTOR_NAV.map((item) => <NavItem key={item.path} item={item} />)}
          </>
        )}
      </nav>

      {/* Upgrade/Manage buttons */}
      <div className="px-3 pb-3 space-y-2">
        {sidebarOpen && (
          <div>
            {isFarmer ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 border-forest-200 dark:border-forest-800 hover:bg-forest-50 dark:hover:bg-forest-900/30 text-forest-700 dark:text-forest-300"
                onClick={() => {
                  navigate('/farmer/dashboard');
                  dispatch(setMobileSidebarOpen(false));
                }}
              >
                <Sprout className="h-4 w-4" />
                Manage Farmer Profile
              </Button>
            ) : liveStatus?.farmerStatus === 'SUBMITTED' ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <ShieldCheck className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Application pending</span>
              </div>
            ) : liveStatus?.farmerStatus === 'REJECTED' && !farmerExpired ? (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="w-full justify-start gap-2 border-forest-200 dark:border-forest-800 text-forest-700 dark:text-forest-300 opacity-60"
              >
                <Sprout className="h-4 w-4" />
                Rejected (Wait 24h)
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 border-forest-200 dark:border-forest-800 hover:bg-forest-50 dark:hover:bg-forest-900/30 text-forest-700 dark:text-forest-300"
                onClick={() => setFarmerDialogOpen(true)}
              >
                <Sprout className="h-4 w-4" />
                Become a Farmer
              </Button>
            )}
          </div>
        )}

        {sidebarOpen && (
          <div>
            {isInvestor ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                onClick={() => {
                  navigate('/investor/dashboard');
                  dispatch(setMobileSidebarOpen(false));
                }}
              >
                <TrendingUp className="h-4 w-4" />
                Manage Investor Profile
              </Button>
            ) : liveStatus?.investorStatus === 'SUBMITTED' ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <ShieldCheck className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Application pending</span>
              </div>
            ) : liveStatus?.investorStatus === 'REJECTED' && !investorExpired ? (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="w-full justify-start gap-2 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 opacity-60"
              >
                <TrendingUp className="h-4 w-4" />
                Rejected (Wait 24h)
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                onClick={() => setInvestorDialogOpen(true)}
              >
                <TrendingUp className="h-4 w-4" />
                Become an Investor
              </Button>
            )}
          </div>
        )}

        <Separator />
        <NavItem item={{ label: 'Settings', icon: Settings, path: '/settings' }} />
      </div>

      {/* Farmer upgrade dialog */}
      <Dialog open={farmerDialogOpen} onOpenChange={setFarmerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-forest-600" />
              Become a Farmer
            </DialogTitle>
            <DialogDescription>
              Upgrade your account to start farming on FarmSphere. An admin will review your application.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Experience Level</label>
              <Select onValueChange={setExperienceLevel} value={experienceLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your farming experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="EXPERIENCED">Experienced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFarmerDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpgradeFarmer} disabled={!experienceLevel || upgradingFarmer}>
              {upgradingFarmer ? 'Submitting...' : 'Submit Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Investor upgrade dialog */}
      <Dialog open={investorDialogOpen} onOpenChange={setInvestorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Become an Investor
            </DialogTitle>
            <DialogDescription>
              Upgrade your account to start investing in farm assets. An admin will review your application.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              As an investor, you&apos;ll be able to purchase tokens in farm assets, trade on the secondary market, and earn ROI from harvests.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInvestorDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpgradeInvestor} disabled={upgradingInvestor}>
              {upgradingInvestor ? 'Submitting...' : 'Apply to Invest'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col h-screen bg-sidebar border-r border-border transition-all duration-300 fixed left-0 top-0 z-40',
        sidebarOpen ? 'w-64' : 'w-[68px]'
      )}>
        {sidebarContent}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="absolute -right-3 top-8 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-accent transition-colors"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft className={cn('h-3.5 w-3.5 transition-transform', !sidebarOpen && 'rotate-180')} />
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => dispatch(setMobileSidebarOpen(false))} />
          <aside className="fixed left-0 top-0 h-full w-72 bg-sidebar border-r animate-slide-in-left">
            <button
              onClick={() => dispatch(setMobileSidebarOpen(false))}
              className="absolute right-3 top-5 p-1 rounded-md hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
