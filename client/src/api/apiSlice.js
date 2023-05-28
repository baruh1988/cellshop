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
    "InventoryItemTypes",
    "Customers",
    "Suppliers",
    "Calls",
    "SaleCallDetails",
    "NewDevices",
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
    getInventory: builder.query({
      query: () => "/inventory/getAllInventoryItems",
      providesTags: ["Inventory"],
    }),
    addInventoryItem: builder.mutation({
      query: (data) => ({
        url: "/inventory/createInventoryItem",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Inventory"],
    }),
    editInventoryItem: builder.mutation({
      query: (data) => ({
        url: "/inventory/editInventoryItem",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Inventory"],
    }),
    deleteInventoryItem: builder.mutation({
      query: (data) => ({
        url: "/inventory/deleteInventoryItem",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Inventory"],
    }),
    getInventoryItemTypes: builder.query({
      query: () => "/inventoryItemType/getAllInventoryItemTypes",
      providesTags: ["InventoryItemTypes"],
    }),
    addInventoryItemType: builder.mutation({
      query: (data) => ({
        url: "/inventoryItemType/createInventoryItemType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["InventoryItemTypes"],
    }),
    editInventoryItemType: builder.mutation({
      query: (data) => ({
        url: "/inventoryItemType/editInventoryItemType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["InventoryItemTypes"],
    }),
    deleteInventoryItemType: builder.mutation({
      query: (data) => ({
        url: "/inventoryItemType/deleteInventoryItemType",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["InventoryItemTypes"],
    }),
    getCustomers: builder.query({
      query: () => "/customer/getAllCustomers",
      providesTags: ["Customers"],
    }),
    addCustomer: builder.mutation({
      query: (data) => ({
        url: "/customer/createCustomer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Customers"],
    }),
    editCustomer: builder.mutation({
      query: (data) => ({
        url: "/customer/editCustomer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Customers"],
    }),
    deleteCustomer: builder.mutation({
      query: (data) => ({
        url: "/customer/deleteCustomer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Customers"],
    }),
    getSuppliers: builder.query({
      query: () => "/supplier/getAllSuppliers",
      providesTags: ["Suppliers"],
    }),
    addSupplier: builder.mutation({
      query: (data) => ({
        url: "/supplier/createSupplier",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Suppliers"],
    }),
    editSupplier: builder.mutation({
      query: (data) => ({
        url: "/supplier/editSupplier",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Suppliers"],
    }),
    deleteSupplier: builder.mutation({
      query: (data) => ({
        url: "/supplier/deleteSupplier",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Suppliers"],
    }),
    //"Calls"
    getCalls: builder.query({
      query: () => "/call/getAllCalls",
      providesTags: ["Calls"],
    }),
    addCall: builder.mutation({
      query: (data) => ({
        url: "/call/createCall",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Calls"],
    }),
    editCall: builder.mutation({
      query: (data) => ({
        url: "/call/editCall",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Calls"],
    }),
    deleteCall: builder.mutation({
      query: (data) => ({
        url: "/call/deleteCall",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Calls"],
    }),
    //"SaleCallDetails",
    getSaleCallDetails: builder.query({
      query: () => "/saleCallDetail/getAllSaleCallDetails",
      providesTags: ["SaleCallDetails"],
    }),
    addSaleCallDetail: builder.mutation({
      query: (data) => ({
        url: "/saleCallDetail/createSaleCallDetail",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SaleCallDetails"],
    }),
    editSaleCallDetail: builder.mutation({
      query: (data) => ({
        url: "/saleCallDetail/editSaleCallDetail",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SaleCallDetails"],
    }),
    deleteSaleCallDetail: builder.mutation({
      query: (data) => ({
        url: "/saleCallDetail/deleteSaleCallDetail",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SaleCallDetails"],
    }),
    //"NewDevices"
    getNewDevices: builder.query({
      query: () => "/newDevice/getAllNewDevices",
      providesTags: ["NewDevices"],
    }),
    addNewDevice: builder.mutation({
      query: (data) => ({
        url: "/newDevice/createNewDevice",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["NewDevices"],
    }),
    editNewDevice: builder.mutation({
      query: (data) => ({
        url: "/newDevice/editNewDevice",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["NewDevices"],
    }),
    deleteNewDevice: builder.mutation({
      query: (data) => ({
        url: "/newDevice/deleteNewDevice",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["NewDevices"],
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
  useAddInventoryItemMutation,
  useDeleteInventoryItemMutation,
  useEditInventoryItemMutation,
  useGetInventoryQuery,
  useAddInventoryItemTypeMutation,
  useDeleteInventoryItemTypeMutation,
  useEditInventoryItemTypeMutation,
  useGetInventoryItemTypesQuery,
  useAddCustomerMutation,
  useAddSupplierMutation,
  useDeleteCustomerMutation,
  useDeleteSupplierMutation,
  useEditCustomerMutation,
  useEditSupplierMutation,
  useGetCustomersQuery,
  useGetSuppliersQuery,
  useAddCallMutation,
  useAddNewDeviceMutation,
  useAddSaleCallDetailMutation,
  useDeleteCallMutation,
  useDeleteNewDeviceMutation,
  useDeleteSaleCallDetailMutation,
  useEditCallMutation,
  useEditNewDeviceMutation,
  useEditSaleCallDetailMutation,
  useGetCallsQuery,
  useGetNewDevicesQuery,
  useGetSaleCallDetailsQuery,
} = apiSlice;
