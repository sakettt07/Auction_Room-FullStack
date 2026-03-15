import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getAllAuctionItems } from "./auctionSlice";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const platformadminSlice = createSlice({
  name: "platformadmin",
  initialState: {
    loading: false,
    monthlyRevenue: [],
    totalAuctioneers: [],
    totalBidders: [],
    paymentProofs: [],
    singlePaymentProof: {},
  },
  reducers: {
    requestForMonthlyRevenue(state, action) {
      state.loading = true;
      state.monthlyRevenue = [];
    },
    successForMonthlyRevenue(state, action) {
      state.loading = false;
      state.monthlyRevenue = action.payload;
    },
    failedForMonthlyRevenue(state, action) {
      state.loading = false;
      state.monthlyRevenue = [];
    },
    requestForAllUsers(state, action) {
      state.loading = true;
      state.totalAuctioneers = [];
      state.totalBidders = [];
    },
    successForAllUsers(state, action) {
      state.loading = false;
      state.totalAuctioneers = action.payload.auctioneersArray;
      state.totalBidders = action.payload.biddersArray;
    },
    failureForAllUsers(state, action) {
      state.loading = false;
      state.totalAuctioneers = [];
      state.totalBidders = [];
    },
    requestForPaymentProofs(state, action) {
      state.loading = true;
      state.paymentProofs = [];
    },
    successForPaymentProofs(state, action) {
      state.loading = false;
      state.paymentProofs = action.payload;
    },
    failureForPaymentProofs(state, action) {
      state.loading = false;
      state.paymentProofs = [];
    },
    requestForDeletePaymentProof(state, action) {
      state.loading = true;
    },
    successForDeletePaymentProof(state, action) {
      state.loading = false;
    },
    failureForDeletePaymentProof(state, action) {
      state.loading = false;
    },
    requestForSinglePaymentProofDetail(state, action) {
      state.loading = true;
      state.singlePaymentProof = {};
    },
    successForSinglePaymentProofDetail(state, action) {
      state.loading = false;
      state.singlePaymentProof = action.payload;
    },
    failureForSinglePaymentProofDetail(state, action) {
      state.loading = false;
      state.singlePaymentProof = {};
    },
    requestForUpdatePaymentProof(state, action) {
      state.loading = true;
    },
    successForUpdatePaymentProof(state, action) {
      state.loading = false;
    },
    failureForUpdatePaymentProof(state, action) {
      state.loading = false;
    },
    requestForAuctionItemDelete(state, action) {
      state.loading = true;
    },
    successForAuctionItemDelete(state, action) {
      state.loading = false;
    },
    failureForAuctionItemDelete(state, action) {
      state.loading = false;
    },
    clearAllErrors(state, action) {
      state.loading = false;
      state.monthlyRevenue = state.monthlyRevenue;
      state.paymentProofs = state.paymentProofs;
      state.totalAuctioneers = state.totalAuctioneers;
      state.totalBidders = state.totalBidders;
      state.singlePaymentProof = {};
    },
  },
});

export const getMonthlyRevenue = () => async (dispatch) => {
  dispatch(platformadminSlice.actions.requestForMonthlyRevenue());
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/platformadmin/revenuegenerated`,
      { withCredentials: true }
    );
    dispatch(
      platformadminSlice.actions.successForMonthlyRevenue(
        response.data.data
      )
    );
  } catch (error) {
    dispatch(platformadminSlice.actions.failedForMonthlyRevenue());
    console.error(error.response.data.message);
  }
};

export const getAllUsers = () => async (dispatch) => {
  dispatch(platformadminSlice.actions.requestForAllUsers());
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/platformadmin/sorteduser/getall`,
      { withCredentials: true }
    );
    dispatch(
      platformadminSlice.actions.successForAllUsers({
        auctioneersArray: response.data.data.auctioneersCount,
        biddersArray: response.data.data.biddersCount,
      })
    );
  } catch (error) {
    dispatch(platformadminSlice.actions.failureForAllUsers());
    console.error(error.response.data.message);
  }
};

export const getAllPaymentProofs = () => async (dispatch) => {
  dispatch(platformadminSlice.actions.requestForPaymentProofs());
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/platformadmin/paymentproofs/getall`,
      { withCredentials: true }
    );
    dispatch(
      platformadminSlice.actions.successForPaymentProofs(
        response.data.data
      )
    );
  } catch (error) {
    dispatch(platformadminSlice.actions.failureForPaymentProofs());
    console.error(error.response.data.message);
  }
};

export const deletePaymentProof = (id) => async (dispatch) => {
  dispatch(platformadminSlice.actions.requestForDeletePaymentProof());
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/v1/platformadmin/removepaymentproof/delete/${id}`,
      { withCredentials: true }
    );
    dispatch(platformadminSlice.actions.successForDeletePaymentProof());
    dispatch(getAllPaymentProofs());
    toast.success(response.data.message);
  } catch (error) {
    dispatch(platformadminSlice.actions.failureForDeletePaymentProof());
    console.error(error.response.data.message);
    toast.error(error.response.data.message);
  }
};

export const getSinglePaymentProofDetail = (id) => async (dispatch) => {
  dispatch(platformadminSlice.actions.requestForSinglePaymentProofDetail());
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/platformadmin/paymentproofdetail/${id}`,
      { withCredentials: true }
    );
    dispatch(
      platformadminSlice.actions.successForSinglePaymentProofDetail(
        response.data.data
      )
    );
  } catch (error) {
    dispatch(platformadminSlice.actions.failureForSinglePaymentProofDetail());
    console.error(error.response.data.message);
  }
};

export const updatePaymentProof = (id, status, amount) => async (dispatch) => {
  dispatch(platformadminSlice.actions.requestForUpdatePaymentProof());
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/v1/platformadmin/payments/updateProofStatus/${id}`,
      { status, amount },
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    dispatch(platformadminSlice.actions.successForUpdatePaymentProof());
    toast.success(response.data.message);
    dispatch(getAllPaymentProofs());
    dispatch(platformadminSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(platformadminSlice.actions.failureForUpdatePaymentProof());
    console.error(error.response.data.message);
    toast.error(error.response.data.message);
  }
};

export const deleteAuctionItem = (id) => async (dispatch) => {
  dispatch(platformadminSlice.actions.requestForAuctionItemDelete());
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/v1/platformadmin/removeitem/delete/${id}`,
      { withCredentials: true }
    );
    dispatch(platformadminSlice.actions.successForAuctionItemDelete());
    toast.success(response.data.message);
    dispatch(getAllAuctionItems());
  } catch (error) {
    dispatch(platformadminSlice.actions.failureForAuctionItemDelete());
    console.error(error.response.data.message);
    toast.error(error.response.data.message);
  }
};

export const clearAllplatformadminSliceErrors = () => (dispatch) => {
  dispatch(platformadminSlice.actions.clearAllErrors());
};

export default platformadminSlice.reducer;
