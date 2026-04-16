import { baseApi } from './baseApi';

export const farmingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCropPlanByPlot: builder.query({
      query: (plotId) => `/farmers/farming/get/crop-plan/plot/${plotId}`,
      providesTags: ['CropPlan'],
    }),

    addIntercrop: builder.mutation({
      query: ({ plotId, ...data }) => ({
        url: `/farmers/farming/add/plot/${plotId}/intercrop`,
        method: 'POST',
        body: { ...data, plotId },
      }),
      invalidatesTags: ['CropPlan'],
    }),

    getMyFarmCycles: builder.query({
      query: () => '/farmers/farming/get/my-farm-cycles',
      providesTags: ['FarmCycles'],
    }),

    getMyTasks: builder.query({
      query: () => '/farmers/farming/get/my-tasks',
      providesTags: ['Tasks'],
    }),

    getMyPendingTasks: builder.query({
      query: () => '/farmers/farming/my-tasks/pending',
      providesTags: ['Tasks'],
    }),

    updateTaskStatus: builder.mutation({
      query: ({ taskId, ...data }) => ({
        url: `/farmers/farming/tasks/${taskId}/status`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Tasks'],
    }),

    getAllCrops: builder.query({
      query: () => '/admin/farming/get-all/crops',
      providesTags: ['Crops'],
    }),
  }),
});

export const {
  useGetCropPlanByPlotQuery,
  useAddIntercropMutation,
  useGetMyFarmCyclesQuery,
  useGetMyTasksQuery,
  useGetMyPendingTasksQuery,
  useUpdateTaskStatusMutation,
  useGetAllCropsQuery,
} = farmingApi;
