import nodemailer from "nodemailer";
import crypto from "crypto";
import { environmentVars } from "../config/environmentVar.js";

let transporter2 = nodemailer.createTransport({
  host: "mail.smtp2go.com",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.SMTP2GO_USER,
    pass: process.env.SMTP2GO_PASSWORD,
  },
});

// let transporter2 = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.AUTH_EMAIL,
//     pass: process.env.AUTH_PASS,
//   },
// });

// export async function sendPasswordViaEmail(res, data) {
//   try {
//     // console.log(data, "AAAAAAAAAAAAAAAAAAAAAAAAAA");
//     const mailOptions = {
//       from: process.env.AUTH_EMAIL,
//       to: data.email,
//       subject: "Welcome to Vuezen.com",
//       html: `
//           <head>
//           <style>
//               .container {
//                   width: 100%;
//                   max-width: 600px;
//                   margin: 0 auto;
//               }
//               .content {
//                 padding: 20px;
//             }
//               .header {
//                   background-color: #4CAF50;
//                   color: #ffffff;
//                   text-align: center;
//                   padding: 20px 0;
//               }
//           </style>
//       </head>
//       <body>
//           <div class="container">
//               <div class="header">
//                   <h1>Welcome to veuzen.com!</h1>
//                   </div>

//                   <div class="content">
//                   <p>Dear ${data?.name},</p>
//                   <p>We are thrilled to welcome you to the vuezen.com community!.</p>
//                   <p>Here is your Account Login password : ${data?.userPassword} </p>

//              </div>
//           <div class="footer">
//               <p>Regards, <br>The vuezen.com Team</p>
//           </div>

//           </div>
//           </body>
//           `,
//     };
//     res.status(201).json({
//       success: true,
//       statusCode:201,
//       message: "User create successfully , check mail for password",
//     });
//     await transporter2.sendMail(mailOptions);
//     return;
//   } catch (err) {
//     console.log(err, "Err");
//   }
// }
export async function sendPasswordViaEmail(res, data) {
  try {
    console.log(process.env.BACEKND_URL, "AAAAAAAAAAAAAAAAAA");
    let base_url = `${process.env.BACEKND_URL}/uploads/images`;
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: data.email,
      subject: "Welcome to Vuezen! Let's See the World in Style!",
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vuezen - Welcome Mail</title>
          <link href='http://fonts.googleapis.com/css?family=Lato:300,400,700&subset=latin-ext' rel='stylesheet' type='text/css'>
      </head>
      
      <body style="margin: 0; font-family: Lato;">
          <table style="width: 600px; background-color: rgb(255, 255, 255);margin: 0 auto; border-spacing: 0; border-collapse: collapse; box-shadow: 0px 0px 15px 7px #ebebeb70;">
              <tr style="text-align: center; background-color: #fff;">
                <td style="text-align: center;">
                <img src="${base_url}/logo.png"/>
                </td>
              </tr>
              <tr>
                  <td style="padding: 0px 40px; height: 260px; background-image:url('${base_url}/banner-back.png'); background-position: center top; background-size: cover; background-repeat: no-repeat;" >
                      <h1 style="text-align: left;color: #00C6FF;font-size: 36px;font-family: Lato; font-style: italic; font-weight: 700; padding: 0;margin: 0;">Hello ${data?.name},</h1>
                      <img src="${base_url}/under-lines.png" alt="underline">
                      <p style="text-align: left;color: #E6E6E6;font-family: Lato;font-weight: 700;font-size: 20px;padding-top: 5px;margin: 0;">Welcome to Vuezen, where vision meets style most spectacularly!</p>
                  </td>
              </tr>
              <tr>
                  <td style="text-align:center; padding-top: 20px;">
                    <div style="display: inline-flex;">
                      <div style="margin-right:30px; text-align: center;"><img src="${base_url}/women-circle.png" alt=""> <p style="margin-top: 5px; font-size: 16px; font-weight: 700;">
                      
                      <a href="${environmentVars?.live_url}" >Women</a> 
                      </p></div>
                      <div style="text-align: center;"><img src="${base_url}/men-circle.png" alt=""> <p style="margin-top: 5px; font-size: 16px; font-weight: 700;">
                      <a href="${environmentVars?.live_url}" >Men</a> 
                      </p></div>
                    </div>
                  </td>
              </tr>
              <tr>
                <td>
                <h3 style="color: #000;
                text-align: center;
                font-size: 20px;
                font-style: normal;
                font-weight: 400;
                margin-bottom: 25px;">Thanks for signing up.</h3>
                </td>
              </tr>
              <tr>
                <td>
                <h4 style="color: #000;
                text-align: center;
                font-size: 18px;
                font-style: italic;
                font-weight: 600;
                margin: 0;">Here’s your default password is <span style="color: #1170FF; font-weight: 700;">${data?.userPassword}</span></h4>
                </td>
              </tr>
            
              <tr>
                <td style="text-align:center">
                <h5 style="color: #000;
                text-align: center;
                font-size: 32px;
                font-style: normal;
                font-weight: 600;
                margin: 25px 0 0;">Find Your <span style="color:#00C6FF">Match</span></h5>
                </td>
              </tr>
      
              <tr>
                <td style="text-align:center">
                  <img style="padding-left:100px; width:30px" src="${base_url}/arrow.png">
                </td>
              </tr>

                <tr>
                  <td style="text-align:center">
                    <img src="${base_url}/find-img.png">
                  </td>
                </tr>

              <tr>
                <td style="text-align:center; background-color: #F1E0CD;padding-bottom: 20px;">
                  <div style="display: inline-block;
                  border-radius: 5px;
                  background: #032140;
                  color: #fff;
                  margin: 20px 0 20px;
                  text-transform: uppercase;
                  padding: 15px 35px;
                    ">
                    <a href="${environmentVars?.live_url}" style="color:#fff; text-decoration:none;"> Shop Now</a>                   
                  </div>
                </td>
              </tr>
      
              <tr>
                <td>
                  <h2 style="color: #000;
                  text-align: center;
                  font-size: 16px;
                  font-style: normal;
                  font-weight: 400;
                  padding: 20px 60px;">If you have any questions or need any help,don't hesitate to contact our support team!</h2>
                </td>
              </tr>

              <tr>
                  <td style="text-align:center">
                    <div style="display: inline-flex; margin-bottom: 20px;">
                      <img src="${base_url}/support-icon.png" alt="" style="text-align: center; width:40px; height:40px">
                      <div style="padding-left:10px;text-align: left;">
                          <h5 style="margin: 0; font-size: 18px; color: #000; font-weight: 400;">Contact us</h5>
                          <h5 style="margin: 0; font-size: 18px;color: #009CFF; font-weight: 400;">support@vuezen.io</h5>
                      </div>
                    </div>
                  </td>
              </tr>
             
      
              <tr>
                  <td style="background-color: #032140;padding: 40px 0px; text-align: center;">
                      <img src="${base_url}/white-logo.png">
                  </td>
              </tr>
          </table>
      </body>
      </html>`,
    };
    await transporter2.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error(err, "Err");
    return false;
  }
}

export async function forgotPasswordEmail(req, res, obj) {
  try {
    let base_url = "https://vuezen.b-cdn.net/logo/";
    let base_url1 = `${process.env.BACEKND_URL}/uploads/images`;
    console.log(obj, "obj", `${base_url1}/logo.png`);
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: obj.email,
      subject: "Reset Your Password!",

      html: `<!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset Request</title>
        </head>

        <body>
            <div style="margin:0;font-family: 'Lato', sans-serif;">
                <table
                    style="width:600px;background-color:rgb(255,255,255);margin:0 auto;border-spacing:0;border-collapse:collapse">
                    <tbody>
                        <tr style="text-align:center;background-color:#fff">
                        <td style="text-align: center;">
                          <img src="${base_url1}/logo.png"/>
                        </td>
                        </tr>
                        <tr>
                            <td
                                style="text-align: center; padding:20px 40px 30px;;height:260px;background-image:url('./img/banner-back.png');background-position:center top;background-size:cover;background-repeat:no-repeat; background: #F2F9FF;">
                                <h1
                                    style="text-align:center;color:#032140;font-size:32px;font-family: 'Lato', sans-serif;font-weight:700;padding:0;margin:0 0 25px;">
                                    Reset Your Password
                                </h1>
                                <img src="${base_url}lock.png" alt="underline" class="CToWUd" data-bit="iit">
                                <h1
                                    style="text-align:center;color:#009CFF;font-size:36px;font-family: 'Lato', sans-serif;font-style:italic;font-weight:700;padding:15px 0px 5px;margin:0">
                                    Hello ${obj?.name},</h1>
                                <p
                                    style="text-align:center;color:#032140;font-family: 'Lato', sans-serif;font-weight:400;font-size:14px;padding-top:10px;margin:0">
                                    You have requested to reset your password for Vuezen.io. 
                                </p>
                                <p
                                    style="text-align:center;color:#032140;font-family: 'Lato', sans-serif;font-weight:400;font-size:14px;padding-top:10px;margin:0">
                                    Please use the One-Time Password (OTP) below to proceed:
                                </p>
                                <h1
                                    style="text-align:center;color:#009CFF;font-size:32px;font-family: 'Lato', sans-serif;font-weight:800;padding:10px 0;;margin:0">
                                    ${obj?.otp_code} 
                                </h1>
                            </td>
                        </tr>


                        <tr>
                          <td style="text-align:center">
                            <img src="${base_url1}/find-img.png">
                          </td>
                        </tr>

                        <tr>
                          <td style="text-align:center; background-color: #F1E0CD;padding-bottom: 20px;">
                            <div style="display: inline-block;
                            border-radius: 5px;
                            background: #032140;
                            color: #fff;
                            margin: 20px 0 20px;
                            text-transform: uppercase;
                            padding: 15px 35px;
                              ">
                              <a href="${environmentVars?.live_url}" style="color:#fff; text-decoration:none;"> Shop Now</a>                   
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <h2 style="color: #000;
                            text-align: center;
                            font-size: 16px;
                            font-style: normal;
                            font-weight: 400;
                            padding: 20px 60px;">If you have any questions or need any help,don't hesitate to contact our support team!</h2>
                          </td>
                        </tr>
                        

                        <tr>
                          <td style="text-align:center">
                            <div style="display: inline-flex; margin-bottom: 20px;">
                              <img src="${base_url}/support-icon.png" alt="" style="text-align: center; width:40px; height:40px">
                              <div style="padding-left:10px;text-align: left;">
                                  <h5 style="margin: 0; font-size: 18px; color: #000; font-weight: 400;">Contact us</h5>
                                  <h5 style="margin: 0; font-size: 18px;color: #009CFF; font-weight: 400;">support@vuezen.io</h5>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td style="background-color: #032140;padding: 40px 0px; text-align: center;">
                              <img src="${base_url}/white-logo.png">
                          </td>
                        </tr>
                    </tbody>
                </table>
                <div class="yj6qo"></div>
                <div class="adL">
                </div>
            </div>
        </body>

        </html>`,
    };

    await transporter2.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
export async function sendOtpForlogin(req, res, obj) {
  try {
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: obj.email,
      subject: "Login Otp - vuezen",
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Otp for login account</title>
          <style>
              body {
                  font-family: 'Arial', sans-serif;
                  background: url('https://example.com/your-background-image.jpg') center/cover no-repeat;
                  margin: 0;
                  padding: 0;
                  height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
              }
              .container {
                  max-width: 600px;
                  background-color: rgba(255, 255, 255, 0.9);
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0 0 20px rgba(0,0,0,0.1);
              }
              h2 {
                  color: #007BFF;
              }
              p {
                  color: #555;
                  line-height: 1.6;
                  margin-bottom: 15px;
              }
              a {
                  display: inline-block;
                  padding: 12px 24px;
                  margin-top: 20px;
                  text-decoration: none;
                  color: #ffffff;
                  background-color: #007BFF;
                  border-radius: 5px;
                  transition: background-color 0.3s ease;
              }
              a:hover {
                  background-color: #0056b3;
              }
              .nn{
                color: #FFFFFF;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <p>Dear ${obj?.name},</p>
              <p>Otp is ${obj?.otp_code}</p>
              <p>Thank you for choosing vuezen. We appreciate your trust in our platform and are here to ensure you have a seamless experience.</p>
              <p>Sincerely,</p>
              <p>Vuezen</p>
          </div>
      </body>
      </html>
      `,
    };
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Otp sent to registered email",
    });
    try {
      await transporter2.sendMail(mailOptions);
    } catch (err) {
      console.error(err, "error occur");
    }
    return;
  } catch (error) {
    console.error(error);
    return res.json({
      status: "Failed",
      message: error.message,
    });
  }
}

