import { useState } from 'react';
import {
  useGetAllAssetsQuery,
  useCreateAssetMutation,
  useCloseAssetFundingMutation,
  useRecordAssetHarvestMutation,
  useDistributeAssetROIMutation,
  useUpdateAssetPriceMutation,
} from '@/store/api/adminApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Loader2, Plus, TrendingUp, HandCoins } from 'lucide-react';
import { toast } from 'sonner';

export function InvestmentManagementPage() {
  const { data: assetsRes, isLoading } = useGetAllAssetsQuery();
  const assets = assetsRes?.data || [];

  const [createAsset, { isLoading: isCreating }] = useCreateAssetMutation();
  const [closeFunding, { isLoading: isClosing }] = useCloseAssetFundingMutation();
  const [recordHarvest, { isLoading: isHarvesting }] = useRecordAssetHarvestMutation();
  const [distributeROI, { isLoading: isDistributing }] = useDistributeAssetROIMutation();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    cropPlanId: '',
    cropName: '',
    farmerName: '',
    totalUnits: '',
    unitPrice: '',
    expectedROI: '',
    fundingDeadline: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        cropPlanId: Number(formData.cropPlanId),
        totalUnits: Number(formData.totalUnits),
        unitPrice: Number(formData.unitPrice),
        expectedROI: Number(formData.expectedROI),
      };
      await createAsset(payload).unwrap();
      toast.success('Investment asset created successfully!');
      setShowCreateForm(false);
      setFormData({
        cropPlanId: '',
        cropName: '',
        farmerName: '',
        totalUnits: '',
        unitPrice: '',
        expectedROI: '',
        fundingDeadline: '',
      });
    } catch (err) {
      toast.error(err.data?.message || 'Failed to create asset');
    }
  };

  const handleCloseFunding = async (assetId) => {
    try {
      await closeFunding(assetId).unwrap();
      toast.success('Funding closed successfully!');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to close funding');
    }
  };

  const handleRecordHarvest = async (assetId) => {
    try {
      // Hardcoding for now, could be a separate modal form
      await recordHarvest({ assetId, actualYield: 1000, harvestDate: new Date().toISOString().split('T')[0], quality: 'A' }).unwrap();
      toast.success('Harvest recorded successfully!');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to record harvest');
    }
  };

  const handleDistributeROI = async (assetId) => {
    try {
      await distributeROI(assetId).unwrap();
      toast.success('ROI Distributed successfully!');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to distribute ROI');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investment Management</h1>
          <p className="text-muted-foreground mt-1">Manage investment opportunities and ROI distribution</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showCreateForm ? 'Cancel' : 'Create Asset'}
        </Button>
      </div>

      {showCreateForm && (
        <Card className="animate-in fade-in slide-in-from-top-4">
          <CardHeader>
            <CardTitle>Create New Investment Asset</CardTitle>
            <CardDescription>Mint a new asset from an existing crop plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cropPlanId">Crop Plan ID</Label>
                <Input id="cropPlanId" name="cropPlanId" value={formData.cropPlanId} onChange={handleInputChange} required type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cropName">Crop Name</Label>
                <Input id="cropName" name="cropName" value={formData.cropName} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="farmerName">Farmer Name</Label>
                <Input id="farmerName" name="farmerName" value={formData.farmerName} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalUnits">Total Units</Label>
                <Input id="totalUnits" name="totalUnits" value={formData.totalUnits} onChange={handleInputChange} required type="number" min="1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price</Label>
                <Input id="unitPrice" name="unitPrice" value={formData.unitPrice} onChange={handleInputChange} required type="number" step="0.01" min="1.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedROI">Expected ROI (%)</Label>
                <Input id="expectedROI" name="expectedROI" value={formData.expectedROI} onChange={handleInputChange} required type="number" step="0.1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fundingDeadline">Funding Deadline</Label>
                <Input id="fundingDeadline" name="fundingDeadline" value={formData.fundingDeadline} onChange={handleInputChange} required type="date" />
              </div>
              <div className="col-span-1 md:col-span-2 pt-2 flex justify-end">
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}
                  Create Investment Asset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <Card key={asset.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{asset.cropName}</CardTitle>
                  <CardDescription>By {asset.farmerName}</CardDescription>
                </div>
                <Badge variant={asset.status === 'FUNDING' ? 'default' : 'secondary'}>
                  {asset.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Unit Price</p>
                  <p className="font-semibold">{formatCurrency(asset.unitPrice)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Expected ROI</p>
                  <p className="font-semibold text-green-600">+{asset.expectedROI}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Funding Progress</p>
                  <p className="font-semibold">{asset.availableUnits} / {asset.totalUnits} units left</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Deadline</p>
                  <p className="font-semibold">{formatDate(asset.fundingDeadline)}</p>
                </div>
              </div>
              
              <div className="pt-4 flex flex-wrap gap-2">
                {asset.status === 'FUNDING' && (
                  <Button variant="outline" size="sm" onClick={() => handleCloseFunding(asset.id)} disabled={isClosing}>
                    Close Funding
                  </Button>
                )}
                {asset.status === 'GROWING' && (
                  <Button variant="secondary" size="sm" onClick={() => handleRecordHarvest(asset.id)} disabled={isHarvesting}>
                    Record Harvest
                  </Button>
                )}
                {asset.status === 'HARVESTED' && (
                  <Button className="w-full" size="sm" onClick={() => handleDistributeROI(asset.id)} disabled={isDistributing}>
                    <HandCoins className="mr-2 h-4 w-4" />
                    Distribute ROI
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {assets.length === 0 && (
        <div className="text-center p-12 border rounded-xl bg-muted/20">
          <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">No assets found</h3>
          <p className="text-muted-foreground mt-1">Create an asset from a crop plan to start funding.</p>
        </div>
      )}
    </div>
  );
}
