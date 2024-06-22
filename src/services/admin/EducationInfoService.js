import axios from "axios";
import UserEducationInfoModel from "../../models/UserEducationInfo.js";
import { removefIle } from "../../helpers/validateImageFile.js";
import UserModel from "../../models/UserModel.js";
import dbConnection from "../../config/dbConfig.js";

class AdminEducationInfoService {
  async getData(req, res) {
    try {
      const page = 1; // Example page number
      const pageSize = 10; // Example page size

      const offset = (page - 1) * pageSize;

      const fetchUserData = `
        SELECT UEI.*, 
               U.id AS userId, 
               U.name, 
               U.email, 
               U.role, 
               U.status AS status, 
               U.is_verified, 
               U.phone, 
               U.country 
        FROM user_education_info AS UEI
        INNER JOIN users AS U ON UEI.user_id = U.id
        WHERE UEI.status = 'active'
        GROUP BY UEI.id, U.id
        ORDER BY UEI.created_at DESC
        LIMIT ${pageSize}
        OFFSET ${offset};
      `;

      const get = await dbConnection.query(fetchUserData, {
        type: dbConnection.QueryTypes.SELECT,
      });
      return res.status(200).json({
        message: "Fetch data",
        data: get,
        statusCode: 200,
        success: true,
      });
    } catch (Err) {
      console.log(Err, "Erororroro");
      return res
        .status(500)
        .json({ message: Err?.message, statusCode: 500, success: false });
    }
  }
  async changeStatus(req, res) {
    try {
      let findObj = await UserEducationInfoModel.findOne({
        where: { id: req.body.id, status: "active" },
        raw: true,
      });
      if (!findObj) {
        return res.status(400).json({
          message: "Document not found or deleted successfully",
          statusCode: 400,
          success: false,
        });
      } else {
        await UserEducationInfoModel.update(
          { approve: req.body.approve },
          { where: { id: req.body.id } }
        );
        return res.status(200).json({
          message: "Document status update successfully",
          statusCode: 200,
          success: true,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
}

let AdminEducationServiceObj = new AdminEducationInfoService();

export default AdminEducationServiceObj;
