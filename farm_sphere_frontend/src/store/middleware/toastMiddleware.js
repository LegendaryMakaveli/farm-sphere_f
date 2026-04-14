import { isRejectedWithValue, isFulfilled } from '@reduxjs/toolkit';
import { toast } from 'sonner';

const SKIP_SUCCESS_TOAST = ['getAvailableProduce', 'getProduceById', 'getProduceByCategory', 'getMyProduce', 'getMyOrders', 'getOrderById', 'getOpenAssets', 'getAssetById', 'getMyPortfolio', 'getOpenListings', 'getListingsByAsset', 'getMyListings', 'getCropPlanByPlot', 'getMyFarmCycles', 'getMyTasks', 'getMyPendingTasks', 'getMyPlot', 'getAvailableTools', 'getMyBookings', 'getProfileStatus', 'getPendingFarmers', 'getPendingInvestors', 'getAllEstates', 'getClustersByEstate', 'getAllPlots', 'getAvailablePlots', 'getAllCrops', 'getAdminCropById', 'getCropsByCategory', 'getAdminCropPlanById', 'getAdminCropPlanByPlot', 'getAllFarmCycles', 'getActiveCycleByPlot', 'getTasksByFarmCycle', 'getAllOrders', 'getPendingOrders', 'getMatchedOrders', 'getAllTools', 'getAdminToolById', 'getAllBookings', 'getPendingBookings'];

export const toastMiddleware = () => (next) => (action) => {
  // Show error toasts for failed mutations and queries
  if (isRejectedWithValue(action)) {
    const errorMessage =
      action.payload?.data?.message ||
      action.payload?.error ||
      'Something went wrong. Please try again.';

    toast.error('Error', {
      description: errorMessage,
      duration: 5000,
    });
  }

  // Show success toasts for fulfilled mutations (not queries)
  if (isFulfilled(action)) {
    const endpointName = action.meta?.arg?.endpointName;
    
    // Skip success toasts for GET queries
    if (endpointName && !SKIP_SUCCESS_TOAST.includes(endpointName)) {
      const successMessage = action.payload?.message || 'Operation completed successfully';
      toast.success('Success', {
        description: successMessage,
        duration: 3000,
      });
    }
  }

  return next(action);
};