export function encryptStringWithKey(text) {
  const password = btoa(text);
  console.log(password);
  return password;
}

export async function sendQueryMailToUser(res, data) {
  try {
    let base_url = "https://vuezen.b-cdn.net/logo/";
    let base_url1 = `${process.env.BACEKND_URL}/uploads/images`;
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: data.email,
      subject: "Thanks for contacting us!",
      html: `
      <!DOCTYPE html>
      <html lang="en">

      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
      </head>

        <body>
            <div style="margin:0;font-family: 'Lato', sans-serif;">
                <table
                    style="width:600px;background-color:rgb(255,255,255);margin:0 auto;border-spacing:0;border-collapse:collapse">
                    <tbody>
                        <tr style="text-align:center;background-color:#fff">
                            <td style="text-align:center">
                                <img src="${base_url1}/logo.png" class="CToWUd" data-bit="iit" style="margin: 5px 0;">
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center; padding:0px 40px;height: 200px;background: #F8F8F8;">
                                <h1
                                    style="text-align:center;color:#0059A6;font-size:36px;font-family: 'Lato', sans-serif;font-style:italic;font-weight:700;padding:0;margin:0">
                                    Hi ${data.name}
                                </h1>
                                <img src="${base_url}under-lines.png" alt="underline" class="CToWUd" data-bit="iit">
                                <p style="text-align:center;color:#474747;font-family: 'Lato', sans-serif;font-weight:400;font-size:16px;padding-top:10px;margin:0">
                                    Thanks for reaching out to Vuezen!
                                </p>
                                <p style="text-align:center;color:#474747;font-family: 'Lato', sans-serif;font-weight:400;font-size:16px;padding-top:10px;margin:0">
                                    We've received your query and our team is already working to get you the answers you need. Expect to hear from us real soon!
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="text-align:center;">
                                <h5
                                    style="color:#0b3765;text-align:center;font-size:18px;font-style:normal;font-weight:600;margin:25px 0 0; padding: 0 80px 20px;">
                                    In the meantime, why not check out our latest styles for some eyewear inspiration?</h5>
                            </td>
                        </tr>

                        <tr>
                          <td style="text-align:center">
                            <img src="${base_url1}/find-img.png">
                          </td>
                        </tr>

                        <tr>
                          <td style="text-align:center; background-color: #F1E0CD;padding-bottom: 20px;">
                            <div style="display: inline-block;
                            border-radius: 5px;
                            background: #032140;
                            color: #fff;
                            margin: 20px 0 20px;
                            text-transform: uppercase;
                            padding: 15px 35px;
                              ">
                              <a href="${environmentVars?.live_url}" style="color:#fff; text-decoration:none;"> Shop Now</a>                   
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <h2 style="color: #000;
                            text-align: center;
                            font-size: 16px;
                            font-style: normal;
                            font-weight: 400;
                            padding: 20px 60px;">If you have any questions or need any help,don't hesitate to contact our support team!</h2>
                          </td>
                        </tr>
                        

                        <tr>
                            <td style="text-align:center">
                              <div style="display: inline-flex; margin-bottom: 20px;">
                                <img src="${base_url}/support-icon.png" alt="" style="text-align: center; width:40px; height:40px">
                                <div style="padding-left:10px;text-align: left;">
                                    <h5 style="margin: 0; font-size: 18px; color: #000; font-weight: 400;">Contact us</h5>
                                    <h5 style="margin: 0; font-size: 18px;color: #009CFF; font-weight: 400;">support@vuezen.io</h5>
                                </div>
                              </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #032140;padding: 40px 0px; text-align: center;">
                                <img src="${base_url}/white-logo.png">
                            </td>
                        </tr>


                        
                    </tbody>
                </table>
                <div class="yj6qo"></div>
                <div class="adL">
                </div>
            </div>
        </body>

      </html>
      `,
    };
    await transporter2.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error(err, "Err");
    return false;
  }
}

