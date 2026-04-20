import { useState } from 'react';
import { useGetPendingFarmersQuery, useGetPendingInvestorsQuery, useApproveFarmerMutation, useRejectFarmerMutation, useApproveInvestorMutation, useRejectInvestorMutation } from '@/store/api/adminApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Users, CheckCircle2, XCircle, Sprout, TrendingUp } from 'lucide-react';

export function UserApprovalPage() {
  const { data: farmersRes, isLoading: lf } = useGetPendingFarmersQuery();
  const { data: investorsRes, isLoading: li } = useGetPendingInvestorsQuery();
  const [approveFarmer] = useApproveFarmerMutation();
  const [rejectFarmer] = useRejectFarmerMutation();
  const [approveInvestor] = useApproveInvestorMutation();
  const [rejectInvestor] = useRejectInvestorMutation();

  const [rejectDialog, setRejectDialog] = useState({ open: false, type: null, id: null });
  const [reason, setReason] = useState('');

  const farmers = farmersRes?.data || [];
  const investors = investorsRes?.data || [];

  const handleReject = async () => {
    if (rejectDialog.type === 'farmer') {
      await rejectFarmer({ farmerId: rejectDialog.id, reason });
    } else {
      await rejectInvestor({ investorId: rejectDialog.id, reason });
    }
    setRejectDialog({ open: false, type: null, id: null });
    setReason('');
  };

  const UserCard = ({ user, type }) => (
    <Card>
      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${type === 'farmer' ? 'bg-forest-100 dark:bg-forest-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
            {type === 'farmer' ? <Sprout className="h-5 w-5 text-forest-600" /> : <TrendingUp className="h-5 w-5 text-emerald-600" />}
          </div>
          <div>
            <p className="font-medium">{user.firstName} {user.secondName || user.lastName}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            {user.experienceLevel && <Badge variant="secondary" className="mt-1 text-2xs">{user.experienceLevel}</Badge>}
            <p className="text-[10px] text-muted-foreground mt-1">Joined: {user.dateCreated ? new Date(user.dateCreated).toLocaleDateString() : 'New'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="success" onClick={() => type === 'farmer' ? approveFarmer(user.userId || user.id) : approveInvestor(user.userId || user.id)}>
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
          </Button>
          <Button size="sm" variant="destructive" onClick={() => setRejectDialog({ open: true, type, id: user.userId || user.id })}>
            <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <PageHeader title="User Approvals" description="Review and approve farmer & investor applications" />

      <Tabs defaultValue="farmers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="farmers"><Sprout className="h-3.5 w-3.5 mr-1" /> Farmers ({farmers.length})</TabsTrigger>
          <TabsTrigger value="investors"><TrendingUp className="h-3.5 w-3.5 mr-1" /> Investors ({investors.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="farmers">
          {lf ? <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div> :
           farmers.length === 0 ? <EmptyState icon={UserPlus} title="No pending farmers" description="All farmer applications have been reviewed" /> :
           <div className="space-y-3">{farmers.map((f) => <UserCard key={f.userId || f.id} user={f} type="farmer" />)}</div>}
        </TabsContent>

        <TabsContent value="investors">
          {li ? <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div> :
           investors.length === 0 ? <EmptyState icon={Users} title="No pending investors" description="All investor applications have been reviewed" /> :
           <div className="space-y-3">{investors.map((inv) => <UserCard key={inv.userId || inv.id} user={inv} type="investor" />)}</div>}
        </TabsContent>
      </Tabs>

      <Dialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog(prev => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject Application</DialogTitle></DialogHeader>
          <div className="space-y-3"><p className="text-sm text-muted-foreground">Provide a reason for rejection:</p><Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for rejection" /></div>
          <DialogFooter><Button variant="outline" onClick={() => setRejectDialog({ open: false, type: null, id: null })}>Cancel</Button><Button variant="destructive" onClick={handleReject} disabled={!reason}>Reject</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
