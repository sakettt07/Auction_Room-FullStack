import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const auctionSlice = createSlice({
  name: "auction",
  initialState: {
    loading: false,
    error: null,
    itemDetail: {},
    auctionDetail: {},
    auctionBidders: [],
    myAuctions: [],
    allAuctions: [],
  },
  reducers: {
    createAuctionRequest(state, action) {
      state.loading = true;
      state.error = null;
    },
    createAuctionSuccess(state, action) {
      state.loading = false;
    },
    createAuctionFailed(state, action) {
      state.loading = false;
    },
    getAllAuctionItemRequest(state, action) {
      state.loading = true;
      state.error = null;
    },
    getAllAuctionItemSuccess(state, action) {
      state.loading = false;
      state.allAuctions = action.payload;
      localStorage.setItem(
        "auctions_cache",
        JSON.stringify({
          data: action.payload,
          time: Date.now(),
        })
      );
    },
    getAllAuctionItemFailed(state, action) {
      state.loading = false;
      state.error = action.payload || "Failed to fetch auctions";
    },
    getAuctionDetailRequest(state, action) {
      state.loading = true;
      state.error = null;
    },
    getAuctionDetailSuccess(state, action) {
      state.loading = false;
      state.auctionDetail = action.payload.auctionItem;
      state.auctionBidders = action.payload.bidders;
      const id = action.payload.auctionItem._id;

      localStorage.setItem(
        `auction_detail_${id}`,
        JSON.stringify({
          data: action.payload,
          time: Date.now(),
        })
      );
    },
    getAuctionDetailFailed(state, action) {
      state.loading = false;
      state.error = action.payload || "Failed to fetch auction details";
    },
    getMyAuctionsRequest(state, action) {
      state.loading = true;
      state.error = null;
      state.myAuctions = [];
    },
    getMyAuctionsSuccess(state, action) {
      state.loading = false;
      state.myAuctions = action.payload || [];
      localStorage.setItem(
        "my_auctions_cache",
        JSON.stringify({
          data: action.payload,
          time: Date.now(),
        })
      );
    },
    getMyAuctionsFailed(state, action) {
      state.loading = false;
      state.error = action.payload || "Failed to fetch your auctions";
      state.myAuctions = [];
    },
    deleteAuctionItemRequest(state, action) {
      state.loading = true;
      state.error = null;
    },
    deleteAuctionItemSuccess(state, action) {
      state.loading = false;
    },
    deleteAuctionItemFailed(state, action) {
      state.loading = false;
      state.error = action.payload || "Failed to delete auction";
    },
    republishItemRequest(state, action) {
      state.loading = true;
      state.error = null;
    },
    republishItemSuccess(state, action) {
      state.loading = false;
    },
    republishItemFailed(state, action) {
      state.loading = false;
      state.error = action.payload || "Failed to republish auction";
    },

    resetSlice(state, action) {
      state.loading = false;
      state.error = null;
    },
  },
});

export const getAllAuctionItems = () => async (dispatch) => {
  dispatch(auctionSlice.actions.getAllAuctionItemRequest());
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/auctionItem/auctionitems`,
      { withCredentials: true }
    );
    dispatch(
      auctionSlice.actions.getAllAuctionItemSuccess(response.data.data)
    );
    // dispatch(auctionSlice.actions.resetSlice());
  } catch (error) {
    console.error(error);

    // ✅ Try cache if backend fails (Render sleeping case)
    const cached = localStorage.getItem("auctions_cache");

    if (cached) {
      const parsed = JSON.parse(cached);

      // ⏳ optional expiry (5 min)
      const isValid = Date.now() - parsed.time < 5 * 60 * 1000;

      if (isValid) {
        dispatch(
          auctionSlice.actions.getAllAuctionItemSuccess(parsed.data)
        );
        return;
      }
    }

    dispatch(
      auctionSlice.actions.getAllAuctionItemFailed(
        error?.response?.data?.message
      )
    );
  } finally {
    dispatch(auctionSlice.actions.resetSlice());
  }
};

export const getMyAuctionItems = () => async (dispatch) => {
  dispatch(auctionSlice.actions.getMyAuctionsRequest());
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/auctionItem/myauction`,
      { withCredentials: true }
    );
    // Backend wraps data in ApiResponse, use `data`
    dispatch(auctionSlice.actions.getMyAuctionsSuccess(response.data.data));
  } catch (error) {
    console.error(error);
    const cached = localStorage.getItem("my_auctions_cache");

    if (cached) {
      const parsed = JSON.parse(cached);
      const isValid = Date.now() - parsed.time < 5 * 60 * 1000;

      if (isValid) {
        dispatch(
          auctionSlice.actions.getMyAuctionsSuccess(parsed.data)
        );
        return;
      }
    }

    dispatch(
      auctionSlice.actions.getMyAuctionsFailed(
        error?.response?.data?.message
      )
    );
  }
  finally {
    dispatch(auctionSlice.actions.resetSlice());
  }
};