export async function orderPlaceViaEmail(data, userData) {
  try {
    console.log(data, "123123123123", userData);
    // userData.email = "prabhat@bastionex.net";
    let base_url = "https://vuezen.b-cdn.net/logo/";
    let base_url1 = `${process.env.BACEKND_URL}/uploads/images`;
    function formatDate(inputDateString) {
      // Create a new Date object from the input string
      let inputDate = new Date(inputDateString);

      // Array of month names
      let monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Array of day names
      let dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      // Get the day, month, and year from the input date
      let day = inputDate.getDate();
      let month = monthNames[inputDate.getMonth()];
      let year = inputDate.getFullYear();
      let dayOfWeek = dayNames[inputDate.getDay()];

      // Construct the desired output string
      let outputString = dayOfWeek + ", " + month + " " + day + ", " + year;

      // Return the formatted date string
      return outputString;
    }

    let formattedDate = formatDate(data?.delivery_date);
    const getDiscountedPrice = (data) => {
      let discountPrice = 0;
      try {
  
        let priceArr = [];
        data?.variant_quantity.forEach((val) => {
          if (
            val?.findProductObj?.cat_id ==
              data?.couponObj?.category_id ||
            data?.couponObj?.category_id == null
          ) {
            const price = parseFloat(
              Number(val?.variantObj?.variant_price_details[0]?.price) -
                (Number(val?.variantObj?.variant_price_details[0]?.discount) *
                  Number(val?.variantObj?.variant_price_details[0]?.price)) /
                  100
            ).toFixed(2);
            for (let i = 0; i < val?.quantity; i++) {
              priceArr.push(price);
            }
          }
        });
        if (priceArr.length > 0) {
          priceArr.sort((a, b) => a - b);
        }
  
        for (let i = 0; i < data?.couponObj?.get_product; i++) {
          discountPrice += Number(priceArr[i]);
        }
        console.log("discooo",discountPrice)
        return Number(discountPrice)?.toFixed(2);
      } catch (err) {
        console.log(err);
        return 0;
      }
    };
    let couponPrice = 0;
    let total = 0;
    let student_discount_price = 0;
    
    let productsRows = "";
    for (let index = 0; index < data?.variant_quantity.length; index++) {
      const row = data?.variant_quantity[index];
      let individual_total_price = row?.product_price * row?.quantity
      total += row?.product_price * row?.quantity;
      
      if (data?.is_student_info_id) {
        if(row?.is_student){
          student_discount_price = ((Number(individual_total_price) * Number(row?.quantity))*data?.objDelivery?.discount)/100;
        }
      }
      productsRows += `
      <tr>
        <td style=" padding-bottom: 8px; color: #5E6470;"> ${
          row?.variant_name + " X " + row?.quantity
        } </td>
        <td style="text-align: right;  padding: 10px 0; color: #1A1C21; font-weight: 600;">
        ${data?.fetchTaxData?.currency_symbol}
        ${
          row?.product_price * row?.quantity
        }</td>
      
      
       
      </tr>
      <tr>

      </tr>
      `;
    }
    couponPrice =
    data?.couponObj?.type === "fixed"
      ? Number(data?.couponObj?.value)?.toFixed(2)
      : (Number(total) *
          Number(data?.couponObj?.value)) /
          100 || 0;
    


    let couponorstudentoffer = data?.couponObj?.type == "buy_get"
    ? getDiscountedPrice(data)
    : Number(couponPrice)?.toFixed(2)


   let tenpercentAmount = data?.payment_method
    .toLowerCase()
    .includes("cash")
    ? Number(total) - couponorstudentoffer- Number(student_discount_price) + Number(data?.delivery_charges)
    : ((Number(total) -
        couponorstudentoffer -
        Number(student_discount_price) +
        Number(data?.delivery_charges)) *
        data?.onlinePaymentData?.discount) /
      100;


    let grandAmount = !data?.payment_method
      .toLowerCase()
      .includes("cash")
      ? Number(total) -
        Number(couponorstudentoffer) -
        Number(student_discount_price) +
        Number(data?.delivery_charges) -
        Number(tenpercentAmount)
        
      : Number(total) -
        Number(student_discount_price) +
        Number(data?.delivery_charges) -
        Number(couponorstudentoffer)
    console.log("couponPrice",couponPrice,total,data?.delivery_charges,student_discount_price,tenpercentAmount,couponorstudentoffer,grandAmount)
    // ${(Number(data?.sub_total) +  Number(data?.delivery_charges))?.toFixed(2)}

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      // from: process.env.AUTH_FROM,
      to: userData.email,
      subject: "Order Confirmed: Vuezen is Clear as Day!",
      html: `
      <!DOCTYPE html>
      <html lang="en">

      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmed: Vuezen is Clear as Day!</title>
      </head>

      <body>
    <div style="margin:0;font-family: 'Lato', sans-serif;">
        <table
            style="width:600px;background-color:rgb(255,255,255);margin:0 auto;border-spacing:0;border-collapse:collapse">
            <tbody>
                <tr style="padding:8px 0;">
                    <td
                        style="text-align:center; background-color: #032140;padding:12px 0;color: #fff;font-family: 'Lato', sans-serif">
                        Unveil your signature look with Vuezen
                    </td>
                </tr>
                <tr style="text-align:center;background-color:#fff">
                    <td style="text-align:center; padding: 15px 0;">
                        <img src="${base_url1}/logo.png" class="CToWUd" data-bit="iit">
                    </td>
                </tr>
                <tr style="background-color: #e9e9e9;font-family: 'Lato', sans-serif; ">
                    <td style="text-align: center; padding:0; background-color: #F6F6F6;">
                        <div
                            style="text-align: center; padding:30px 40px; background-color: #032140; margin: 0 auto;">
                            <p
                                style="text-align:center;color:#fff;font-size:36px;font-style: italic;font-weight: 700; padding-bottom:25px;margin:0">
                                Hello ${userData?.name},</p>
                            <p style="text-align:center; color:#0faa0a;font-size:24px; padding-bottom:20px;margin:0">
                                <span> <img src="${base_url}green-tick.png"></span> Your Order is Confirmed!
                            </p>
                            <p style="text-align:center;color:#fff;font-size:16px;padding-bottom:25px;margin:0">
                            We're thrilled to inform you that your eyewear order is confirmed and all set to rock your world! Get ready to turn heads and make it spec-tacular wherever you go!
                            </p>
                            <p style="text-align:center;color:#fff;font-size:16px;padding-bottom:25px;margin:0">We will keep you updated about the shipping details.</p>
                        </div>
                    </td>
                </tr>
                <tr style="font-family: 'Lato', sans-serif;">
                    <td style="padding-left:20px;">
                        <h5 style="color:#000;text-align:left;font-size:20px;font-weight:600;margin-bottom:0; border-bottom: 1px solid #c4c4c4;padding-bottom: 10px;">
                            Order Information
                        </h5>
                        <p style="color:#000;font-size:16px;padding-top:25px;margin:0">
                            Order Id: <span style="color: #009CFF;font-size: 20px; font-weight: 700;">#${
                              data?.order_id
                            }</span>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="padding-left:20px; padding-top: 15px;">
                        <table style="width: 100%;">
                            <tbody>
                               
                               
                                <tr>
                                    <td
                                        style=" padding-bottom: 8px; color: #5E6470;">
                                        Delivery Date
                                    </td>
                                    <td
                                        style="text-align: right;  padding: 10px 0; color: #1A1C21; font-weight: 600;">
                                        ${formattedDate}
                                    </td>
                                </tr>
                               ${productsRows}

                               <tr>
                                    <td
                                        style=" padding-bottom: 8px; color: #5E6470;">
                                        Delivery Charges
                                    </td>
                                    <td
                                        style="text-align: right;  padding: 10px 0; color: #1A1C21; font-weight: 600;">
                                        ${data?.fetchTaxData?.currency_symbol}
                                        ${(
                                          Number(data?.delivery_charges)
                                        )?.toFixed(2)}
                                    </td>
                                </tr>
                                ${
                                  data?.is_student_info_id ?
                                 ` <tr>
                                    <td
                                        style="padding-bottom: 8px; color: #5E6470;">
                                        Discount
                                    </td>
                                    <td
                                        style="text-align: right;  padding: 10px 0; color: #1A1C21; font-weight: 600;">
                                        ${data?.fetchTaxData?.currency_symbol}
                                        ${Number(student_discount_price)?.toFixed(2)}
                                    </td>
                                  </tr>`:
                                  `<tr>
                                      <td
                                          style=" padding-bottom: 8px; color: #5E6470;">
                                          Discount
                                      </td>
                                      <td
                                          style="text-align: right;  padding: 10px 0; color: #1A1C21; font-weight: 600;">
                                          ${data?.fetchTaxData?.currency_symbol}
                                          ${(
                                            Number(couponorstudentoffer)
                                          )?.toFixed(2)}
                                      </td>
                                  </tr>`
                                
                                }

                                ${
                                  !data?.payment_method.toLowerCase().includes("cash")
                                    ? `<tr>
                              
                                    <td style=" padding-bottom: 8px; color: #5E6470;">
                                      Extra ${
                                        data?.onlinePaymentData?.discount
                                      }% discount on Debit/Credit Card
                                    </td>
                                    <td style="text-align: right;  padding: 10px 0; color: #1A1C21; font-weight: 600;">
                                    ${data?.fetchTaxData?.currency_symbol}
                                      ${Number(tenpercentAmount)?.toFixed(2)}
                                    </td>
                                </tr>`
                                    : ""
                                }

                                <tr>
                                    <td
                                        style=" padding-bottom: 8px; color: #5E6470;">
                                       ${data?.payment_method.toLowerCase().includes("cash") ? "Amount to be Paid": "Amount Paid"} 
                                    </td>
                                    <td
                                        style="text-align: right;  padding: 10px 0; color: #1A1C21; font-weight: 600;">
                                        ${data?.fetchTaxData?.currency_symbol}
                                        ${(Number(grandAmount))?.toFixed(2)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>

                <tr>
                <td style="padding-left:20px; padding-top: 15px;">
                    <table style="width: 100%;">
                        <tbody>
                    
                            <tr>
                                <td
                                    style="padding-bottom: 8px; color: #5E6470;">
                                    Your order sent to:
                                </td>
                            </tr>
                            <tr>
                                <td style="padding-bottom: 8px; color: #5E6470;">
                                    <h3 style="margin: 0;">${
                                      data?.addressData?.full_name
                                    }</h3>
                                    <p style="color:#000;font-size:16px;margin:0">
                                    ${
                                      data?.addressData?.house_no
                                        ?.length !== 0
                                        ? `${data?.addressData?.house_no},`
                                        : ""
                                    } ${data?.addressData?.address}, ${
                                            data?.addressData?.city
                                          } ${data?.addressData?.state} ${data?.addressData?.zipcode}, ${
                                            data?.addressData?.country
                                          }
                                     </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>



                <tr>
                <td style="text-align:center">
                <h5 style="color: #000;
                text-align: center;
                font-size: 32px;
                font-style: normal;
                font-weight: 600;
                margin: 25px 0 0;">Find Your <span style="color:#00C6FF">Match</span></h5>
                </td>
              </tr>
      
              <tr>
                <td style="text-align:center">
                  <img style="padding-left:100px; width:30px" src="${base_url}/arrow.png">
                </td>
              </tr>

              <tr>
                <td style="text-align:center">
                  <img src="${base_url1}/find-img.png">
                </td>
              </tr>

              <tr>
                <td style="text-align:center; background-color: #F1E0CD;padding-bottom: 20px;">
                  <div style="display: inline-block;
                  border-radius: 5px;
                  background: #032140;
                  color: #fff;
                  margin: 20px 0 20px;
                  text-transform: uppercase;
                  padding: 15px 35px;
                    ">
                    <a href="${
                      environmentVars?.live_url
                    }" style="color:#fff; text-decoration:none;"> Shop Now</a>                   
                  </div>
                </td>
              </tr>



                    <tr>
                      <td>
                        <h2 style="color: #000;
                        text-align: center;
                        font-size: 16px;
                        font-style: normal;
                        font-weight: 400;
                        padding: 20px 60px;">If you have any questions or need any help,don't hesitate to contact our support team!</h2>
                      </td>
                    </tr>
      
                    <tr>
                      <td style="text-align:center">
                          <div style="display: inline-flex; margin-bottom: 20px;">
                            <img src="${base_url}/support-icon.png" alt="" style="text-align: center; width:40px; height:40px">
                            <div style="padding-left:10px;text-align: left;">
                                <h5 style="margin: 0; font-size: 18px; color: #000; font-weight: 400;">Contact us</h5>
                                <h5 style="margin: 0; font-size: 18px;color: #009CFF; font-weight: 400;">support@vuezen.io</h5>
                            </div>
                          </div>
                        </td>
                    </tr>
                    <tr>
                      <td style="background-color: #032140;padding: 40px 0px; text-align: center;">
                        <img src="${base_url}/white-logo.png">
                      </td>
                    </tr>
                  

        
             



            </tbody>
        </table>
        <div class="yj6qo"></div>
        <div class="adL">
        </div>
    </div>
    </body>

    </html>
`,
    };

    await transporter2.sendMail(mailOptions);
    // await transporter2.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error(err);
    return false;
    console.log(err, "Err");
  }
}

