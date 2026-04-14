import { useState } from 'react';
import { useGetAllToolsQuery, useCreateToolMutation, useUpdateToolMutation, useAddStockMutation, useGetAllBookingsQuery, useApproveBookingMutation, useRejectBookingMutation, usePickupToolMutation, useReturnToolMutation } from '@/store/api/adminApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Wrench, Calendar, CheckCircle2, XCircle, Package, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';

export function ToolManagementPage() {
  const { data: toolsRes, isLoading: lt } = useGetAllToolsQuery();
  const { data: bookingsRes, isLoading: lb } = useGetAllBookingsQuery();
  const [createTool, { isLoading: creating }] = useCreateToolMutation();
  const [addStock] = useAddStockMutation();
  const [approveBooking] = useApproveBookingMutation();
  const [rejectBooking] = useRejectBookingMutation();
  const [pickupTool] = usePickupToolMutation();
  const [returnTool] = useReturnToolMutation();

  const tools = toolsRes?.data || [];
  const bookings = bookingsRes?.data || [];
  const [toolDialog, setToolDialog] = useState(false);
  const [stockDialog, setStockDialog] = useState({ open: false, toolId: null });
  const [rejectDialog, setRejectDialog] = useState({ open: false, bookingId: null });
  const [reason, setReason] = useState('');
  const toolForm = useForm();
  const stockForm = useForm();

  return (
    <>
      <PageHeader title="Tool Management" description="Manage farming tools and bookings" />

      <Tabs defaultValue="tools" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tools"><Wrench className="h-3.5 w-3.5 mr-1" /> Tools</TabsTrigger>
          <TabsTrigger value="bookings"><Calendar className="h-3.5 w-3.5 mr-1" /> Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="tools">
          <div className="flex justify-end mb-4"><Button size="sm" onClick={() => setToolDialog(true)}><Plus className="h-4 w-4 mr-1" /> Create Tool</Button></div>
          {lt ? <Skeleton className="h-40 w-full" /> : tools.length === 0 ? <EmptyState icon={Wrench} title="No tools" /> :
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map(t => (
                <Card key={t.toolId}><CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"><Wrench className="h-5 w-5 text-amber-600" /></div>
                    <div><p className="font-semibold">{t.toolName}</p><p className="text-xs text-muted-foreground">{t.conditionStatus}</p></div>
                  </div>
                  <p className="text-sm mb-2">{t.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-1"><Package className="h-3.5 w-3.5" /> {t.quantityAvailable} available</span>
                    <Button size="sm" variant="outline" onClick={() => setStockDialog({ open: true, toolId: t.toolId })}>Add Stock</Button>
                  </div>
                </CardContent></Card>
              ))}
            </div>}
        </TabsContent>

        <TabsContent value="bookings">
          {lb ? <Skeleton className="h-40 w-full" /> : bookings.length === 0 ? <EmptyState icon={Calendar} title="No bookings" /> :
            <div className="space-y-3">{bookings.map(b => (
              <Card key={b.bookingId}><CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{b.toolName || `Tool #${b.toolId}`} — Booking #{b.bookingId}</p>
                  <p className="text-xs text-muted-foreground">Farmer: {b.farmerEmail} • Qty: {b.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={b.status} />
                  {b.status === 'PENDING' && <>
                    <Button size="sm" variant="success" onClick={() => approveBooking(b.bookingId)}><CheckCircle2 className="h-3 w-3" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => setRejectDialog({ open: true, bookingId: b.bookingId })}><XCircle className="h-3 w-3" /></Button>
                  </>}
                  {b.status === 'APPROVED' && <Button size="sm" variant="outline" onClick={() => pickupTool(b.bookingId)}>Pickup</Button>}
                  {b.status === 'IN_USE' && <Button size="sm" variant="outline" onClick={() => returnTool(b.bookingId)}><ArrowLeft className="h-3 w-3 mr-1" /> Return</Button>}
                </div>
              </CardContent></Card>
            ))}</div>}
        </TabsContent>
      </Tabs>

      <Dialog open={toolDialog} onOpenChange={setToolDialog}>
        <DialogContent><DialogHeader><DialogTitle>Create Tool</DialogTitle></DialogHeader>
          <form onSubmit={toolForm.handleSubmit(async d => { await createTool(d); setToolDialog(false); toolForm.reset(); })} className="space-y-3">
            <div className="space-y-1"><Label>Tool Name</Label><Input {...toolForm.register('toolName')} /></div>
            <div className="space-y-1"><Label>Description</Label><Input {...toolForm.register('description')} /></div>
            <div className="space-y-1"><Label>Quantity</Label><Input type="number" {...toolForm.register('quantityAvailable', { valueAsNumber: true })} /></div>
            <div className="space-y-1"><Label>Condition</Label><Input {...toolForm.register('conditionStatus')} placeholder="Good" /></div>
            <DialogFooter><Button variant="outline" type="button" onClick={() => setToolDialog(false)}>Cancel</Button><Button type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create'}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={stockDialog.open} onOpenChange={o => setStockDialog(p => ({ ...p, open: o }))}>
        <DialogContent><DialogHeader><DialogTitle>Add Stock</DialogTitle></DialogHeader>
          <form onSubmit={stockForm.handleSubmit(async d => { await addStock({ toolId: stockDialog.toolId, ...d }); setStockDialog({ open: false, toolId: null }); stockForm.reset(); })} className="space-y-3">
            <div className="space-y-1"><Label>Additional Quantity</Label><Input type="number" {...stockForm.register('quantity', { valueAsNumber: true })} /></div>
            <DialogFooter><Button variant="outline" type="button" onClick={() => setStockDialog({ open: false, toolId: null })}>Cancel</Button><Button type="submit">Add</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialog.open} onOpenChange={o => setRejectDialog(p => ({ ...p, open: o }))}>
        <DialogContent><DialogHeader><DialogTitle>Reject Booking</DialogTitle></DialogHeader>
          <div className="space-y-3"><Input value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason" /></div>
          <DialogFooter><Button variant="outline" onClick={() => setRejectDialog({ open: false, bookingId: null })}>Cancel</Button><Button variant="destructive" onClick={() => { rejectBooking({ bookingId: rejectDialog.bookingId, reason }); setRejectDialog({ open: false, bookingId: null }); setReason(''); }}>Reject</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
