import axios from "axios";
import { sendQueryMailToUser } from "../../helpers/common.js";
import ContactUS from "../../models/ContactusModel.js";
import fs from "fs";
import path from "path";
import process from "process";
import { google } from "googleapis";

let redirect_uris = ["https://helloworld2213.blogspot.com"];
let client_secret = "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";
let client_id =
  "28748684164-6aaqavc3u2tb4jjd0a1j35g32dahem36.apps.googleusercontent.com";

// project_id: "anupam-node",
// auth_uri: "https://accounts.google.com/o/oauth2/auth",
// token_uri: "https://oauth2.googleapis.com/token",
// auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",

class Contactus {
  async ContactUS(req, res) {
    try {
      // console.log(req.body.full_name);
      let full_name = req.body.full_name?.trim();
      let email = req.body.email?.trim();
      let phone = req.body.phone?.trim();
      let subject = req.body.subject?.trim();
      let message = req.body.message?.trim();

      const existCheck = await ContactUS.findOne({ where: { email } });
      if (existCheck) {
        return res.status(409).json({
          message: "Email Already Exist",
          success: false,
          statusCode: 409,
        });
      } else {
        const obj = {
          full_name,
          email,
          phone,
          subject,
          message,
        };
        // for smtp
        let data = {
          name: full_name,
          email,
          phone: phone,
        };
        await ContactUS.create(obj, { raw: true });
        await sendQueryMailToUser(res, data);
        res.status(201).json({
          success: true,
          message: "Thank you , We will connect you soon",
        });
        return;
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async authgoogle(req, res) {
    try {
      const authUrl = `https://accounts.google.com/o/oauth2/auth?${qs.stringify(
        {
          response_type: "code",
          client_id: googleOAuthConfig.clientId,
          redirect_uri: googleOAuthConfig.redirectUri,
          scope: googleOAuthConfig.scopes.join(" "),
        }
      )}`;
      // console.log(authUrl, "authUrlqweqweqweasd");
      // callbacka(authUrl);
      res.redirect(authUrl);
    } catch (err) {
      return res.status(500).json({ mesage: err?.message, status: false });
    }
  }

  async callback(req, res) {
    const { code } = req.query;

    try {
      // Exchange authorization code for access token
      const { data } = await axios.post(
        "https://oauth2.googleapis.com/token",
        qs.stringify({
          code,
          client_id: googleOAuthConfig.clientId,
          client_secret: googleOAuthConfig.clientSecret,
          redirect_uri: googleOAuthConfig.redirectUri,
          grant_type: "authorization_code",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const accessToken = data.access_token;
      // Now you have the access token, you can use it to make requests to the Google Analytics API
      // console.log(accessToken, "adasdasdad");
      // Redirect or render a page with the obtained access token
      res.send(`Access Token: ${accessToken}`);
    } catch (error) {
      console.error(
        "Error exchanging authorization code for access token:",
        error.response.data.error
      );
      res
        .status(500)
        .send("Error exchanging authorization code for access token");
    }
  }

  async latestCode(req, res) {
    try {
    } catch (err) {
      return res.status(500).json({ message: err?.message, statusCode: 500 });
    }
  }

  //  methods 1
  async getcreateCodeData(req, res) {
    try {
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );
      console.log(oAuth2Client, "oauth2clienttttt");

      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/analytics.readonly"],
      });
      // console.log(ai)
      return res.status(200).json({ data: authUrl });
    } catch (err) {
      return res.status(500).json({ message: err?.message });
    }
  }

  async createFile(req, res) {
    try {
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );
      let code1 = req.query.code;
      console.log(code1, " from req.query code .,coodeod");
      // const code =await readlineSync.question(code1);
      // console.log(code, "codeeeeeeeeeeee");
      const { tokens } = await oAuth2Client.getToken(code1);
      console.log(tokens, "tonenenenenesss");
      // fs.writeFileSync("token.json", JSON.stringify(tokens));
      console.log("Token stored to token.json");
      await main();
      return res.status(400).json({ message: "token get", data: tokens });
    } catch (err) {
      console.log(err?.message, "err create");
    }
  }
}

const ContactusObj = new Contactus();
export default ContactusObj;