export async function updateOrderPaymentViaEmail(data, userData) {
  try {
    console.log(data, "AAAAAAAAAAA23333333$$$$$$AA", userData);
    // return
    // userData.email="prabhat@bastionex.net"
    let base_url = "https://vuezen.b-cdn.net/logo/";
    let base_url1 = `${process.env.BACEKND_URL}/uploads/images`;
    function formatDate(inputDateString) {
      // Create a new Date object from the input string
      let inputDate = new Date(inputDateString);

      // Array of month names
      let monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Array of day names
      let dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      // Get the day, month, and year from the input date
      let day = inputDate.getDate();
      let month = monthNames[inputDate.getMonth()];
      let year = inputDate.getFullYear();
      let dayOfWeek = dayNames[inputDate.getDay()];

      // Construct the desired output string
      let outputString = dayOfWeek + ", " + month + " " + day + ", " + year;

      // Return the formatted date string
      return outputString;
    }

    let formattedDate = formatDate(data?.delivery_date);
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: userData.email,
      subject: "Vuezen - Order confirmation",
      // html: `
      //   <!DOCTYPE html>
      //   <html lang="en">
      //   <head>
      //     <meta charset="UTF-8">
      //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
      //     <title>Order Payment Status</title>
      //     <style>
      //       body {
      //         font-family: Arial, sans-serif;
      //         margin: 0;
      //         padding: 0;
      //         background-color: #f4f4f4;
      //       }
      //       .container {
      //         width: 100%;
      //         max-width: 600px;
      //         margin: 0 auto;
      //       }
      //       .header {
      //         background-color: #4CAF50;
      //         color: #ffffff;
      //         text-align: center;
      //         padding: 20px 0;
      //       }
      //       .content {
      //         padding: 20px;
      //       }
      //       .product {
      //         margin-bottom: 20px;
      //         padding: 15px;
      //         background-color: #fff;
      //         border: 1px solid #ddd;
      //         box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      //       }
      //       .footer {
      //         padding: 20px;
      //         background-color: #4CAF50;
      //         color: #ffffff;
      //         text-align: center;
      //       }
      //     </style>
      //   </head>
      //   <body>
      //     <div class="container">
      //       <div class="header">
      //         <h1>Order Payment Status</h1>
      //       </div>

      //       <div class="content">
      //         <p>Dear ${userData?.name},</p>
      //         <h2>Your Order Payment status : ${data?.payment_status} </h2>
      //       </div>
      //       <div class="footer">
      //         <p>Regards, <br>The Vuezen.com Team</p>
      //       </div>
      //     </div>
      //   </body>
      //   </html>
      // `,
      html: `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Vuezen - Order confirmation</title>
        </head>

        <body>
      <div style="margin:0;font-family: 'Lato', sans-serif;">
          <table
              style="width:600px;background-color:rgb(255,255,255);margin:0 auto;border-spacing:0;border-collapse:collapse">
              <tbody>
                  <tr style="padding:8px 0;">
                      <td
                          style="text-align:center; background-color: #032140;padding:12px 0;color: #fff;font-family: 'Lato', sans-serif">
                          Unveil your signature look with Vuezen
                      </td>
                  </tr>
                  <tr style="text-align:center;background-color:#fff">
                      <td style="text-align:center; padding: 15px 0;">
                          <img src="${base_url1}/logo.png" class="CToWUd" data-bit="iit">
                      </td>
                  </tr>
                  <tr style="background-color: #e9e9e9;font-family: 'Lato', sans-serif; ">
                      <td style="text-align: center; padding:0; background-color: #F6F6F6;">
                          <div
                              style="text-align: center; padding:30px 40px; background-color: #032140; margin: 0 auto;">
                              <p
                                  style="text-align:center;color:#fff;font-size:36px;font-style: italic;font-weight: 700; padding-bottom:25px;margin:0">
                                  Hello ${userData?.name},</p>
                              <p style="text-align:center; color:#0faa0a;font-size:24px; padding-bottom:20px;margin:0">
                                  <span> <img src="${base_url}green-tick.png"></span> Your Order is Confirmed!
                              </p>
                              <p style="text-align:center;color:#fff;font-size:16px;padding-bottom:25px;margin:0">
                                  Thank you for your purchase. This email is to confirm your order with Vuezen. while we get your order ready please double check the details below and let us know if anything needs changing.
                              </p>
                              <p style="text-align:center;color:#fff;font-size:16px;padding-bottom:25px;margin:0">We will keep you updated about the shipping details.</p>
                          </div>
                      </td>
                  </tr>
                  <tr style="font-family: 'Lato', sans-serif;">
                      <td style="padding-left:20px;">
                          <h5 style="color:#000;text-align:left;font-size:20px;font-weight:600;margin-bottom:0; border-bottom: 1px solid #c4c4c4;padding-bottom: 10px;">
                              Order Information
                          </h5>
                          <p style="color:#000;font-size:16px;padding-top:25px;margin:0">
                              Order Id: <span style="color: #009CFF;font-size: 20px; font-weight: 700;">#${
                                data?.order_id
                              }</span>
                          </p>
                      </td>
                  </tr>
                  <tr>
                      <td style="padding-left:20px; padding-top: 15px;">
                          <table style="width: 100%;">
                              <tbody>
                                
                                
                                  <tr>
                                      <td
                                          style=" padding-bottom: 8px; color: #5E6470;">
                                          Order Date
                                      </td>
                                      <td
                                          style="text-align: right;  padding: 10px 0; color: #1A1C21; font-weight: 600;">
                                          ${formattedDate}
                                      </td>
                                  </tr>
                                  <tr>
                                      <td
                                          style=" padding-bottom: 8px; color: #5E6470;">
                                          ${data?.payment_method.toLowerCase().includes("cash") ? "Amount to be Paid": "Amount Paid"} 
                                      </td>
                                      <td
                                          style="text-align: right;  padding: 10px 0; color: #1A1C21; font-weight: 600;">
                                          ${(
                                            Number(data?.sub_total) +
                                            Number(data?.delivery_charges)
                                          )?.toFixed(2)}
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>

                  <tr>
                <td style="text-align:center">
                <h5 style="color: #000;
                text-align: center;
                font-size: 32px;
                font-style: normal;
                font-weight: 600;
                margin: 25px 0 0;">Find Your <span style="color:#00C6FF">Match</span></h5>
                </td>
              </tr>
      
              <tr>
                <td style="text-align:center">
                  <img style="padding-left:100px; width:30px" src="${base_url}/arrow.png">
                </td>
              </tr>

              <tr>
                <td style="text-align:center">
                  <img src="${base_url}/find-img.png">
                </td>
              </tr>

              <tr>
                <td style="text-align:center; background-color: #F1E0CD;padding-bottom: 20px;">
                  <div style="display: inline-block;
                  border-radius: 5px;
                  background: #032140;
                  color: #fff;
                  margin: 20px 0 20px;
                  text-transform: uppercase;
                  padding: 15px 35px;
                    ">
                    <a href="${
                      environmentVars?.live_url
                    }" style="color:#fff; text-decoration:none;"> Shop Now</a>                   
                  </div>
                </td>
              </tr>



                  <tr>
                        <td>
                          <h2 style="color: #000;
                          text-align: center;
                          font-size: 20px;
                          font-style: normal;
                          font-weight: 400;
                          padding: 20px 60px;">If you have any questions or need any help,don't hesitate to contact our support team!</h2>
                        </td>
                      </tr>
        
                      <tr>
                          <td style="text-align:center">
                            <div style="display: inline-flex; margin-bottom: 20px;">
                              <img src="${base_url}/support-icon.png" alt="" style="text-align: center; width:40px; height:40px">
                              <div style="padding-left:10px;text-align: left;">
                                  <h5 style="margin: 0; font-size: 18px; color: #000; font-weight: 400;">Customer Service Department</h5>
                                  <h5 style="margin: 0; font-size: 18px;color: #009CFF; font-weight: 400;">support@vuezen.io</h5>
                              </div>
                            </div>
                          </td>
                      </tr>
                      <tr>
                          <td style="text-align:center">
                            <div style="display: inline-flex; margin-bottom: 20px;">
                              <img src="${base_url}/support-icon.png" alt="" style="text-align: center; width:40px; height:40px">
                              <div style="padding-left:10px;text-align: left;">
                                  <h5 style="margin: 0; font-size: 18px; color: #000; font-weight: 400;">Complaints & Suggestions</h5>
                                  <h5 style="margin: 0; font-size: 18px;color: #009CFF; font-weight: 400;">Complaints@vuezen.com</h5>
                              </div>
                            </div>
                          </td>
                      </tr>
                      <tr>
                          <td style="text-align:center">
                            <div style="display: inline-flex; margin-bottom: 20px;">
                              <img src="${base_url}/support-icon.png" alt="" style="text-align: center; width:40px; height:40px">
                              <div style="padding-left:10px;text-align: left;">
                                  <h5 style="margin: 0; font-size: 18px; color: #000; font-weight: 400;">Call: +1 (121) 253-542</h5>
                                  <h5 style="margin: 0; font-size: 18px;color: #009CFF; font-weight: 400;">24*7</h5>
                              </div>
                            </div>
                          </td>
                      </tr>

          
                  <tr>
                      <td style="background-color: #032140;padding-top: 40px; text-align: center;">
                          <img src="${base_url}white-logo.png">
                      </td>
                  </tr>



              </tbody>
          </table>
          <div class="yj6qo"></div>
          <div class="adL">
          </div>
      </div>
      </body>

      </html>
    `,
    };

    await transporter2.sendMail(mailOptions);
    return;
  } catch (err) {
    console.error(err, "Err");
  }
}

