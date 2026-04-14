import { baseApi } from './baseApi';

export const investmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOpenAssets: builder.query({
      query: () => '/investor/open-assets',
      providesTags: ['Assets'],
    }),

    getAssetById: builder.query({
      query: (assetId) => `/investor/assets/${assetId}`,
      providesTags: (result, error, id) => [{ type: 'Assets', id }],
    }),

    buyFromAsset: builder.mutation({
      query: ({ assetId, ...data }) => ({
        url: `/investor/assets/${assetId}/invest`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Assets', 'Portfolio'],
    }),

    getMyPortfolio: builder.query({
      query: () => '/investor/portfolio',
      providesTags: ['Portfolio'],
    }),

    listTokenForSale: builder.mutation({
      query: ({ tokenId, ...data }) => ({
        url: `/investor/tokens/${tokenId}/listing`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Portfolio', 'Listings', 'MyListings'],
    }),

    getOpenListings: builder.query({
      query: () => '/investor/sec/market',
      providesTags: ['Listings'],
    }),

    getListingsByAsset: builder.query({
      query: (assetId) => `/investor/assets/${assetId}/market`,
      providesTags: (result, error, id) => [{ type: 'Listings', id }],
    }),

    buyFromListing: builder.mutation({
      query: (listingId) => ({
        url: `/investor/sec/market/${listingId}/buy`,
        method: 'POST',
      }),
      invalidatesTags: ['Listings', 'Portfolio'],
    }),

    cancelListing: builder.mutation({
      query: (listingId) => ({
        url: `/investor/sec/market/${listingId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Listings', 'MyListings', 'Portfolio'],
    }),

    getMyListings: builder.query({
      query: () => '/investor/portfolio/listings',
      providesTags: ['MyListings'],
    }),
  }),
});

export const {
  useGetOpenAssetsQuery,
  useGetAssetByIdQuery,
  useBuyFromAssetMutation,
  useGetMyPortfolioQuery,
  useListTokenForSaleMutation,
  useGetOpenListingsQuery,
  useGetListingsByAssetQuery,
  useBuyFromListingMutation,
  useCancelListingMutation,
  useGetMyListingsQuery,
} = investmentApi;
