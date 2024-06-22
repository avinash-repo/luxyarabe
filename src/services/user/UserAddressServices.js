import UserAddressModel from "../../models/UserAddressModel.js";
import { environmentVars } from "../../config/environmentVar.js";
import { Op } from "sequelize";

let salt = environmentVars.salt;

class UserAddressServices {
  async addUserAddress(req, res) {
    try {
      let {
        country,
        address,
        house_no,
        city,
        state,
        zipcode,
        full_name,
        mobile,
        landmark,
        is_default,
      } = req.body;
      // console.log(req.userData, "req.userData.idreq.userData.id");
      let obj = {
        country: country?.trim(),
        address: address?.trim(),
        house_no: house_no,
        city: city?.trim(),
        state: state?.trim(),
        zipcode: zipcode?.trim(),
        user_id: req.userData.id,
        full_name: full_name?.trim(),
        is_default: is_default || 0,
        mobile,
        landmark,
      };
      let findExist = await UserAddressModel.findOne({ where: obj, raw: true });
      if (findExist && findExist.id) {
        return res.status(400).json({
          message: "Address already exist",
          success: false,
          statusCode: 400,
        });
      }
      let fetchAddressArr = await UserAddressModel.findAll({
        where: { user_id: req.userData.id, status: "active" },
        raw: true,
        attributes: ["user_id"],
      });
      // console.log()
      if (fetchAddressArr?.length == 0) {
        obj.is_default = 1;
      }
      let get = await UserAddressModel.create(obj);
      // console.log(is_default, "22222222222222is_deafutttttttttt");
      if (is_default) {
        // console.log(is_default, "is_deafutttttttttt inside", );
        await UserAddressModel.update(
          { is_default: false },
          { where: { user_id: req.id, id: { [Op.ne]: get?.id } } }
        );
      }
      return res.status(201).json({
        message: "Address added successfully",
        statusCode: 201,
        success: true,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async getUSerAllAddressData(req, res) {
    try {
      if (!req.userData?.id) {
        return res
          .status(400)
          .json({ message: "User not found", statusCode: 400, success: false });
      }
      // console.log(req.userData, "req.userDatareq.userDatareq.userData");
      
      let fetchArray = await UserAddressModel.findAll({
        where: { user_id: req.userData?.id, status: "active" },
        raw: true,
      });
      res.status(200).json({
        message: "Fetch address data",
        data: fetchArray,
        success: true,
        statusCode: 200,
      });
      return;
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async getUserAddressByIdData(req, res) {
    try {

      
      
      let fetchObj = await UserAddressModel.findOne({
        where: {
          id: req.query?.id,
          user_id: req.userData.id,
          // status: "inactive",
        },
        raw: true,
      });
      if (!fetchObj) {
        return res.status(400).json({
          message: "Address not found",
          success: false,
          statusCode: 400,
        });
      }
      res.status(200).json({
        message: "Fetch address data",
        data: fetchObj,
        success: true,
        statusCode: 200,
      });
      return;
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async editUserAddress(req, res) {
    try {
      let {
        full_name,
        country,
        state,
        city,
        zipcode,
        house_no,
        address,
        landmark,
        mobile,
        is_default,
        id,
      } = req.body;
      // console.log(req.body, "req.bodyreq.bodyreq.bodyreq.body", req.userData);
      let fetchUserAddressObj = await UserAddressModel.findOne({
        where: { id: id, user_id: req.userData.id, status: "active" },
        raw: true,
      });
      if (!fetchUserAddressObj) {
        return res.status(400).json({
          message: "Address not found",
          success: false,
          statusCode: 400,
        });
      }
      let obj = {
        full_name: full_name?.trim() || fetchUserAddressObj?.full_name,
        country: country?.trim() || fetchUserAddressObj?.country,
        address: address?.trim() || fetchUserAddressObj?.address,
        house_no: house_no || fetchUserAddressObj?.house_no,
        city: city?.trim() || fetchUserAddressObj?.city,
        state: state?.trim() || fetchUserAddressObj?.state,
        zipcode: zipcode?.trim() || fetchUserAddressObj?.zipcode,
        landmark: landmark?.trim() || fetchUserAddressObj?.landmark,
        mobile: mobile || fetchUserAddressObj?.mobile,
        is_default: is_default || fetchUserAddressObj?.is_default,
      };
      await UserAddressModel.update(obj, { where: { id: id } });
      if (is_default) {
        // console.log(is_default, "is_deafutttttttttt");
        await UserAddressModel.update(
          { is_default: false },
          { where: { user_id: req.id, id: { [Op.ne]: id } } }
        );
      }
      res.status(200).json({
        message: "Address update successfully",
        success: true,
        statusCode: 200,
      });
      return;
    } catch (err) {
      console.log(err, "EEDFSD@!#########");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async setDefaultAddress(req, res) {
    try {
      // console.log(req.userData, req.query);
      if (!req.query.id) {
        return res.status(400).json({
          message: "Not authorise to edit Address",
          success: false,
          statusCode: 400,
        });
      } else if (req.query.id?.length > 10) {
        return res.status(400).json({
          message: "Id must be valid",
          success: false,
          statusCode: 400,
        });
      } else {
        await UserAddressModel.update(
          { is_default: 1 },
          { where: { user_id: req.id, id: req.query.id } }
        );
       
        await UserAddressModel.update(
          { is_default: false },
          { where: { user_id: req.id, id: { [Op.ne]: req.query.id } } }
        );
        
        return res.status(200).json({
          message: "Address update successfully",
          success: true,
          statusCode: 200,
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async deleteAddressById(req, res) {
    try {
      
      let fetchUserAddressObj = await UserAddressModel.findOne({
        where: { id: req.query.id, user_id: req.userData.id, status: "active" },
        raw: true,
      });

      if (!fetchUserAddressObj) {
        return res.status(400).json({
          message: "Address deleted already",
          success: false,
          statusCode: 400,
        });
      } else {
        if (fetchUserAddressObj?.is_default === 1) {
          let findactiveData = await UserAddressModel.findOne({
            where: {
              user_id: req.id,
              id: {
                [Op.ne]: req.query.id, // Exclude the document with id equal to defaultAddressId
              },
              status: "active",
            },
            raw: true,
          });

          if (findactiveData && findactiveData.id) {
            await UserAddressModel.update(
              { is_default: 1 },
              { where: { id: findactiveData.id } }
            );
           
          }

          let statusOf =
            fetchUserAddressObj?.status == "active" ? "inactive" : "active";
          await UserAddressModel.update(
            { status: statusOf, is_default: 0 },
            { where: { id: req.query.id } }
          );

          return res.status(200).json({
            message: "Address deleted successfully",
            success: true,
            statusCode: 200,
          });
        } else {
          let statusOf =
            fetchUserAddressObj?.status == "active" ? "inactive" : "active";
          await UserAddressModel.update(
            { status: statusOf },
            { where: { id: req.query.id } }
          );
          

          return res.status(200).json({
            message: "Address deleted successfully",
            success: true,
            statusCode: 200,
          });
        }
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
}

const UserAddressServicesObj = new UserAddressServices();
export default UserAddressServicesObj;
