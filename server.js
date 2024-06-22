import express from "express";
import cors from "cors";
import cron from "node-cron";
import { environmentVars } from "./src/config/environmentVar.js";
import UserRoutes from "./src/routes/user/UserRoutes.js";
import ProductRoutes from "./src/routes/user/ProductRoutes.js";
import AdminProductRoutes from "./src/routes/admin/ProductRoutes.js";
import cookieParser from "cookie-parser";
import path from "path";
import UISectionRoutes from "./src/routes/user/UISectionRoutes.js";
import UserAddressRoutes from "./src/routes/user/UserAddressRoutes.js";
import CurrencyRoutes from "./src/routes/user/CurrencyRoutes.js";
import AdminCurrencyRoutes from "./src/routes/admin/adminCurrencyRoute.js";
import WishlistRoutes from "./src/routes/user/WishlistRoutes.js";
import AdminUserRoutes from "./src/routes/admin/adminRoutes.js";
import CartRoutes from "./src/routes/user/CartRoutes.js";
import ContactUs from "./src/routes/user/ContactRoutes.js";
import CouponRoutes from "./src/routes/admin/CouponRoutes.js";
import AdminUISectionRoutes from "./src/routes/admin/UISectionRoutes.js";
import FilterProductRoutes from "./src/routes/user/FilterProductRoutes.js";
import UIInnerSectionRoutes from "./src/routes/user/UIInnerSectionRoutes.js";
import CategoryRoutes from "./src/routes/user/CategoryRoutes.js";
import OrderRoutes from "./src/routes/user/OrderRoutes.js";
import ProductReviewRoutes from "./src/routes/user/ProductReviewRoutes.js";

//admin
import AdminUIInnerSectionRoutes from "./src/routes/admin/UIInnerSectionRoutes.js";
import AdminCategoryRoutes from "./src/routes/admin/CategoryRoutes.js";
import PaymentOptionsRoutes from "./src/routes/user/PaymentOptionsRoutes.js";
import OrderAdminRoutes from "./src/routes/admin/OrderAdminRoutes.js";
import AdminReviewRoutes from "./src/routes/admin/AdminReviewRoutes.js";
import CouponRoutesUser from "./src/routes/user/CouponRoutes.js";
import PagesRoutes from "./src/routes/admin/PagesRoutes.js";
import UserPagesRoutes from "./src/routes/user/PagesRoutes.js";
import NewsletterRoutes from "./src/routes/user/NewsletterRoutes.js";
import ProductAvailabilityRoutesAdmin from "./src/routes/admin/ProductAvailabilityRoutesAdmin.js";
import ProductAvailabilityRoutes from "./src/routes/user/ProductAvailability.js";
import BestSellerRoutes from "./src/routes/admin/BestSellerRoutes.js";
import BestSellerUserRoutes from "./src/routes/user/BestSellerRoutes.js";
import PermissionMOduleReviewRoutes from "./src/routes/admin/PermissionModuleRoutes.js";
import DashboardDataRoutes from "./src/routes/admin/DashboardDataRoutes.js";
import OfferDataRoutes from "./src/routes/admin/OfferDataRoutes.js";
import UserOfferDataRoutes from "./src/routes/user/UserOfferDataRoutes.js";
import AdminRoleRoutes from "./src/routes/admin/adminRoleRoute.js";
import CountryDataRoutes from "./src/routes/user/CountryDataRoutes.js";
import BeautifulEyewearCollectionRoutes from "./src/routes/user/beautifulEyewearCollectionRoutes.js";
import BeautifulEyeWearAdminRouter from "./src/routes/admin/beautifulEyewearCollectionRoutes.js";
import AdminNewsletterRoutes from "./src/routes/admin/NewsletterRoutes.js";
import ApiEndpointRoutes from "./src/routes/admin/ApiEndpointRoutes.js";
import EducationInfoRoutes from "./src/routes/user/EducationInfoRoutes.js";
import UserSocialRoutes from "./src/routes/user/userSocialRoutes.js";
import AdminEducationInfoRoutes from "./src/routes/admin/EducationInfoRoutes.js";
import DeliveryRoutes from "./src/routes/user/DeliveryRoutes.js";
import AdminDeliveryRoutes from "./src/routes/admin/AdminDeliveryRoutes.js";
import FrameDataRoutes from "./src/routes/admin/FrameDataRoutes.js";
import OnlinePaymentDiscountRoutes from "./src/routes/admin/OnlinePaymentDiscountRoutes.js";
import UserOnlinePaymentDiscountRoutes from "./src/routes/user/OnlinePaymentDiscontRoutes.js";
import PaymentOptionRoutes from "./src/routes/admin/PaymentOptionRoutes.js";
import { google } from "googleapis";
import axios from "axios";
import OrderServicesObj from "./src/services/admin/OrderServices.js";
import OnlinePaymentOptionsRoutes from "./src/routes/admin/OnlinePaymentOptionRoutes.js";
import Router from "./src/routes/shippingRoutes.js";
import logisticRouter from "./src/routes/logistic/logisticRoutes.js";
import AdminFooterRoutes from "./src/routes/admin/FooterRoutes.js";
import FooterRoutes from "./src/routes/user/FooterRoutes.js";

