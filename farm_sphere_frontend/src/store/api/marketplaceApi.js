import { baseApi } from './baseApi';

export const marketplaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Public produce
    getAvailableProduce: builder.query({
      query: () => '/public/produce/available-produce',
      providesTags: ['Produce'],
    }),

    getProduceById: builder.query({
      query: (id) => `/public/produce/get-produce/${id}`,
      providesTags: (result, error, id) => [{ type: 'Produce', id }],
    }),

    getProduceByCategory: builder.query({
      query: (category) => `/public/produce/category/${category}`,
      providesTags: ['Produce'],
    }),

    // Farmer produce management
    listProduce: builder.mutation({
      query: (data) => ({
        url: '/farmers/produce/list-produce',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Produce', 'MyProduce'],
    }),

    getMyProduce: builder.query({
      query: () => '/farmers/produce/get-my-listing',
      providesTags: ['MyProduce'],
    }),

    updateProduce: builder.mutation({
      query: ({ produceId, ...data }) => ({
        url: `/farmers/produce/update/produce${produceId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Produce', 'MyProduce'],
    }),

    deleteProduce: builder.mutation({
      query: (produceId) => ({
        url: `/farmers/produce/delete-produce/${produceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Produce', 'MyProduce'],
    }),

    // Buyer orders
    placeOrder: builder.mutation({
      query: (data) => ({
        url: '/orders/place-order',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MyOrders', 'Produce'],
    }),

    getMyOrders: builder.query({
      query: () => '/orders/get-order',
      providesTags: ['MyOrders'],
    }),

    getOrderById: builder.query({
      query: (orderId) => `/orders/get-single-order/${orderId}`,
      providesTags: (result, error, id) => [{ type: 'MyOrders', id }],
    }),

    cancelOrder: builder.mutation({
      query: ({ orderId, ...data }) => ({
        url: `/orders/cancel-order${orderId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['MyOrders'],
    }),
  }),
});

export const {
  useGetAvailableProduceQuery,
  useGetProduceByIdQuery,
  useGetProduceByCategoryQuery,
  useListProduceMutation,
  useGetMyProduceQuery,
  useUpdateProduceMutation,
  useDeleteProduceMutation,
  usePlaceOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
} = marketplaceApi;
