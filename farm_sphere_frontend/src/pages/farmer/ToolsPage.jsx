import { useState } from 'react';
import { useGetAvailableToolsQuery, useBookToolMutation, useGetMyBookingsQuery } from '@/store/api/toolApi';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import { Wrench, Package, Calendar, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

export function ToolsPage() {
  const { data: toolsRes, isLoading: loadingTools } = useGetAvailableToolsQuery();
  const { data: bookingsRes, isLoading: loadingBookings } = useGetMyBookingsQuery();
  const [bookTool, { isLoading: booking }] = useBookToolMutation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const tools = toolsRes?.data || [];
  const bookings = bookingsRes?.data || [];

  const { register, handleSubmit, reset } = useForm();

  const openBookDialog = (tool) => { setSelectedTool(tool); setDialogOpen(true); };

  const onBook = async (data) => {
    try {
      const payload = {
        toolId: selectedTool.toolId,
        toolName: selectedTool.toolName,
        quantityRequested: data.quantity,
        startDate: data.startDate + "T00:00:00",
        endDate: data.endDate + "T00:00:00",
        purpose: data.purpose
      };
      await bookTool(payload).unwrap();
      setDialogOpen(false);
      reset();
    } catch (err) {}
  };

  return (
    <>
      <PageHeader title="Tools" description="Browse & book farming tools" />

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available"><Wrench className="h-3.5 w-3.5 mr-1" /> Available Tools</TabsTrigger>
          <TabsTrigger value="bookings"><Calendar className="h-3.5 w-3.5 mr-1" /> My Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          {loadingTools ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-36 w-full" />)}</div>
          ) : tools.length === 0 ? (
            <EmptyState icon={Wrench} title="No tools available" description="Check back later for available farming tools" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool) => (
                <Card key={tool.toolId} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"><Wrench className="h-5 w-5 text-amber-600" /></div>
                      <div><p className="font-semibold">{tool.toolName}</p><p className="text-xs text-muted-foreground">{tool.conditionStatus}</p></div>
                    </div>
                    {tool.description && <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm"><Package className="h-3.5 w-3.5 text-muted-foreground" /><span>{tool.quantityAvailable} available</span></div>
                      <Button size="sm" onClick={() => openBookDialog(tool)}>Book</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookings">
          {loadingBookings ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
          ) : bookings.length === 0 ? (
            <EmptyState icon={Calendar} title="No bookings" description="Book a tool from the available tools tab" />
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <Card key={b.bookingId}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{b.toolName || `Tool #${b.toolId}`}</p>
                      <p className="text-xs text-muted-foreground">Qty: {b.quantityRequested} • {formatDate(b.startDate)} → {formatDate(b.endDate)}</p>
                    </div>
                    <StatusBadge status={b.status} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book {selectedTool?.toolName}</DialogTitle>
            <DialogDescription>Request to rent this tool for a specific period. All bookings are subject to admin approval.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onBook)} className="space-y-4">
            <div className="space-y-1"><Label>Quantity</Label><Input type="number" min={1} max={selectedTool?.quantityAvailable} {...register('quantity', { valueAsNumber: true })} defaultValue={1} /></div>
            <div className="space-y-1"><Label>Start Date</Label><Input type="date" {...register('startDate')} /></div>
            <div className="space-y-1"><Label>End Date</Label><Input type="date" {...register('endDate')} /></div>
            <div className="space-y-1"><Label>Purpose</Label><Input {...register('purpose')} placeholder="Farming purpose" /></div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={booking}>{booking ? 'Booking...' : 'Confirm Booking'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
