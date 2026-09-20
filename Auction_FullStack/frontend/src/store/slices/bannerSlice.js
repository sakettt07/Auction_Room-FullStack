import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const bannerSlice = createSlice({
  name: "banner",
  initialState: {
    loading: false,
    activeBanners: [],
    allBanners: [],
    error: null,
  },
  reducers: {
    bannerRequest(state) {
      state.loading = true;
      state.error = null;
    },
    bannerActiveSuccess(state, action) {
      state.loading = false;
      state.activeBanners = action.payload;
    },
    bannerAllSuccess(state, action) {
      state.loading = false;
      state.allBanners = action.payload;
    },
    bannerCreateSuccess(state, action) {
      state.loading = false;
      state.allBanners = [action.payload, ...state.allBanners];
      if (action.payload.isActive) {
        state.activeBanners = [action.payload, ...state.activeBanners];
      }
    },
    bannerDeleteSuccess(state, action) {
      state.loading = false;
      state.allBanners = state.allBanners.filter((b) => b._id !== action.payload);
      state.activeBanners = state.activeBanners.filter((b) => b._id !== action.payload);
    },
    bannerToggleSuccess(state, action) {
      state.loading = false;
      const updated = action.payload;
      state.allBanners = state.allBanners.map((b) =>
        b._id === updated._id ? updated : b
      );
      if (updated.isActive) {
        if (!state.activeBanners.some((b) => b._id === updated._id)) {
          state.activeBanners = [updated, ...state.activeBanners];
        }
      } else {
        state.activeBanners = state.activeBanners.filter((b) => b._id !== updated._id);
      }
    },
    bannerFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearBannerErrors(state) {
      state.error = null;
    },
  },
});

export const {
  bannerRequest,
  bannerActiveSuccess,
  bannerAllSuccess,
  bannerCreateSuccess,
  bannerDeleteSuccess,
  bannerToggleSuccess,
  bannerFailure,
  clearBannerErrors,
} = bannerSlice.actions;

// Public: Fetch active banners for Home Carousel
export const fetchActiveBanners = () => async (dispatch) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/banner/active`, {
      withCredentials: true,
    });
    dispatch(bannerActiveSuccess(response.data.data || []));
  } catch (error) {
    dispatch(
      bannerFailure(error.response?.data?.message || "Failed to load active banners")
    );
  }
};

// Super Admin: Fetch all banners for Dashboard Management
export const fetchAllBanners = () => async (dispatch) => {
  dispatch(bannerRequest());
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/banner/all`, {
      withCredentials: true,
    });
    dispatch(bannerAllSuccess(response.data.data || []));
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to load banners";
    dispatch(bannerFailure(msg));
  }
};

// Super Admin: Create new banner
export const createBanner = (formData) => async (dispatch) => {
  dispatch(bannerRequest());
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/banner/create`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(bannerCreateSuccess(response.data.data));
    dispatch(fetchActiveBanners());
    toast.success("Auction spotlight banner published successfully!");
    return { success: true };
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to create banner";
    dispatch(bannerFailure(msg));
    toast.error(msg);
    return { success: false, message: msg };
  }
};

// Super Admin: Delete banner
export const deleteBanner = (id) => async (dispatch) => {
  dispatch(bannerRequest());
  try {
    await axios.delete(`${API_BASE_URL}/api/v1/banner/delete/${id}`, {
      withCredentials: true,
    });
    dispatch(bannerDeleteSuccess(id));
    dispatch(fetchActiveBanners());
    toast.success("Banner deleted successfully.");
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to delete banner";
    dispatch(bannerFailure(msg));
    toast.error(msg);
  }
};

// Super Admin: Toggle banner active state
export const toggleBannerStatus = (id) => async (dispatch) => {
  dispatch(bannerRequest());
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/v1/banner/toggle/${id}`,
      {},
      { withCredentials: true }
    );
    dispatch(bannerToggleSuccess(response.data.data));
    dispatch(fetchActiveBanners());
    toast.success(response.data.message || "Banner status updated.");
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to toggle status";
    dispatch(bannerFailure(msg));
    toast.error(msg);
  }
};

export default bannerSlice.reducer;
