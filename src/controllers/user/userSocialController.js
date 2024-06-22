import axios from "axios";
import geoip from "geoip-lite";
import UserSocialServicesObj from "../../services/user/UserSocialServices.js";

const getAuthToken = () => {
  const options = {
    method: "POST",
    url: `https://${process.env.OAUTH_DOMAIN}/oauth/token`,
    headers: { "content-type": "application/json" },
    data: {
      client_id: process.env.OAUTH_CLIENID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      audience: `https://${process.env.OAUTH_DOMAIN}/api/v2/`,
      grant_type: "client_credentials",
    },
  };

  return axios
    .request(options)
    .then((response) => {
      //   console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(error, "]]");
      throw error; // Rethrow the error to be caught elsewhere
    });
};
class userSocialController {
  async getUserData(req, res) {
    try {
      const { id } = req.query;
      if (id) {
        getAuthToken()
          .then((token) => {
            let config = {
              method: "get",
              url: `https://${process.env.OAUTH_DOMAIN}/api/v2/users/${id}`,
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token?.access_token}`,
              },
            };

            axios
              .request(config)
              .then((response) => {
                // console.log(response?.data?.last_ip);

                const geo = geoip.lookup(response?.data?.last_ip);

                if (geo) {
                  // console.log("Country Code:", geo);

                  UserSocialServicesObj.createUser(
                    req,
                    res,
                    geo,
                    response.data
                  );
                  //   return res.status(200).json({
                  //     message: "Data Fetches Successfully",
                  //     success: true,
                  //     statusCode: 200,
                  //     data: response.data,
                  //     country: geo,
                  //   });
                } else {
                  return res.status(400).json({
                    message: "Unable to find Country",
                    success: false,
                    statusCode: 400,
                  });
                }
              })
              .catch((err) => {
                return res.status(500).json({
                  message: err?.message,
                  success: false,
                  statusCode: 500,
                });
              });
          })
          .catch((err) => {
            return res
              .status(500)
              .json({ message: err?.message, success: false, statusCode: 500 });
          });
      } else {
        return res
          .status(400)
          .json({ message: "Id is required", success: false, statusCode: 400 });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
}

const userSocialControllerObj = new userSocialController();
export default userSocialControllerObj;