export const getAuctionDetail = (id) => async (dispatch) => {
  dispatch(auctionSlice.actions.getAuctionDetailRequest());
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/auctionItem/auction/${id}`,
      { withCredentials: true }
    );
    dispatch(
      auctionSlice.actions.getAuctionDetailSuccess(response.data.data)
    );
  } catch (error) {
    console.error(error);
    // ✅ Fallback to cache
    const cached = localStorage.getItem(`auction_detail_${id}`);

    if (cached) {
      const parsed = JSON.parse(cached);
      const isValid = Date.now() - parsed.time < 5 * 60 * 1000;
      if (isValid) {
        dispatch(
          auctionSlice.actions.getAuctionDetailSuccess(parsed.data)
        );
        return;
      }
    }
    dispatch(
      auctionSlice.actions.getAuctionDetailFailed(
        error?.response?.data?.message
      )
    );
  } finally {
    dispatch(auctionSlice.actions.resetSlice());
  }
};

export const createAuction = (data) => async (dispatch) => {
  dispatch(auctionSlice.actions.createAuctionRequest());
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/auctionItem/createauction`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(auctionSlice.actions.createAuctionSuccess());
    toast.success(response.data.message);
    dispatch(getAllAuctionItems());
    dispatch(auctionSlice.actions.resetSlice());
  } catch (error) {
    dispatch(
      auctionSlice.actions.createAuctionFailed(
        error?.response?.data?.message
      )
    );
    toast.error(error?.response?.data?.message || "Failed to create auction");
    dispatch(auctionSlice.actions.resetSlice());
  }
};

export const republishAuction = (id, data) => async (dispatch) => {
  dispatch(auctionSlice.actions.republishItemRequest());
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/v1/auctionItem/republishauction/${id}`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(auctionSlice.actions.republishItemSuccess());
    toast.success(response.data.message);
    dispatch(getMyAuctionItems());
    dispatch(getAllAuctionItems());
    dispatch(auctionSlice.actions.resetSlice());
  } catch (error) {
    dispatch(
      auctionSlice.actions.republishItemFailed(
        error?.response?.data?.message
      )
    );
    toast.error(
      error?.response?.data?.message || "Failed to republish auction"
    );
    console.error(error?.response?.data?.message || error);
    dispatch(auctionSlice.actions.resetSlice());
  }
};

export const deleteAuction = (id) => async (dispatch) => {
  dispatch(auctionSlice.actions.deleteAuctionItemRequest());
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/v1/auctionItem/removeItem/${id}`,
      {
        withCredentials: true,
      }
    );
    dispatch(auctionSlice.actions.deleteAuctionItemSuccess());
    toast.success(response.data.message);
    dispatch(getMyAuctionItems());
    dispatch(getAllAuctionItems());
    dispatch(auctionSlice.actions.resetSlice());
  } catch (error) {
    dispatch(
      auctionSlice.actions.deleteAuctionItemFailed(
        error?.response?.data?.message
      )
    );
    toast.error(
      error?.response?.data?.message || "Failed to delete auction item"
    );
    console.error(error?.response?.data?.message || error);
    dispatch(auctionSlice.actions.resetSlice());
  }
};

export default auctionSlice.reducer;
