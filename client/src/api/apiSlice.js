import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3789" }),
  tagTypes: [
    "Users",
    "UserTypes",
    "Manufacturers",
    "Models",
    "Inventory",
    "FixTypes",
    "CallTypes",
    "FaultTypes",
  ],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({ url: "/user/login", method: "POST", body: data }),
    }),
    getUsers: builder.query({
      query: () => "/user/getAllUsers",
      providesTags: ["Users"],
    }),
    addUser: builder.mutation({
      query: (data) => ({
        url: "/user/createUser",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    editUser: builder.mutation({
      query: (data) => ({
        url: "/user/editUser",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (data) => ({
        url: "/user/deleteUser",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/user/changePassword",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    changePasswordByAdmin: builder.mutation({
      query: (data) => ({
        url: "/user/changePasswordByAdmin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    getUserTypes: builder.query({
      query: () => "/userType/getAllUserType",
      providesTags: ["UserTypes"],
    }),
    addUserType: builder.mutation({
      query: (data) => ({
        url: "/userType/createUserType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserTypes"],
    }),
    editUserType: builder.mutation({
      query: (data) => ({
        url: "/userType/editUserType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserTypes"],
    }),
    deleteUserType: builder.mutation({
      query: (data) => ({
        url: "/userType/deleteUserType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserTypes"],
    }),
    getManufacturers: builder.query({
      query: () => "/manufacturer/getAllManufacturers",
      providesTags: ["Manufacturers"],
    }),
    addManufacturer: builder.mutation({
      query: (data) => ({
        url: "/manufacturer/createManufacturer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Manufacturers"],
    }),
    editManufacturer: builder.mutation({
      query: (data) => ({
        url: "/manufacturer/editManufacturer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Manufacturers"],
    }),
    deleteManufacturer: builder.mutation({
      query: (data) => ({
        url: "/manufacturer/deleteManufacturer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Manufacturers"],
    }),
    getFixTypes: builder.query({
      query: () => "/fixType/getAllFixType",
      providesTags: ["FixTypes"],
    }),
    addFixType: builder.mutation({
      query: (data) => ({
        url: "/fixType/createFixType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FixTypes"],
    }),
    editFixType: builder.mutation({
      query: (data) => ({
        url: "/fixType/editFixType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FixTypes"],
    }),
    deleteFixType: builder.mutation({
      query: (data) => ({
        url: "/fixType/deleteFixType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FixTypes"],
    }),
    getFaultTypes: builder.query({
      query: () => "/faultType/getAllFaultType",
      providesTags: ["FaultTypes"],
    }),
    addFaultType: builder.mutation({
      query: (data) => ({
        url: "/faultType/createFaultType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FaultTypes"],
    }),
    editFaultType: builder.mutation({
      query: (data) => ({
        url: "/faultType/editFaultType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FaultTypes"],
    }),
    deleteFaultType: builder.mutation({
      query: (data) => ({
        url: "/faultType/deleteFaultType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FaultTypes"],
    }),
    getCallTypes: builder.query({
      query: () => "/callType/getAllCallType",
      providesTags: ["CallTypes"],
    }),
    addCallType: builder.mutation({
      query: (data) => ({
        url: "/callType/createCallType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CallTypes"],
    }),
    editCallType: builder.mutation({
      query: (data) => ({
        url: "/callType/editCallType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CallTypes"],
    }),
    deleteCallType: builder.mutation({
      query: (data) => ({
        url: "/callType/deleteCallType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CallTypes"],
    }),
    getModels: builder.query({
      query: () => "/model/getAllModels",
      providesTags: ["Models"],
    }),
    addModel: builder.mutation({
      query: (data) => ({
        url: "/model/createModel",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Models"],
    }),
    editModel: builder.mutation({
      query: (data) => ({
        url: "/model/editModel",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Models"],
    }),
    deleteModel: builder.mutation({
      query: (data) => ({
        url: "/model/deleteModel",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Models"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetUsersQuery,
  useAddUserMutation,
  useEditUserMutation,
  useDeleteUserMutation,
  useChangePasswordMutation,
  useChangePasswordByAdminMutation,
  useAddUserTypeMutation,
  useDeleteUserTypeMutation,
  useEditUserTypeMutation,
  useGetUserTypesQuery,
  useAddManufacturerMutation,
  useDeleteManufacturerMutation,
  useEditManufacturerMutation,
  useGetManufacturersQuery,
  useAddFixTypeMutation,
  useDeleteFixTypeMutation,
  useEditFixTypeMutation,
  useGetFixTypesQuery,
  useAddFaultTypeMutation,
  useDeleteFaultTypeMutation,
  useEditFaultTypeMutation,
  useGetFaultTypesQuery,
  useAddCallTypeMutation,
  useDeleteCallTypeMutation,
  useEditCallTypeMutation,
  useGetCallTypesQuery,
  useAddModelMutation,
  useDeleteModelMutation,
  useEditModelMutation,
  useGetModelsQuery,
} = apiSlice;
