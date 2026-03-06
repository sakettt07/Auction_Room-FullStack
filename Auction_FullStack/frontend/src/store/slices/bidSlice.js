import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuctionDetail } from "./auctionSlice";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const bidSlice = createSlice({
  name: "bid",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {
    bidRequest(state, action) {
      state.loading = true;
      state.error = null;
    },
    bidSuccess(state, action) {
      state.loading = false;
    },
    bidFailed(state, action) {
      state.loading = false;
      state.error = action.payload || "Failed to place bid";
    },
  },
});

export const placeBid = (id, data) => async (dispatch) => {
  dispatch(bidSlice.actions.bidRequest());
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/bid/placebid/${id}`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(bidSlice.actions.bidSuccess());
    toast.success(response.data.message);
    dispatch(getAuctionDetail(id));
  } catch (error) {
    dispatch(bidSlice.actions.bidFailed(error?.response?.data?.message));
    toast.error(error?.response?.data?.message || "Failed to place bid");
  }
};

export default bidSlice.reducer;