//itself user can  cancel his order
export async function cancelOrder(userdata, orderData, fetchAddress) {
  try {
    // console.log(orderData?.cancelledItems,"orderdata",orderData);
    // userdata.email="prabhat@bastionex.net"
    // return

    let base_url = "https://vuezen.b-cdn.net/logo/";
    let base_url1 = `${process.env.BACEKND_URL}/uploads/images`;
    function formatDate(inputDateString) {
      // Create a new Date object from the input string
      let inputDate = new Date(inputDateString);

      // Array of month names
      let monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Array of day names
      let dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      // Get the day, month, and year from the input date
      let day = inputDate.getDate();
      let month = monthNames[inputDate.getMonth()];
      let year = inputDate.getFullYear();
      let dayOfWeek = dayNames[inputDate.getDay()];

      // Construct the desired output string
      let outputString = dayOfWeek + ", " + month + " " + day + ", " + year;

      // Return the formatted date string
      return outputString;
    }

    var formattedDate = formatDate(orderData?.delivery_date);

    const mailOptions = {
      // from: process.env.AUTH_EMAIL,

      from: environmentVars.authEmail,

      to: userdata?.email,
      subject: "Sad to see you go;(",
      html: `<!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sad to see you go;(</title>
      </head>
      
      <body>
          <div style="margin:0;font-family: 'Lato', sans-serif;">
              <table
                  style="width:600px;background-color:rgb(255,255,255);margin:0 auto;border-spacing:0;border-collapse:collapse">
                  <tbody>
                      <tr style="padding:8px 0;">
                          <td
                              style="text-align:center; background-color: #032140;padding:12px 0;color: #fff;font-family: 'Lato', sans-serif">
                              Unveil your signature look with Vuezen
                          </td>
                      </tr>
                      <tr style="text-align:center;background-color:#fff">
                          <td style="text-align:center; padding: 15px 0;">
                              <img src="${base_url1}/logo.png" class="CToWUd" data-bit="iit">
                          </td>
                      </tr>
                      <tr style="background-color: #e9e9e9;font-family: 'Lato', sans-serif; ">
                          <td style="text-align: center; padding:0; background-color: #F6F6F6;">
                              <div
                                  style="text-align: center; padding:30px 40px; background-color: #032140; margin: 0 auto;">
                                  <p
                                      style="text-align:center;color:#fff;font-size:36px;font-style: italic;font-weight: 700; padding-bottom:25px;margin:0">
                                      Hello ${userdata?.name},</p>
                                      <p style="text-align:center; color:#d90f23;font-size:24px; padding-bottom:20px;margin:0">
                                          <span> <img src="${base_url}red-tick.png"></span> Order cancelled
                                  </p>
                                  <p style="text-align:center;color:#fff;font-size:16px;padding-bottom:25px;margin:0">
                                    As per your request, your recent eyewear order has been canceled.
                                  </p>
                              </div>
                          </td>
                      </tr>
                      <tr style="font-family: 'Lato', sans-serif;">
                          <td style="padding-left:20px;">
                              <h5 style="color:#000;text-align:left;font-size:20px;font-weight:600;margin-bottom:0">
                                  Order summary
                              </h5>
                          </td>
                      </tr>
                      <tr>
                          <td style="padding-left:20px; padding-top: 15px;">
                              <table style="width: 100%;">
                                  <tbody>
                                      <tr>
                                          <td
                                              style="border-bottom: 0.5px solid #D7DAE0; padding-bottom: 8px; color: #5E6470;">
                                              Order Id:<span style="color: #009CFF;font-size: 20px; font-weight: 700;">#${
                                                orderData?.order_id
                                              }</span>
                                          </td>
                                      </tr>
                                      <tr>
                                        <td
                                            style=" padding-bottom: 8px; color: #5E6470;">
                                            Delivery Date
                                        </td>
                                        <td
                                            style="text-align: right;  padding: 10px 0; color: #1A1C21; font-weight: 600;">
                                            ${formattedDate}
                                        </td>
                                      </tr>                 
                                      <tr>
                                          <td
                                              style="padding-bottom: 8px; color: #5E6470;">
                                              Your order sent to:
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="padding-bottom: 8px; color: #5E6470;">
                                              <h3 style="margin: 0;">${
                                                userdata?.name
                                              }</h3>
                                              <p style="color:#000;font-size:16px;margin:0">
                                              ${
                                                fetchAddress?.house_no
                                                  ?.length !== 0
                                                  ? `${fetchAddress?.house_no},`
                                                  : ""
                                              }, ${fetchAddress?.address},${
                                                fetchAddress?.city
                                              } ${fetchAddress?.state}${fetchAddress?.zipcode}, ${fetchAddress?.country}
                                              </p>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </td>
                      </tr>
      
              
                      <tr>
                        <td style="text-align:center">
                          <img src="${base_url1}/find-img.png">
                        </td>
                      </tr>
      
      
      
                      <tr>
                        <td style="text-align:center; background-color: #F1E0CD;padding-bottom: 20px;">
                          <div style="display: inline-block;
                          border-radius: 5px;
                          background: #032140;
                          color: #fff;
                          margin: 20px 0 20px;
                          text-transform: uppercase;
                          padding: 15px 35px;
                            ">
                            <a href="${
                              environmentVars?.live_url
                            }" style="color:#fff; text-decoration:none;"> Shop Now</a>                   
                          </div>
                        </td>
                      </tr>
      
                    <tr>
                      <td>
                        <h2 style="color: #000;
                        text-align: center;
                        font-size: 16px;
                        font-style: normal;
                        font-weight: 400;
                        padding: 20px 60px;">If you have any questions or need any help,don't hesitate to contact our support team!</h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="text-align:center">
                          <div style="display: inline-flex; margin-bottom: 20px;">
                            <img src="${base_url}/support-icon.png" alt="" style="text-align: center; width:40px; height:40px">
                            <div style="padding-left:10px;text-align: left;">
                                <h5 style="margin: 0; font-size: 18px; color: #000; font-weight: 400;">Contact us</h5>
                                <h5 style="margin: 0; font-size: 18px;color: #009CFF; font-weight: 400;">support@vuezen.io</h5>
                            </div>
                          </div>
                        </td>
                    </tr>
                       

              
                  <tr>
                    <td style="background-color: #032140;padding: 40px 0px; text-align: center;">
                      <img src="${base_url}/white-logo.png">
                    </td>
                  </tr>
      
      
      
                  </tbody>
              </table>
              <div class="yj6qo"></div>
              <div class="adL">
              </div>
          </div>
      </body>
      
      </html>`,
    };
    try {
      await transporter2.sendMail(mailOptions);
    } catch (err) {
      console.error(err, "error occur");
    }
    return;
  } catch (error) {
    console.error(error);
    // return res.json({
    //   status: "Failed",
    //   message: error.message,
    // });
  }
}

