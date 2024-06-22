import CategoryModel from "../../models/CategoryModel.js";
import { Op } from "sequelize";
import { environmentVars } from "../../config/environmentVar.js";
import { generateAccessToken } from "../../helpers/validateUser.js";
import filterProduct from "../../models/filterDataModel.js";
import fs from "fs";
import FooterModel from "../../models/FooterModel.js";
import { url } from "inspector";
import {
  cdnFuncCall,
  deleteCdnFile,
  removefIle,
} from "../../helpers/validateImageFile.js";

class FooterServices {
  async add(req, res) {
    try {
      let { h1_description, footer_email, footer_phone, id } = req.body;
      let obj = {
        h1_description,
        footer_email,
        footer_phone,
      };
      if (req.files && req.files?.h1_image) {
        obj.h1_image = req.files?.h1_image[0]?.filename;
        try {
          await cdnFuncCall(
            req.files?.h1_image[0]?.filename,
            req.files?.h1_image[0]?.path,
            "footer"
          );
        } catch (err) {
          console.log(err, " uplod in cdn");
        }
      }
      if (id) {
        let findData = await FooterModel.findOne({ where: { id }, raw: true });
        if (findData) {
          await FooterModel.update(obj, { where: { id } });
          if (
            findData &&
            findData?.h1_image &&
            req.files &&
            req.files?.h1_image &&
            req.files?.h1_image?.[0]?.filename
          ) {
            try {
              await removefIle(findData?.h1_image, "footer");
            } catch (err) {
              console.log(err, "error in delete uplaod folder");
            }
            try {
              await deleteCdnFile(findData?.h1_image, "footer");
            } catch (err) {
              console.log(err, "err in cdn delete");
            }
          }
          return res.status(200).json({
            message: "Data updated successfully",
            statusCode: 200,
            success: true,
          });
        } else {
          return res.status(400).json({
            message: "Data not found",
            statusCode: 400,
            success: false,
          });
        }
      } else {
        await FooterModel.create(obj);
        return res.status(200).json({
          message: "Data add successfully",
          statusCode: 200,
          success: true,
        });
      }
    } catch (err) {
      console.log(err, "Error incat");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async addSocialData(req, res) {
    try {
      let { id, social_id, url } = req.body;
      if (id) {
        let findData = await FooterModel.findOne({ where: { id }, raw: true });
        let socialData = findData?.social_media_data;

        if (findData) {
          let temp = [];
          if (socialData) {
            temp = [...socialData];
          }
          if (social_id) {
            let findData = temp?.find((el) => el?.id == social_id);
            let dbImage = findData?.image;
            if (findData && findData?.url) {
              temp = temp.map((el, index) => {
                if (el?.id == social_id) {
                  el.url = url;
                  el.image = req.files?.social_media_image
                    ? req.files?.social_media_image[0]?.filename
                    : el?.image;
                  el.id;
                }
                return el;
              });
              await FooterModel.update(
                { social_media_data: temp },
                { where: { id } }
              );
              if (
                req.files?.social_media_image?.length &&
                req.files?.social_media_image[0]?.filename
              ) {
                if (dbImage) {
                  try {
                    await removefIle(dbImage, "footer");
                  } catch (err) {
                    console.log(err, "error in delete uplaod folder");
                  }
                  try {
                    await deleteCdnFile(dbImage, "footer");
                  } catch (err) {
                    console.log(err, "err in cdn delete");
                  }
                }
                try {
                  cdnFuncCall(
                    req.files?.social_media_image[0]?.filename,
                    req.files?.social_media_image[0]?.path,
                    "footer"
                  );
                } catch (err) {
                  console.log(err, " uplod in cdn");
                }
              }
              return res.status(200).json({
                message: "Social Link Data Updated Successfully",
                statusCode: 200,
                success: true,
              });
            }
          }
          let i = temp?.length;
          if (req.files.social_media_image) {
            for (let el of req.files.social_media_image) {
              temp.push({
                url: req.body.url || "",
                image: el?.filename || "",
                id: i + 1,
              });
              try {
                cdnFuncCall(el?.filename, el?.path, "footer");
              } catch (err) {
                console.log(err, " uplod in cdn");
              }
              i++;
            }
          }
          await FooterModel.update(
            { social_media_data: temp },
            { where: { id } }
          );

          return res.status(201).json({
            message: "Social Link Data Added Successfully",
            statusCode: 201,
            success: true,
          });
        } else {
          return res.status(400).json({
            message: "Data not found",
            statusCode: 400,
            success: false,
          });
        }
      } else {
        return res.status(400).json({
          message: "Data not found ",
          statusCode: 400,
          success: true,
        });
      }
    } catch (err) {
      console.log(err, "Error incat");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async getAllData(req, res) {
    try {
      let fetchArray = await FooterModel.findOne({ raw: true });
      res.status(200).json({
        message: "Fetch category data",
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

  async deleteById(req, res) {
    try {
      let { id, social_id } = req.query;

      let get = await FooterModel.findOne({ where: { id }, raw: true });
      if (get) {
        let filterData = get?.social_media_data?.filter(
          (el) => el?.id != social_id
        );
        console.log(filterData, "filterDatafilterData");
        await FooterModel.update(
          { social_media_data: filterData },
          { where: { id } }
        );

        let name = get?.social_media_data?.find((el) => el?.id == social_id);
        try {
          let filePath = `./src/uploads/footer/${name?.image}`;
          if (filePath) {
            await fs.unlinkSync(filePath);
          }
        } catch (err) {
          console.error(err, "eroror in dlete footer ");
        }
        try {
          await deleteCdnFile(name?.image, "footer");
        } catch (err) {
          console.log(err, "err in cdn delete");
        }
        return res.status(200).json({
          message: "Social link data deleted successfully",
          success: true,
          statusCode: 200,
        });
      } else {
        return res.status(400).json({
          message: "Data not found ",
          success: false,
          statusCode: 400,
        });
      }
    } catch (err) {
      console.log(err, "E delte");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
}

const FooterServicesObj = new FooterServices();
export default FooterServicesObj;
