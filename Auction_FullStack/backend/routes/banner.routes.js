import express from "express";
import {
  createBanner,
  getActiveBanners,
  getAllBanners,
  deleteBanner,
  toggleBannerStatus,
} from "../controllers/banner.controller.js";
import { checkRole, isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public route: fetch active banners for Home page
router.route("/active").get(getActiveBanners);

// Super Admin routes: full banner management
router.route("/all").get(isAuthenticated, checkRole("Super Admin"), getAllBanners);
router.route("/create").post(isAuthenticated, checkRole("Super Admin"), createBanner);
router.route("/delete/:id").delete(isAuthenticated, checkRole("Super Admin"), deleteBanner);
router.route("/toggle/:id").put(isAuthenticated, checkRole("Super Admin"), toggleBannerStatus);

export default router;
