import { baseApi } from './baseApi';

export const estateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyPlot: builder.query({
      query: () => '/farmers/estate/plot',
      providesTags: ['MyPlot'],
    }),
  }),
});

export const { useGetMyPlotQuery } = estateApi;
