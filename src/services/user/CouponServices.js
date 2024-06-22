import dbConnection from "../../config/dbConfig.js";
import CouponModel from "../../models/couponModel.js";

class CouponServices {
  async getAvailableCoupons(obj, req, res) {
    try {
      let userCoupons = [];
      const orderQuery = `select coupon_id, count(coupon_id) as totalCoupons from orders where user_id=${req.userData.id} group by coupon_id`;
      const orders = await dbConnection.query(orderQuery, {
        type: dbConnection.QueryTypes.SELECT,
      });

      const query = `select * from coupons where (category_id=${obj.category} OR category_id=0)
       AND (${obj.price} BETWEEN min_purchase AND max_purchase)
       AND (CURRENT_DATE BETWEEN start_date AND expired_date)
       AND country='${obj.country} '
       AND \`LIMIT\` > USED
      `;
      const coupons = await dbConnection.query(query, {
        type: dbConnection.QueryTypes.SELECT,
      });

      for (let couponObj of coupons) {
        let maxUses = couponObj.max_uses_per_user;
        let isForNew = couponObj.new_user;
        let filterOrders = orders.filter(
          (val) => val.coupon_id == couponObj.id
        );
        
        if (isForNew == "active") {
          if (
            orders &&
            Array.isArray(orders) &&
            orders.length == 0
          ) {
            userCoupons.push(couponObj);
          }
        } else if (isForNew == "inactive") {
          if (
            filterOrders &&
            Array.isArray(filterOrders) &&
            filterOrders.length > 0
          ) {
            console.log("filterorders here");
            if (filterOrders[0].totalCoupons < maxUses) {
              userCoupons.push(couponObj);
            }
          } else {
            console.log("all orders ");
            userCoupons.push(couponObj);
          }
        }
      }
      // console.log(coupons);
      return res
        .status(200)
        .json({ success: true, message: "Data fetched", data: userCoupons });
    } catch (err) {
      console.log(err, "errororor in coupon ");
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
  async getBuyGetCoupons(obj, res) {
    try {
      //       const query = `
      //   SELECT *
      //   FROM coupons
      //   WHERE
      //     CURRENT_DATE BETWEEN start_date AND expired_date
      //     AND country = '${obj.country}'
      //     AND \`LIMIT\` > USED
      //     AND type = 'buy_get'
      //     AND status='active'
      // `;
      //       let coupons = await dbConnection.query(query, {
      //         type: dbConnection.QueryTypes.SELECT,
      //       });

      let fetchData = await CouponModel.findAll({
        where: { type: "buy_get", country: obj.country, status: "active" },
        raw: true,
      });
      const currentDate = new Date();

      const formattedDate =
        currentDate.toISOString().split("T")[0] + "T00:00:00.000Z";
      let temp = [];
      for (let el of fetchData) {
        if (el.limit <= el.used) {
        } else if (new Date(el.expired_date) < new Date(formattedDate)) {
          // console.log(
          //   new Date(el.expired_date) >= new Date(formattedDate),
          //   "ASDAda",
          //   new Date(el.start_date) <= new Date(formattedDate),
          //   "elele",
          //   el
          // );
        } else if (new Date(el.start_date) > new Date(formattedDate)) {
        } else {
          console.log("else part");
          temp.push(el);
        }
      }
      // console.log(temp, "couponsssssssss");
      for (let le of temp) {
        le.totalProduct = Number(le.buy_product) + Number(le.get_product);
      }
      temp = temp?.sort((x, y) => x?.totalProduct - y?.totalProduct);
      return res
        .status(200)
        .json({ success: true, message: "Data fetched", data: temp });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: err?.message, statusCode: 500 });
    }
  }
}
const CouponServicesObj = new CouponServices();
export default CouponServicesObj;
