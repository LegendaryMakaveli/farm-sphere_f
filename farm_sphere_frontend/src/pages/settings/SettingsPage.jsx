import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, selectRoles, selectProfileStatus } from '@/store/slices/authSlice';
import { toggleTheme, selectTheme } from '@/store/slices/uiSlice';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getInitials } from '@/lib/utils';
import { User, Mail, Phone, MapPin, Moon, Sun, Shield } from 'lucide-react';

export function SettingsPage() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const roles = useSelector(selectRoles);
  const profileStatus = useSelector(selectProfileStatus);
  const theme = useSelector(selectTheme);

  return (
    <>
      <PageHeader title="Settings" description="Manage your account and preferences" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 mb-4">
              <AvatarFallback className="text-xl">{getInitials(user?.firstName, user?.secondName)}</AvatarFallback>
            </Avatar>
            <h3 className="text-lg font-semibold">{user?.firstName} {user?.secondName}</h3>
            <p className="text-sm text-muted-foreground mb-3">{user?.email}</p>
            <div className="flex gap-2 flex-wrap justify-center">
              {roles.map(r => <Badge key={r} variant="secondary">{r}</Badge>)}
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { icon: User, label: 'Full Name', value: `${user?.firstName || ''} ${user?.secondName || ''}` },
                { icon: Mail, label: 'Email', value: user?.email },
                { icon: Phone, label: 'Phone', value: user?.phoneNumber || '—' },
                { icon: MapPin, label: 'Address', value: user?.address || '—' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Appearance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Toggle between light and dark theme</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => dispatch(toggleTheme())}>
                  {theme === 'dark' ? <><Sun className="h-4 w-4 mr-2" /> Light Mode</> : <><Moon className="h-4 w-4 mr-2" /> Dark Mode</>}
                </Button>
              </div>
            </CardContent>
          </Card>

          {profileStatus && (
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" /> Account Status</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Farmer Status</span>
                  <Badge variant={profileStatus.farmerStatus === 'APPROVED' ? 'success' : 'secondary'}>{profileStatus.farmerStatus || 'Not Applied'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Investor Status</span>
                  <Badge variant={profileStatus.investorStatus === 'APPROVED' ? 'success' : 'secondary'}>{profileStatus.investorStatus || 'Not Applied'}</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