// changeDeliveryDate by admin
export async function changeDeliveryDate(data) {
  try {
    // console.log(data, "userdata", "orderdata");
    // data.emailData.email = "rathorejee074@gmail.com";
    // console.log(data, "userdata", "orderdata");
    // return
    const mailOptions = {
      // from: process.env.AUTH_EMAIL,
      from: environmentVars.authEmail,
      to: data?.emailData?.email,
      subject: "Order delivery date changed",
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order delivery date changed</title>
          <style>
              body {
                  font-family: 'Arial', sans-serif;
                  margin: 0;
                  padding: 0;
                  height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
              }
              .container {
                  max-width: 600px;
                  background-color: rgba(255, 255, 255, 0.9);
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0 0 20px rgba(0,0,0,0.1);
              }
              h2 {
                  color: #007BFF;
              }
              p {
                  color: #555;
                  line-height: 1.6;
                  margin-bottom: 15px;
              }
              a {
                  display: inline-block;
                  padding: 12px 24px;
                  margin-top: 20px;
                  text-decoration: none;
                  color: #ffffff;
                  background-color: #007BFF;
                  border-radius: 5px;
                  transition: background-color 0.3s ease;
              }
              a:hover {
                  background-color: #0056b3;
              }
              .nn{
                color: #FFFFFF;
              }
          </style>
      </head>
      <body>
          <div class="container">
          <h2>Delivery date changed </h2>
              <p>Dear ${data?.emailData?.name},</p>
              <p class="cancel-message">Your order delivery date has been changed.</p>
              <ul>
              <li>Delivery date: ${new Date(
                data?.delivery_date
              )?.toDateString()}</li>
              <li>Shipping date: ${new Date(
                data?.shipping_date
              )?.toDateString()}</li>
              <li>Out for delivery date: ${new Date(
                data?.out_for_delivery_date
              )?.toDateString()}</li>
          </ul>
              <p>We apologize for any inconvenience this may have caused. If you have any questions or concerns, please contact our support team.</p>
              <p>Thank you for choosing vuezen. We appreciate your understanding.</p>
              <p>Sincerely,</p>
              <p>Vuezen</p>
          </div>
      </body>
      </html>
      `,
    };
    try {
      await transporter2.sendMail(mailOptions);
    } catch (err) {
      console.error(err, "error occur");
    }
    return;
  } catch (error) {
    console.error(error);
    // return res.json({
    //   status: "Failed",
    //   message: error.message,
    // });
  }
}
//change order status
export async function changeOrderStatus(data, findOrder, fetchAddress) {
  try {
    console.log(data, "userdata", "orderdata",findOrder);
    let base_url = "https://vuezen.b-cdn.net/logo/";
    let base_url1 = `${process.env.BACEKND_URL}/uploads/images`;

    function formatDate(inputDateString) {
      // Create a new Date object from the input string
      let inputDate = new Date(inputDateString);

      // Array of month names
      let monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Array of day names
      let dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      // Get the day, month, and year from the input date
      let day = inputDate.getDate();
      let month = monthNames[inputDate.getMonth()];
      let year = inputDate.getFullYear();
      let dayOfWeek = dayNames[inputDate.getDay()];

      // Construct the desired output string
      let outputString = dayOfWeek + ", " + month + " " + day + ", " + year;

      // Return the formatted date string
      return outputString;
    }

    var formattedDate = formatDate(findOrder?.delivery_date);
    const getDiscountedPrice = (findOrder) => {
      let discountPrice = 0;
      try {
  
        let priceArr = [];
        findOrder?.variant_quantity.forEach((val) => {
          if (
            val?.findProductObj?.cat_id ==
              findOrder?.couponObj?.category_id ||
            findOrder?.couponObj?.category_id == null
          ) {
            const price = parseFloat(
              Number(val?.variantObj?.variant_price_details[0]?.price) -
                (Number(val?.variantObj?.variant_price_details[0]?.discount) *
                  Number(val?.variantObj?.variant_price_details[0]?.price)) /
                  100
            ).toFixed(2);
            for (let i = 0; i < val?.quantity; i++) {
              priceArr.push(price);
            }
          }
        });
        if (priceArr.length > 0) {
          priceArr.sort((a, b) => a - b);
        }
  
        for (let i = 0; i < findOrder?.couponObj?.get_product; i++) {
          discountPrice += Number(priceArr[i]);
        }
        console.log("discooo",discountPrice)
        return Number(discountPrice)?.toFixed(2);
      } catch (err) {
        console.log(err);
        return 0;
      }
    };
    let couponPrice = 0;
    let total = 0;
    let student_discount_price = 0;

    let productsRows = "";
    for (let index = 0; index < findOrder?.variant_quantity.length; index++) {
      const row = findOrder?.variant_quantity[index];
      let individual_total_price = row?.product_price * row?.quantity
      total += row?.product_price * row?.quantity;
      
      if (findOrder?.is_student_info_id) {
        if(row?.is_student){
          student_discount_price = ((Number(individual_total_price) * Number(row?.quantity))*data?.objDelivery?.discount)/100;
        }
      }
      productsRows += `
      <tr>
        <td style=" padding-bottom: 8px; color: #5E6470;"> ${
          row?.variant_name + " X " + row?.quantity
        } </td>
        <td style="text-align: right;  padding: 10px 0; color: #1A1C21; font-weight: 600;">
        ${findOrder?.fetchTaxData?.currency_symbol}
        ${
          row?.product_price * row?.quantity
        }</td>
      
      
       
      </tr>
      <tr>

      </tr>
      `;
    }
    couponPrice =
    findOrder?.couponObj?.type === "fixed"
      ? Number(findOrder?.couponObj?.value)?.toFixed(2)
      : (Number(total) *
          Number(findOrder?.couponObj?.value)) /
          100 || 0;
    


    let couponorstudentoffer = findOrder?.couponObj?.type == "buy_get"
    ? getDiscountedPrice(findOrder)
    : Number(couponPrice)?.toFixed(2)


   let tenpercentAmount = findOrder?.payment_method
    .toLowerCase()
    .includes("cash")
    ? Number(total) - couponorstudentoffer- Number(student_discount_price) + Number(findOrder?.delivery_charges)
    : ((Number(total) -
        couponorstudentoffer -
        Number(student_discount_price) +
        Number(findOrder?.delivery_charges)) *
        findOrder?.onlinePaymentData?.discount) /
      100;


    let grandAmount = !findOrder?.payment_method
      .toLowerCase()
      .includes("cash")
      ? Number(total) -
        Number(couponorstudentoffer) -
        Number(student_discount_price) +
        Number(findOrder?.delivery_charges) -
        Number(tenpercentAmount)
        
      : Number(total) -
        Number(student_discount_price) +
        Number(findOrder?.delivery_charges) -
        Number(couponorstudentoffer)
    console.log("couponPrice",couponPrice,total,findOrder?.delivery_charges,student_discount_price,tenpercentAmount,couponorstudentoffer,grandAmount,"oo",findOrder?.couponObj)
    // ${(Number(findOrder?.sub_total) +  Number(findOrder?.delivery_charges))?.toFixed(2)}


    let mailOptions;
    if (data?.status == "processing") {
      mailOptions = {
        // from: process.env.AUTH_EMAIL,
        from: environmentVars.authEmail,
        to: data?.emailData?.email,
        subject: "Your order is shipped!",
        html: `
        <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>

    <body>
    <div style="margin:0;font-family: 'Lato', sans-serif;">
        <table
            style="width:600px;background-color:rgb(255,255,255);margin:0 auto;border-spacing:0;border-collapse:collapse">
            <tbody>
                <tr style="padding:8px 0;">
                    <td
                        style="text-align:center; background-color: #032140;padding:12px 0;color: #fff;font-family: 'Lato', sans-serif">
                        Unveil your signature look with Vuezen
                    </td>
                </tr>
                <tr style="text-align:center;background-color:#fff">
                    <td style="text-align:center; padding: 15px 0;">
                        <img src="${base_url1}/logo.png" class="CToWUd" data-bit="iit">
                    </td>
                </tr>
                <tr style="background-color: #e9e9e9;font-family: 'Lato', sans-serif; padding:50px;">
                    <td style="text-align: center; padding:50px 40px; background-color: #F6F6F6;">
                        <div
                            style="text-align: center; padding:50px 40px; background-color: #032140;  margin: 0 auto;">
                            <p
                                style="text-align:center;color:#fff;font-size:36px;font-style: italic;font-weight: 700; padding-bottom:25px;margin:0">
                                Hello ${data?.emailData?.name},</p>
                            <p style="text-align:center; color:#4FB43E;font-size:24px; padding-bottom:20px;margin:0">
                                <span> <img src="${base_url}green-tick.png"></span> Your order is shipped!
                            </p>
                            <p style="text-align:center;color:#fff;font-size:16px;padding-bottom:25px;margin:0">
                              Congratulations, your order has been shipped. <br /> 
                              Can’t wait to see your selfies in our latest collection. 
                            </p>
                        </div>
                    </td>
                </tr>
                <tr style="font-family: 'Lato', sans-serif;">
                    <td style="padding-left:20px;">
                        <h5 style="color:#000;text-align:left;font-size:20px;font-weight:600;margin-bottom:0">
                            Shipping Confirmation
                        </h5>
                    </td>
                </tr>
                <tr>
                    <td style="padding-left:20px; padding-top: 15px; padding-bottom: 10px;">
                        <table style="width: 100%;">
                            <tbody>
                                <tr>
                                    <td
                                        style="padding-bottom: 8px; color: #5E6470;">

                                        <p style="color:#000;font-size:16px;padding-top:25px;margin:0">
                                            Order Id: <span
                                                style="color: #009CFF;font-size: 20px; font-weight: 700;">#${
                                                  data?.order_id
                                                }</span>
                                        </p>                                      
                                     
                                    </td>                               
                                </tr>
                                <tr>
                                <td
                                    style=" padding-bottom: 8px; color: #5E6470;">
                                    Delivery Date
                                </td>
                                <td
                                    style="text-align: right;  padding: 10px 0; color: #1A1C21; font-weight: 600;">
                                    ${formattedDate}
                                </td>
                              </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
              
                <tr>
                <td style="padding-left:20px; padding-top: 5px;">
                    <table style="width: 100%;">
                        <tbody>
                    
                            <tr>
                                <td
                                    style="padding-bottom: 8px; color: #5E6470;">
                                    Your order sent to:
                                </td>
                            </tr>
                            <tr>
                                <td style="padding-bottom: 8px; color: #5E6470;">
                                    <h3 style="margin: 0;">${
                                      fetchAddress?.full_name
                                    }</h3>
                                    <p style="color:#000;font-size:16px;margin:0">
                                    ${
                                      fetchAddress?.house_no
                                        ?.length !== 0
                                        ? `${fetchAddress?.house_no},`
                                        : ""
                                    } ${fetchAddress?.address},${
                                            fetchAddress?.city
                                          } ${fetchAddress?.state}${fetchAddress?.zipcode}, ${
                                            fetchAddress?.country
                                          }
                                     </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
                <tr>
                  <td style="text-align:center">
                    <img src="${base_url1}/find-img.png">
                  </td>
                </tr>
                <tr>
                  <td style="text-align:center; background-color: #F1E0CD;padding-bottom: 20px;">
                    <div style="display: inline-block;
                    border-radius: 5px;
                    background: #032140;
                    color: #fff;
                    margin: 20px 0 20px;
                    text-transform: uppercase;
                    padding: 15px 35px;
                      ">
                      <a href="${
                        environmentVars?.live_url
                      }" style="color:#fff; text-decoration:none;"> Shop Now</a>                   
                    </div>
                  </td>
                </tr>


                <tr>
                  <td>
                    <h2 style="color: #000;
                    text-align: center;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 400;
                    padding: 20px 60px;">If you have any questions or need any help,don't hesitate to contact our support team!</h2>
                  </td>
                </tr>
                <tr>
                  <td style="text-align:center">
                    <div style="display: inline-flex; margin-bottom: 20px;">
                      <img src="${base_url}/support-icon.png" alt="" style="text-align: center; width:40px; height:40px">
                      <div style="padding-left:10px;text-align: left;">
                          <h5 style="margin: 0; font-size: 18px; color: #000; font-weight: 400;">Contact us</h5>
                          <h5 style="margin: 0; font-size: 18px;color: #009CFF; font-weight: 400;">support@vuezen.io</h5>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #032140;padding: 40px 0px; text-align: center;">
                      <img src="${base_url}/white-logo.png">
                  </td>
                </tr>

            </tbody>
        </table>
        <div class="yj6qo"></div>
        <div class="adL">
        </div>
    </div>
  </body>

  </html>`,
      };
    } else if (data?.status == "outfordelivery") {
      mailOptions = {
        // from: process.env.AUTH_EMAIL,
        from: environmentVars.authEmail,
        to: data?.emailData?.email,
        subject: "ON THE WAY to clear vision!",
        html: `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ON THE WAY to clear vision!</title>
        </head>
        
        <body>
            <div style="margin:0;font-family: 'Lato', sans-serif;">
                <table
                    style="width:600px;background-color:rgb(255,255,255);margin:0 auto;border-spacing:0;border-collapse:collapse">
                    <tbody>
                        <tr style="padding:8px 0;">
                            <td
                                style="text-align:center; background-color: #032140;padding:12px 0;color: #fff;font-family: 'Lato', sans-serif">
                                Unveil your signature look with Vuezen
                            </td>
                        </tr>
                        <tr style="text-align:center;background-color:#fff">
                            <td style="text-align:center; padding: 15px 0;">
                                <img src="${base_url1}/logo.png" class="CToWUd" data-bit="iit">
                            </td>
                        </tr>
                        <tr style="background-color: #e9e9e9;font-family: 'Lato', sans-serif; ">
                            <td style="text-align: center; padding:0; background-color: #F6F6F6;">
                                <div
                                    style="text-align: center; padding:30px 40px; background-color: #032140; margin: 0 auto;">
                                    <p
                                        style="text-align:center;color:#fff;font-size:36px;font-style: italic;font-weight: 700; padding-bottom:25px;margin:0">
                                        Hello ${data?.emailData?.name},</p>
                                        <p style="text-align:center; color:#009CFF;font-size:24px; padding-bottom:20px;margin:0">
                                            <span> <img src="${base_url}tick.png"></span> ON THE WAY to clear vision!
                                    </p>
                                    <p style="text-align:center;color:#fff;font-size:16px;padding-bottom:25px;margin:0">
                                    Hey Visionary, your eyewear order is officially on its way to your doorstep! Consider it your ticket to a whole new world of style and clarity.
                                    </p>
                                </div>
                            </td>
                        </tr>
                        <tr style="font-family: 'Lato', sans-serif;">
                            <td style="padding-left:20px;">
                                <h5 style="color:#000;text-align:left;font-size:20px;font-weight:600;margin-bottom:0">
                                    Order Confirmation
                                </h5>
                                <p style="color:#000;font-size:16px;padding-top:25px;margin:0">
                                    Order Id: <span style="color: #009CFF;font-size: 20px; font-weight: 700;">#${
                                      data?.order_id
                                    }</span>
                                </p>
                            </td>
                        </tr>
                        <tr>
                        <td
                            style=" padding-bottom: 8px; color: #5E6470;">
                            Delivery Date
                        </td>
                        <td
                            style="text-align: right;  padding: 10px 0; color: #1A1C21; font-weight: 600;">
                            ${formattedDate}
                        </td>
                        </tr>
                        <tr>
                        <td style="padding-left:20px; padding-top: 5px;">
                            <table style="width: 100%;">
                                <tbody>
                            
                                    <tr>
                                        <td
                                            style="padding-bottom: 8px; color: #5E6470;">
                                            Your order sent to:
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-bottom: 8px; color: #5E6470;">
                                            <h3 style="margin: 0;">${
                                              fetchAddress?.full_name
                                            }</h3>
                                            <p style="color:#000;font-size:16px;margin:0">
                                            ${
                                              fetchAddress?.house_no
                                                ?.length !== 0
                                                ? `${fetchAddress?.house_no},`
                                                : ""
                                            } ${fetchAddress?.address},${
                                                    fetchAddress?.city
                                                  } ${fetchAddress?.state}${fetchAddress?.zipcode}, ${
                                                    fetchAddress?.country
                                                  }
                                             </p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
        
                
                        <tr>
                          <td style="text-align:center">
                            <img src="${base_url1}/find-img.png">
                          </td>
                        </tr>
        
        
        
                        <tr>
                          <td style="text-align:center; background-color: #F1E0CD;padding-bottom: 20px;">
                            <div style="display: inline-block;
                            border-radius: 5px;
                            background: #032140;
                            color: #fff;
                            margin: 20px 0 20px;
                            text-transform: uppercase;
                            padding: 15px 35px;
                              ">
                              <a href="${
                                environmentVars?.live_url
                              }" style="color:#fff; text-decoration:none;"> Shop Now</a>                   
                            </div>
                          </td>
                        </tr>
        
                        <tr>
                          <td>
                            <h2 style="color: #000;
                            text-align: center;
                            font-size: 16px;
                            font-style: normal;
                            font-weight: 400;
                            padding: 20px 60px;">If you have any questions or need any help,don't hesitate to contact our support team!</h2>
                          </td>
                        </tr>
                        <tr>
                          <td style="text-align:center">
                            <div style="display: inline-flex; margin-bottom: 20px;">
                              <img src="${base_url}/support-icon.png" alt="" style="text-align: center; width:40px; height:40px">
                              <div style="padding-left:10px;text-align: left;">
                                  <h5 style="margin: 0; font-size: 18px; color: #000; font-weight: 400;">Contact us</h5>
                                  <h5 style="margin: 0; font-size: 18px;color: #009CFF; font-weight: 400;">support@vuezen.io</h5>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td style="background-color: #032140;padding: 40px 0px; text-align: center;">
                              <img src="${base_url}/white-logo.png">
                          </td>
                        </tr>
                       
        
        
                    </tbody>
                </table>
                <div class="yj6qo"></div>
                <div class="adL">
                </div>
            </div>
        </body>
        
        </html>`,
      };
    } else if (data?.status == "delivered") {
      mailOptions = {
        // from: process.env.AUTH_EMAIL,
        from: environmentVars.authEmail,
        to: data?.emailData?.email,
        subject: "Your Vuezen is here!",
        html: `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Vuezen is here!</title>
        </head>
        
        <body>
            <div style="margin:0;font-family: 'Lato', sans-serif;">
                <table
                    style="width:600px;background-color:rgb(255,255,255);margin:0 auto;border-spacing:0;border-collapse:collapse">
                    <tbody>
                        <tr style="padding:8px 0;">
                            <td
                                style="text-align:center; background-color: #032140;padding:12px 0;color: #fff;font-family: 'Lato', sans-serif">
                                Unveil your signature look with Vuezen
                            </td>
                        </tr>
                        <tr style="text-align:center;background-color:#fff">
                            <td style="text-align:center; padding: 15px 0;">
                                <img src="${base_url1}/logo.png" class="CToWUd" data-bit="iit">
                            </td>
                        </tr>
                        <tr style="background-color: #e9e9e9;font-family: 'Lato', sans-serif; ">
                            <td style="text-align: center; padding:0; background-color: #F6F6F6;">
                                <div
                                    style="text-align: center; padding:30px 40px; background-color: #032140; margin: 0 auto;">
                                    <p
                                        style="text-align:center;color:#fff;font-size:36px;font-style: italic;font-weight: 700; padding-bottom:25px;margin:0">
                                        Hello ${data?.emailData?.name},</p>
                                        <p style="text-align:center; color:#009CFF;font-size:24px; padding-bottom:20px;margin:0">
                                            <span> <img src="${base_url}tick.png"></span> Order delivered
                                    </p>
                                    <p style="text-align:center;color:#fff;font-size:16px;padding-bottom:25px;margin:0">
                                        It's finally here – your eyewear order has landed safely at your doorstep! 
                                    </p>
                                    <p style="text-align:center;color:#fff;font-size:16px;padding-bottom:25px;margin:0">
                                        Waiting for those selfies now. 
                                    </p>
                                </div>
                            </td>
                        </tr>
                        <tr style="font-family: 'Lato', sans-serif;">
                            <td style="padding-left:20px;">
                                <h5 style="color:#000;text-align:left;font-size:20px;font-weight:600;margin-bottom:0">
                                    Order Confirmation
                                </h5>
                                <p style="color:#000;font-size:16px;padding-top:25px;margin:0">
                                    Order Id: <span style="color: #009CFF;font-size: 20px; font-weight: 700;">#${
                                      data?.order_id
                                    }</span>
                                </p>
                            </td>
                        </tr>
                      
        
                        ${productsRows}
                        <tr>
                        <td
                            style=" padding-bottom: 8px; color: #5E6470;">
                            Delivery Charges
                        </td>
                        <td
                            style="text-align: right;  padding: 10px 0; color: #1A1C21; font-weight: 600;">
                            ${findOrder?.fetchTaxData?.currency_symbol}
                            ${(
                              Number(findOrder?.delivery_charges)
                            )?.toFixed(2)}
                        </td>
                    </tr>
                    ${
                      findOrder?.is_student_info_id ?
                     ` <tr>
                        <td
                            style="padding-bottom: 8px; color: #5E6470;">
                            Discount
                        </td>
                        <td
                            style="text-align: right;  padding: 10px 0; color: #1A1C21; font-weight: 600;">
                            ${findOrder?.fetchTaxData?.currency_symbol}
                            ${Number(student_discount_price)?.toFixed(2)}
                        </td>
                      </tr>`:
                      `<tr>
                          <td
                              style=" padding-bottom: 8px; color: #5E6470;">
                              Discount
                          </td>
                          <td
                              style="text-align: right;  padding: 10px 0; color: #1A1C21; font-weight: 600;">
                              ${findOrder?.fetchTaxData?.currency_symbol}
                              ${(
                                Number(couponorstudentoffer)
                              )?.toFixed(2)}
                          </td>
                      </tr>`
                    
                    }

                    ${
                      !findOrder?.payment_method.toLowerCase().includes("cash")
                        ? `<tr>
                  
                        <td style=" padding-bottom: 8px; color: #5E6470;">
                          Extra ${
                            findOrder?.onlinePaymentData?.discount
                          }% discount on Debit/Credit Card
                        </td>
                        <td style="text-align: right;  padding: 10px 0; color: #1A1C21; font-weight: 600;">
                        ${findOrder?.fetchTaxData?.currency_symbol}
                          ${Number(tenpercentAmount)?.toFixed(2)}
                        </td>
                    </tr>`
                        : ""
                    }

                    <tr>
                        <td
                            style=" padding-bottom: 8px; color: #5E6470;">
                            ${findOrder?.payment_method.toLowerCase().includes("cash") ? "Amount to be Paid": "Amount Paid"} 
                        </td>
                        <td
                            style="text-align: right;  padding: 10px 0; color: #1A1C21; font-weight: 600;">
                            ${findOrder?.fetchTaxData?.currency_symbol}
                            ${(Number(grandAmount))?.toFixed(2)}
                        </td>
                    </tr>

                    <tr>
                    <td style="padding-left:20px; padding-top: 15px;">
                        <table style="width: 100%;">
                            <tbody>
                        
                                <tr>
                                    <td
                                        style="padding-bottom: 8px; color: #5E6470;">
                                        Your order sent to:
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 8px; color: #5E6470;">
                                        <h3 style="margin: 0;">${
                                          fetchAddress?.full_name
                                        }</h3>
                                        <p style="color:#000;font-size:16px;margin:0">
                                        ${
                                          fetchAddress?.house_no
                                            ?.length !== 0
                                            ? `${fetchAddress?.house_no},`
                                            : ""
                                        } ${fetchAddress?.address},${
                                                fetchAddress?.city
                                              } ${fetchAddress?.state}${fetchAddress?.zipcode}, ${
                                                fetchAddress?.country
                                              }
                                         </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                        <tr>
                          <td style="text-align:center">
                            <img src="${base_url1}/find-img.png">
                          </td>
                        </tr>
        
        
        
                        <tr>
                          <td style="text-align:center; background-color: #F1E0CD;padding-bottom: 20px;">
                            <div style="display: inline-block;
                            border-radius: 5px;
                            background: #032140;
                            color: #fff;
                            margin: 20px 0 20px;
                            text-transform: uppercase;
                            padding: 15px 35px;
                              ">
                              <a href="${
                                environmentVars?.live_url
                              }" style="color:#fff; text-decoration:none;"> Shop Now</a>                   
                            </div>
                          </td>
                        </tr>
        
                      <tr>
                        <td>
                          <h2 style="color: #000;
                          text-align: center;
                          font-size: 16px;
                          font-style: normal;
                          font-weight: 400;
                          padding: 20px 60px;">If you have any questions or need any help,don't hesitate to contact our support team!</h2>
                        </td>
                      </tr>
                      <tr>
                          <td style="text-align:center">
                            <div style="display: inline-flex; margin-bottom: 20px;">
                              <img src="${base_url}/support-icon.png" alt="" style="text-align: center; width:40px; height:40px">
                              <div style="padding-left:10px;text-align: left;">
                                  <h5 style="margin: 0; font-size: 18px; color: #000; font-weight: 400;">Contact us</h5>
                                  <h5 style="margin: 0; font-size: 18px;color: #009CFF; font-weight: 400;">support@vuezen.io</h5>
                              </div>
                            </div>
                          </td>
                      </tr>
                      <tr>
                        <td style="background-color: #032140;padding: 40px 0px; text-align: center;">
                            <img src="${base_url}/white-logo.png">
                        </td>
                      </tr>    
        
        
                    </tbody>
                </table>
                <div class="yj6qo"></div>
                <div class="adL">
                </div>
            </div>
        </body>
        
        </html>`,
      };
    }

    try {
      await transporter2.sendMail(mailOptions);
    } catch (err) {
      console.error(err, "error occur");
    }
    // return;
  } catch (error) {
    console.error(error);
    // return res.json({
    //   status: "Failed",
    //   message: error.message,
    // });
  }
}
export async function sendCouponViaEmail(data) {
  try {
    // console.log(data, "userdatorderdata");
    // data.emailData.email = "prabhat@bastionex.net";
    // console.log(data, "userdata", "orderdata");
    const mailOptions = {
      from: environmentVars.authEmail,
      to: data?.emailData?.email,
      subject: "Coupon Received",
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Coupon Received </title>
          <style>
              body {
                  font-family: 'Arial', sans-serif;
                  margin: 0;
                  padding: 0;
                  height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
              }
              .container {
                  max-width: 600px;
                  background-color: rgba(255, 255, 255, 0.9);
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0 0 20px rgba(0,0,0,0.1);
              }
              h2 {
                  color: #007BFF;
              }
              p {
                  color: #555;
                  line-height: 1.6;
                  margin-bottom: 15px;
              }
              a {
                  display: inline-block;
                  padding: 12px 24px;
                  margin-top: 20px;
                  text-decoration: none;
                  color: #ffffff;
                  background-color: #007BFF;
                  border-radius: 5px;
                  transition: background-color 0.3s ease;
              }
              a:hover {
                  background-color: #0056b3;
              }
              .nn{
                color: #FFFFFF;
              }
          </style>
      </head>
      <body>
          <div class="container">
          <h2>Congratulations! You've Received a Coupon</h2>
              <p>Dear ${data?.emailData?.name},</p>
              <p>Congratulations! You've received a coupon. Use the code below to enjoy your discount:</p>
              <div>
                <p><strong>Coupon Code:</strong> ${data?.discountObj?.code}</p>
                <p><strong>Discount:</strong> ${data?.discountObj?.value}</p>
                <p><strong>Discount type:</strong> ${data?.discountObj?.type}</p>
                <p><strong>Expire Date:</strong> ${data?.discountObj?.expired_date}</p>
              </div>
             
              <p>If you have any questions or concerns, please contact our support team.</p>
              <p>Thank you for choosing vuezen. We appreciate your understanding.</p>
              <p>Sincerely,</p>
              <p>Vuezen</p>
          </div>
      </body>
      </html>
      `,
    };
    try {
      await transporter2.sendMail(mailOptions);
    } catch (err) {
      console.error(err, "error occur");
    }
    return;
  } catch (error) {
    console.error(error);
    // return res.json({
    //   status: "Failed",
    //   message: error.message,
    // });
  }
}