// import orderRoutes from "./src/routes/user/orderRoutes.js";
// import { createRequire } from "module";
//in case we need to require anything
// const require = createRequire(import.meta.url);
// const http = require("http");

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express();
//set up cors
// app.use(cors("*"));
// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//making upload folder statically accessable
// app.use(express.static("uploads"));

app.use("/uploads", express.static("src/uploads"));
// app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

// Increase the JSON payload limit

app.use(express.json()); // Adjust the limit as needed
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Adjust the limit as needed
app.use(cookieParser());

// cron.schedule('* * * * * *', () => {//every second
// cron.schedule('*/10 * * * * *', () => {// 10 second
// cron.schedule('*/01 * * * *', () => {//1 minute
cron.schedule("*/30 * * * *", () => {
  //30 min
  OrderServicesObj?.handleCheckAndUpdateOrderPaymentStatus();
  console.log("Cron job is running every 30 minutes");
});

// Define the allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "https://vuezen.bastionex.net",
  "https://test-vuezen.bastionex.net",
  "https://admin-vuezen.bastionex.net",
  "https://test-admin-vuezen.bastionex.net",
  "https://vuezen.io",
  "https://www.vuezen.io",
  "https://admin.vuezen.io",
];

// Use the cors middleware with specific options
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["POST", "GET", "PUT", "REQUEST", "DELETE"],
    credentials: true,
  })
);
app.get("/", async (req, res) => {
  return res.status(200).send("Welcom to Vuezen");
});

//routes here like this => app.use('/user',userRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/product", ProductRoutes);
app.use("/api/ui", UISectionRoutes);
app.use("/api/user/user_address", UserAddressRoutes);
app.use("/api/category", CategoryRoutes);
app.use("/api/currency", CurrencyRoutes); // herer added validation in get
app.use("/api/wishlist", WishlistRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/contactus", ContactUs);
app.use("/api/payment", PaymentOptionsRoutes);
app.use("/api/collection", BeautifulEyewearCollectionRoutes);
app.use("/api/order", OrderRoutes);
app.use("/api/user/filter", FilterProductRoutes);
app.use("/api/user/ui_inner_section", UIInnerSectionRoutes);
app.use("/api/user/review", ProductReviewRoutes);
app.use("/api/user/coupons", CouponRoutesUser);
app.use("/api/user/pages", UserPagesRoutes);
app.use("/api/user/newsletter", NewsletterRoutes);
app.use("/api/user/zip_code", ProductAvailabilityRoutes);
app.use("/api/user/best_seller", BestSellerUserRoutes);
app.use("/api/user/offer", UserOfferDataRoutes);
app.use("/api/user/country", CountryDataRoutes);
app.use("/api/user/education", EducationInfoRoutes);
app.use("/api/social/user", UserSocialRoutes);
app.use("/api/user/delivery", DeliveryRoutes);
app.use("/api/user/online_payment_discount", UserOnlinePaymentDiscountRoutes);
app.use("/api/shipping", Router);
app.use("/api/user/footer", FooterRoutes);

// app.use("/")
// app.use("/api/user/ui",);

//admin routes
// app.use("/admin/api/product", AdminProductRoutes);
app.use("/api/admin/ui", AdminUISectionRoutes);
// ss
app.use("/api/admin/collection", BeautifulEyeWearAdminRouter);
app.use("/api/admin/ui_inner_section", AdminUIInnerSectionRoutes);
app.use("/api/admin/frame_data", FrameDataRoutes);
app.use("/admin/api/currency", AdminCurrencyRoutes);
app.use("/api/admin", AdminUserRoutes);
app.use("/api/admin/add_fiter_data", AdminCategoryRoutes); //category manage
app.use("/api/admin/product", AdminProductRoutes);
app.use("/api/admin/coupons", CouponRoutes);
app.use("/api/admin/order", OrderAdminRoutes);
app.use("/api/admin/review", AdminReviewRoutes);
app.use("/api/admin/pages", PagesRoutes);
app.use("/api/admin/newsletter", AdminNewsletterRoutes);
app.use("/api/admin/zip_code", ProductAvailabilityRoutesAdmin);
app.use("/api/admin/best_seller", BestSellerRoutes);
app.use("/api/admin/dashboard_data", DashboardDataRoutes); //working
app.use("/api/admin/offer", OfferDataRoutes);
app.use("/api/admin/education", AdminEducationInfoRoutes);
// app.use("/api/currency", currencyRoutes);

app.use("/api/admin/permission", PermissionMOduleReviewRoutes);
app.use("/api/admin/role", AdminRoleRoutes);
app.use("/api/admin/api_endpoint", ApiEndpointRoutes);
app.use("/api/admin/delivery", AdminDeliveryRoutes);
app.use("/api/admin/online_payment_discount", OnlinePaymentDiscountRoutes);
app.use("/api/admin/payment_option", PaymentOptionRoutes);
app.use("/api/admin/online_payment_option", OnlinePaymentOptionsRoutes);
app.use("/api/admin/footer", AdminFooterRoutes);

app.use("/api/v1", logisticRouter);
// Set up routes and testing route on '/'
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = environmentVars.port;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
