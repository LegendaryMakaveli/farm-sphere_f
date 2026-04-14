import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Profile'],
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    upgradeToFarmer: builder.mutation({
      query: (data) => ({
        url: '/auth/upgrade/farmer',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),

    upgradeToInvestor: builder.mutation({
      query: () => ({
        url: '/auth/upgrade/investor',
        method: 'POST',
      }),
      invalidatesTags: ['Profile'],
    }),

    getProfileStatus: builder.query({
      query: () => '/auth/profile/status',
      providesTags: ['Profile'],
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'PATCH',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUpgradeToFarmerMutation,
  useUpgradeToInvestorMutation,
  useGetProfileStatusQuery,
  useResetPasswordMutation,
} = authApi;
