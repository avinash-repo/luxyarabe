import express from "express";
import { authorizeAdmin } from "../../middlewares/auth.js";
import OnlinePaymentDiscountControllerObj from "../../controllers/admin/OnlinePaymentDiscountController.js";

const UserOnlinePaymentDiscountRoutes = express.Router();

UserOnlinePaymentDiscountRoutes.get("/get", OnlinePaymentDiscountControllerObj?.getData); //get only active



export default UserOnlinePaymentDiscountRoutes;


// async createOrderNetworkPayment(req, res) {
//     try {
//       const {
//         action,
//         currencyCode,
//         value,
//         user_address,
//         token_amount,
//         token_name,
//       } = req.body;

    //   if (action == null  action == undefined  typeof action !== "string") {
    //     return res
    //       .status(400)
    //       .json({ success: false, message: "action is required" });
    //   }

    //   if (req.body.currencyCode == null  req.body.currencyCode == undefined) {
    //     return res
    //       .status(400)
    //       .json({ success: false, message: "currency code is required" });
    //   }
    //   if (req.body.value == null  req.body.value == undefined) {
    //     return res
    //       .status(400)
    //       .json({ success: false, message: "amount value is required" });
    //   }
    //   if (typeof req.body.value !== "number") {
    //     return res
    //       .status(400)
    //       .json({ success: false, message: "amount value must be a number" });
    //   }
//       if (
//         user_address == null 
//         user_address == undefined 
//         user_address.trim() == ""
//       ) {
//         return res
//           .status(400)
//           .json({ success: false, message: "user address is required" });
//       }
//       if (token_amount == null  token_amount == undefined) {
//         return res
//           .status(400)
//           .json({ success: false, message: "token amount is required" });
//       }
//       if (
//         token_name == null 
//         token_name == undefined ||
//         token_name.trim() == ""
//       ) {
//         return res
//           .status(400)
//           .json({ success: false, message: "token name is required" });
//       }
    //   const { data } = await axios({
    //     method: "post",
    //     url: environmentVars.identityApiUrl,
    //     headers: {
    //       "Content-Type": "application/vnd.ni-identity.v1+json",
    //       Authorization: Basic ${environmentVars.networkGatewayApiKey},
    //     },
    //     data: {
    //       grant_type: "client_credentials",
    //       // realm: REALM,
    //     },
    //   });

//       const { access_token } = data;

//       // Create the order using the bearer token received from previous step and the order data received from client
//       // Refer docs for the possible fields available for order creation

    //   const { data: orderData } = await axios.post(
    //     environmentVars.networkGatewayApiUrl,
    //     {
    //       action: "PURCHASE",
    //       amount: { currencyCode: ${currencyCode}, value: ${value} },
    //       merchantAttributes: {
    //         redirectUrl: "https://uat-nftmarketplace.metaspacechain.com",
    //         skipConfirmationPage: false,
    //       },
    //     },
    //     {
    //       headers: {
    //         Authorization: Bearer ${access_token}, // Note the access_token received in the previous step is passed here
    //         "Content-Type": "application/vnd.ni-payment.v2+json",
    //         Accept: "application/vnd.ni-payment.v2+json",
    //       },
    //     }
    //   );
//       const paymentBuyData = new BuyTokenPaymentModel({
//         user_address: user_address,
//         amount: value,
//         currency: currencyCode,
//         token_amount: token_amount,
//         token_name: token_name,
//         transaction_status: "pending",
//         payment_status: "pending",
//         trans_ref: orderData?._embedded?.payment[0]?.orderReference,
//         trans_token: access_token,
//         payment_trans_id: orderData?._embedded?.payment[0]?.outletId,
//         is_payment_verified: false,
//       });
//       paymentBuyData
//         .save()
//         .then((responseSave) => {
//           return res
//             .status(200)
//             .json({ success: true, message: "order created", data: orderData });
//           // return res.status(200).json({ success: true, result: newJsonData });
//         })
//         .catch((errorSave) => {
//           return res
//             .status(500)
//             .json({ success: false, message: errorSave?.message });
//         });
//     } catch (err) {
//       return res.status(500).json({ success: false, message: err?.message });
//     }
//   }