import { baseApi } from './baseApi';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Auth Admin ──
    getPendingFarmers: builder.query({
      query: () => '/admin/farmers/pending',
      providesTags: ['PendingFarmers'],
    }),
    getPendingInvestors: builder.query({
      query: () => '/admin/investors/pending',
      providesTags: ['PendingInvestors'],
    }),
    getAllFarmers: builder.query({
      query: () => '/admin/farmers/all',
      providesTags: ['Farmers'],
    }),
    getAllUsers: builder.query({
      query: () => '/admin/users/all',
      providesTags: ['Users'],
    }),
    approveFarmer: builder.mutation({
      query: (farmerId) => ({ url: `/admin/farmers/${farmerId}/approve`, method: 'PATCH' }),
      invalidatesTags: ['PendingFarmers'],
    }),
    rejectFarmer: builder.mutation({
      query: ({ farmerId, reason }) => ({ url: `/admin/farmers/${farmerId}/reject`, method: 'PATCH', body: reason }),
      invalidatesTags: ['PendingFarmers'],
    }),
    approveInvestor: builder.mutation({
      query: (investorId) => ({ url: `/admin/investors/${investorId}/approve`, method: 'PATCH' }),
      invalidatesTags: ['PendingInvestors'],
    }),
    rejectInvestor: builder.mutation({
      query: ({ investorId, reason }) => ({ url: `/admin/investors/${investorId}/reject`, method: 'PATCH', body: reason }),
      invalidatesTags: ['PendingInvestors'],
    }),

    // ── Estate Admin ──
    createEstate: builder.mutation({
      query: (data) => ({ url: '/admin/estate/create/estates', method: 'POST', body: data }),
      invalidatesTags: ['Estates'],
    }),
    getAllEstates: builder.query({
      query: () => '/admin/estate/get-all/estates',
      providesTags: ['Estates'],
    }),
    createCluster: builder.mutation({
      query: (data) => ({ url: '/admin/estate/create/clusters', method: 'POST', body: data }),
      invalidatesTags: ['Clusters'],
    }),
    getClustersByEstate: builder.query({
      query: (estateId) => `/admin/estate/estates/${estateId}/clusters`,
      providesTags: (result, error, estateId) => [{ type: 'Clusters', id: estateId }],
    }),
    createPlot: builder.mutation({
      query: (data) => ({ url: '/admin/estate/plots', method: 'POST', body: data }),
      invalidatesTags: ['Plots'],
    }),
    getAllPlots: builder.query({
      query: () => '/admin/estate/plots',
      providesTags: ['Plots'],
    }),
    getAvailablePlots: builder.query({
      query: () => '/admin/estate/plots/available',
      providesTags: ['Plots'],
    }),
    assignPlot: builder.mutation({
      query: ({ plotId, ...data }) => ({ url: `/admin/estate/plots/${plotId}/assign`, method: 'PATCH', body: data }),
      invalidatesTags: ['Plots'],
    }),
    unassignPlot: builder.mutation({
      query: (plotId) => ({ url: `/admin/estate/plots/${plotId}/unassign`, method: 'PATCH' }),
      invalidatesTags: ['Plots'],
    }),

    // ── Farming Admin ──
    createCrop: builder.mutation({
      query: (data) => ({ url: '/admin/farming/create/crops', method: 'POST', body: data }),
      invalidatesTags: ['Crops'],
    }),
    getAllCrops: builder.query({
      query: () => '/admin/farming/get-all/crops',
      providesTags: ['Crops'],
    }),
    getAdminCropById: builder.query({
      query: (cropId) => `/admin/farming/get/crop/${cropId}`,
    }),
    getCropsByCategory: builder.query({
      query: (category) => `/admin/farming/get/crop/category/${category}`,
      providesTags: ['Crops'],
    }),
    createCropPlan: builder.mutation({
      query: (data) => ({ url: '/admin/farming/create/crop-plans', method: 'POST', body: data }),
      invalidatesTags: ['CropPlans'],
    }),
    getAllCropPlans: builder.query({
      query: () => '/admin/farming/get-all/crop-plans',
      providesTags: ['CropPlans'],
    }),
    getAdminCropPlanById: builder.query({
      query: (cropPlanId) => `/admin/farming/get/crop-plan/${cropPlanId}`,
      providesTags: (result, error, id) => [{ type: 'CropPlans', id }],
    }),
    getAdminCropPlanByPlot: builder.query({
      query: (plotId) => `/admin/farming/get/crop-plans/plot/${plotId}`,
      providesTags: ['CropPlans'],
    }),
    enableIntercropping: builder.mutation({
      query: (plotId) => ({ url: `/admin/farming/plots/${plotId}/enable-intercropping`, method: 'PATCH' }),
      invalidatesTags: ['CropPlans'],
    }),
    startFarmCycle: builder.mutation({
      query: (data) => ({ url: '/admin/farming/start/farm-cycles', method: 'POST', body: data }),
      invalidatesTags: ['AllFarmCycles'],
    }),
    getAllFarmCycles: builder.query({
      query: () => '/admin/farming/get/farm-cycles',
      providesTags: ['AllFarmCycles'],
    }),
    getActiveCycleByPlot: builder.query({
      query: (plotId) => `/admin/farming/farm-cycles/plot/${plotId}/active`,
    }),
    activateFarmCycle: builder.mutation({
      query: (farmCycleId) => ({ url: `/admin/farming/farm-cycles/${farmCycleId}/activate`, method: 'PATCH' }),
      invalidatesTags: ['AllFarmCycles'],
    }),
    recordHarvest: builder.mutation({
      query: ({ farmCycleId, ...data }) => ({ url: `/admin/farming/farm-cycles/${farmCycleId}/harvest`, method: 'PATCH', body: data }),
      invalidatesTags: ['AllFarmCycles'],
    }),
    createTask: builder.mutation({
      query: (data) => ({ url: '/admin/farming/create/tasks', method: 'POST', body: data }),
      invalidatesTags: ['Tasks'],
    }),
    getTasksByFarmCycle: builder.query({
      query: (farmCycleId) => `/admin/farming/get/tasks/farm-cycle/${farmCycleId}`,
      providesTags: ['Tasks'],
    }),

    // ── Investment Admin ──
    createAsset: builder.mutation({
      query: (data) => ({ url: '/admin/investment/create-assets', method: 'POST', body: data }),
      invalidatesTags: ['Assets'],
    }),
    getAllAssets: builder.query({
      query: () => '/admin/investment/get-all-assets',
      providesTags: ['Assets'],
    }),
    updateAssetPrice: builder.mutation({
      query: ({ assetId, ...data }) => ({ url: `/admin/investment/update/assets/${assetId}/price`, method: 'PATCH', body: data }),
      invalidatesTags: ['Assets'],
    }),
    closeAssetFunding: builder.mutation({
      query: (assetId) => ({ url: `/admin/investment/close/assets/${assetId}/funding`, method: 'PATCH' }),
      invalidatesTags: ['Assets'],
    }),
    recordAssetHarvest: builder.mutation({
      query: ({ assetId, ...data }) => ({ url: `/admin/investment/assets/${assetId}/harvest`, method: 'PATCH', body: data }),
      invalidatesTags: ['Assets'],
    }),
    distributeAssetROI: builder.mutation({
      query: (assetId) => ({ url: `/admin/investment/assets/${assetId}/distribute`, method: 'POST' }),
      invalidatesTags: ['Assets'],
    }),
    getAssetDistribution: builder.query({
      query: (assetId) => `/admin/investment/get/assets/${assetId}/distribution`,
    }),
    getAllListings: builder.query({
      query: () => '/admin/investment/get/all/listing',
      providesTags: ['Listings'],
    }),

    // ── Order Admin ──
    getAllOrders: builder.query({
      query: () => '/admin/orders/get-all',
      providesTags: ['AllOrders'],
    }),
    getPendingOrders: builder.query({
      query: () => '/admin/orders/pending',
      providesTags: ['AllOrders'],
    }),
    getMatchedOrders: builder.query({
      query: () => '/admin/orders/matched',
      providesTags: ['AllOrders'],
    }),
    matchOrder: builder.mutation({
      query: (orderId) => ({ url: `/admin/orders/${orderId}/match`, method: 'PATCH' }),
      invalidatesTags: ['AllOrders'],
    }),
    confirmSale: builder.mutation({
      query: ({ orderId, ...data }) => ({ url: `/admin/orders/${orderId}/confirm-sale`, method: 'POST', body: data }),
      invalidatesTags: ['AllOrders'],
    }),

    // ── Tool Admin ──
    createTool: builder.mutation({
      query: (data) => ({ url: '/admin/tools/create-tool', method: 'POST', body: data }),
      invalidatesTags: ['AllTools'],
    }),
    getAllTools: builder.query({
      query: () => '/admin/tools/get-all-tools',
      providesTags: ['AllTools'],
    }),
    getAdminToolById: builder.query({
      query: (toolId) => `/admin/tools/get-tool/${toolId}`,
    }),
    updateTool: builder.mutation({
      query: ({ toolId, ...data }) => ({ url: `/admin/tools/update-tool/${toolId}`, method: 'PATCH', body: data }),
      invalidatesTags: ['AllTools'],
    }),
    addStock: builder.mutation({
      query: ({ toolId, ...data }) => ({ url: `/admin/tools/add/${toolId}/stock`, method: 'PATCH', body: data }),
      invalidatesTags: ['AllTools'],
    }),
    getAllBookings: builder.query({
      query: () => '/admin/tools/get-all-bookings',
      providesTags: ['AllBookings'],
    }),
    getPendingBookings: builder.query({
      query: () => '/admin/tools/bookings/pending',
      providesTags: ['AllBookings'],
    }),
    approveBooking: builder.mutation({
      query: (bookingId) => ({ url: `/admin/tools/bookings/${bookingId}/approve`, method: 'PATCH' }),
      invalidatesTags: ['AllBookings'],
    }),
    rejectBooking: builder.mutation({
      query: ({ bookingId, reason }) => ({ url: `/admin/tools/bookings/${bookingId}/reject`, method: 'PATCH', body: { reason } }),
      invalidatesTags: ['AllBookings'],
    }),
    pickupTool: builder.mutation({
      query: (bookingId) => ({ url: `/admin/tools/bookings/${bookingId}/pickup`, method: 'PATCH' }),
      invalidatesTags: ['AllBookings'],
    }),
    returnTool: builder.mutation({
      query: (bookingId) => ({ url: `/admin/tools/bookings/${bookingId}/return`, method: 'PATCH' }),
      invalidatesTags: ['AllBookings', 'AllTools'],
    }),
  }),
});