//nesletter subscribe
export async function subscribeMailForNewsletter(EmailData) {
  try {
    console.log(333333333333);

    // console.log(EmailData, "userdata", "orderdata");
    // data.emailData.email = "prabhat@bastionex.net";
    // console.log(data, "userdata", "orderdata");
    // return
    let base_url = "https://vuezen.b-cdn.net/logo/";
    let base_url1 = `${process.env.BACEKND_URL}/uploads/images`;
    const mailOptions = {
      from: environmentVars.authEmail,
      to: EmailData,
      subject: "Welcome to Our Newsletter Community",
      html: `<!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vuezen - Welcome to Our Newsletter Community</title>
      </head>
      
      <body>
          <div style="margin:0;font-family: 'Lato', sans-serif;">
              <table
                  style="width:600px;background-color:rgb(255,255,255);margin:0 auto;border-spacing:0;border-collapse:collapse">
                  <tbody>
                      
                      
                      <tr>
                          <td style="text-align: center; padding:0px 20px;height: 200px;background: #f3f3f3;">
                          <img src="${base_url1}/logo.png" class="CToWUd" data-bit="iit" style="margin: 5px 0;">
                              <p style="text-align:center;color:#474747;font-family: 'Lato', sans-serif;font-weight:400;font-size:16px;padding-top:10px;margin:0">
                                  Thank you for subscribing to the Vuezen 
                              </p>
                              <p style="text-align:center;color:#474747;font-family: 'Lato', sans-serif;font-weight:400;font-size:16px;padding-top:10px;margin:0">
                              you're officially part of our stylish squad now! Get ready to receive exclusive updates, insider tips, and exciting offers straight to your inbox.
                          </p>
                              
                          </td>
                      </tr>
                     
                      <tr>                       
                        <td style="text-align: center; padding:0px 40px;height: 200px;background: #0e3c6d;">
                          <a href="${environmentVars?.live_url}">
                              <p style="text-align:center;color:#ffffff;font-family: 'Lato', sans-serif;font-weight:400;font-size:20px;padding-top:50px;margin:0">
                                Early Access
                              </p>
                              <p style="text-align:center;color:#ffffff;font-family: 'Lato', sans-serif;font-weight:800;font-size:180px;padding-top:0;margin:0;line-height: 150px;">
                                  SALE
                              </p>
                              <p style="text-align:center;color:#ffffff;font-family: sans-serif;font-weight:500;font-size:60px;padding-top:10px;margin: 10px 0 30px 0;">
                                  UPTO 70% OFF
                              </p>
                          </a>
                        </td>                       
                      </tr>
                      
                      <tr>
                          <td style="text-align:center;">
                              <h5
                                  style="color:#0b3765;text-align:center;font-size:18px;font-style:normal;font-weight:600;margin:25px 0 0; padding: 0 80px 20px;">
                                  We can't wait to share our latest eyewear trends and stories with you</h5>
                          </td>
                      </tr>
      
                      <tr>
                        <td style="text-align:center">
                          <img src="${base_url1}/find-img.png">
                        </td>
                      </tr>
      
                      <tr>
                        <td style="text-align:center; background-color: #F1E0CD;padding-bottom: 20px;">
                          <div style="display: inline-block;
                          border-radius: 5px;
                          background: #032140;
                          color: #fff;
                          margin: 20px 0 20px;
                          text-transform: uppercase;
                          padding: 15px 35px;
                            ">
                            <a href="${environmentVars?.live_url}" style="color:#fff; text-decoration:none;"> Shop Now</a>                   
                          </div>
                        </td>
                      </tr>
      
                      <tr>
                        <td>
                          <h2 style="color: #000;
                          text-align: center;
                          font-size: 16px;
                          font-style: normal;
                          font-weight: 400;
                          padding: 20px 60px;">If you have any questions or need any help,don't hesitate to contact our support team!</h2>
                        </td>
                      </tr>
                      
      
                      <tr>
                          <td style="text-align:center">
                            <div style="display: inline-flex; margin-bottom: 20px;">
                              <img src="${base_url1}/support-icon.png" alt="" style="text-align: center; width:40px; height:40px">
                              <div style="padding-left:10px;text-align: left;">
                                  <h5 style="margin: 0; font-size: 18px; color: #000; font-weight: 400;">Contact us</h5>
                                  <h5 style="margin: 0; font-size: 18px;color: #009CFF; font-weight: 400;">support@vuezen.io</h5>
                              </div>
                            </div>
                          </td>
                      </tr>
                      <tr>
                        <td style="background-color: #032140;padding: 40px 0px; text-align: center;">
                            <img src="${base_url1}/white-logo.png">
                        </td>
                      </tr>
      
                      
                  </tbody>
              </table>
              <div class="yj6qo"></div>
              <div class="adL">
              </div>
          </div>
      </body>
      
      </html>`,
    };
    try {
      await transporter2.sendMail(mailOptions);
    } catch (err) {
      console.error(err, "error occur");
    }
    return;
  } catch (error) {
    console.error(error);
    // return res.json({
    //   status: "Failed",
    //   message: error.message,
    // });
  }
}

