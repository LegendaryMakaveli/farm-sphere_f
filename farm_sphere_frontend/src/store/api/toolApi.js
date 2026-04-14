import { baseApi } from './baseApi';

export const toolApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAvailableTools: builder.query({
      query: () => '/farmers/tools/get/availableTools',
      providesTags: ['Tools'],
    }),

    bookTool: builder.mutation({
      query: (data) => ({
        url: '/farmers/tools/bookings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Tools', 'MyBookings'],
    }),

    getMyBookings: builder.query({
      query: () => '/farmers/tools/view/bookings',
      providesTags: ['MyBookings'],
    }),
  }),
});

export const {
  useGetAvailableToolsQuery,
  useBookToolMutation,
  useGetMyBookingsQuery,
} = toolApi;