export const {
  // Auth Admin
  useGetPendingFarmersQuery, useGetPendingInvestorsQuery, useGetAllFarmersQuery,
  useApproveFarmerMutation, useRejectFarmerMutation,
  useApproveInvestorMutation, useRejectInvestorMutation,
  useGetAllUsersQuery,
  // Estate Admin
  useCreateEstateMutation, useGetAllEstatesQuery,
  useCreateClusterMutation, useGetClustersByEstateQuery,
  useCreatePlotMutation, useGetAllPlotsQuery, useGetAvailablePlotsQuery,
  useAssignPlotMutation, useUnassignPlotMutation,
  // Farming Admin
  useCreateCropMutation, useGetAllCropsQuery, useGetAdminCropByIdQuery,
  useGetCropsByCategoryQuery, useCreateCropPlanMutation,
  useGetAllCropPlansQuery,
  useGetAdminCropPlanByIdQuery, useGetAdminCropPlanByPlotQuery,
  useStartFarmCycleMutation, useGetAllFarmCyclesQuery,
  useGetActiveCycleByPlotQuery, useActivateFarmCycleMutation,
  useEnableIntercroppingMutation,
  useRecordHarvestMutation, useCreateTaskMutation, useGetTasksByFarmCycleQuery,
  // Order Admin
  useGetAllOrdersQuery, useGetPendingOrdersQuery, useGetMatchedOrdersQuery,
  useMatchOrderMutation, useConfirmSaleMutation,
  // Investment Admin
  useCreateAssetMutation, useGetAllAssetsQuery, useUpdateAssetPriceMutation,
  useCloseAssetFundingMutation, useRecordAssetHarvestMutation,
  useDistributeAssetROIMutation, useGetAssetDistributionQuery,
  useGetAllListingsQuery,
  // Tool Admin
  useCreateToolMutation, useGetAllToolsQuery, useGetAdminToolByIdQuery,
  useUpdateToolMutation, useAddStockMutation,
  useGetAllBookingsQuery, useGetPendingBookingsQuery,
  useApproveBookingMutation, useRejectBookingMutation,
  usePickupToolMutation, useReturnToolMutation,
} = adminApi;