/**
 * for admin side email for cancel order by admin 
 * 
 * <div class="container">
    <h2>Order Cancellation Confirmation</h2>
    <p>Dear ${obj?.name},</p>

    <!-- Check if the order is cancelled -->
    ${obj?.orderCancelled ? `
        <p class="cancel-message">We regret to inform you that your order has been cancelled successfully.</p>
        <p>This decision was made due to unforeseen circumstances, and we sincerely apologize for any inconvenience it may have caused.</p>
        <p>Here are some details about your cancelled order:</p>
        <ul>
            <li>Order ID: ${obj?.orderId}</li>
            <li>Cancelled Items: ${obj?.cancelledItems.join(', ')}</li>
            <li>Total Amount Refunded: ${obj?.refundAmount}</li>
        </ul>
        <p>If you have any questions or concerns regarding the cancellation, please don't hesitate to contact our support team at ${process.env.SUPPORT_EMAIL}.</p>
        <p>Thank you for your understanding and continued support. We appreciate your business and hope to serve you better in the future.</p>
    ` : `
        <p>It seems that you've forgotten your password, but don't worry, we've got you covered!</p>
        <p>To reset your password, otp is ${obj?.otp_code}</p>
        <p>Please choose a strong and memorable password. That's it!</p>
        <p>Thank you for choosing vuezen. We appreciate your trust in our platform and are here to ensure you have a seamless experience.</p>
    `}

    <p>Sincerely,</p>
    <p>Vuezen</p>
</div>

 */
