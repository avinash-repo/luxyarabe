import { cdnFuncCall, deleteCdnFile, removefIle } from "../../helpers/validateImageFile.js";
import CategoryModel from "../../models/CategoryModel.js";
import FrameSizeConfig from "../../models/FrameSizesConfigModel.js";
import UiInnerSection from "../../models/UIInnerSectionModel.js";
import filterProduct from "../../models/filterDataModel.js";

class UIInnerSectionServices {
  async getData(req, res) {
    try {
      let fetchData = await UiInnerSection.findAll({});
      return res.status(200).json({
        success: true,
        message: "Data fetched successfully",
        statusCode: 200,
        data: fetchData,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async addUIInnerSections(body, res) {
    ///pending her replace witth filterproduct
    try {
      // category_id
      // sub_category_id
      // let fetchCategory = await CategoryModel.findOne({
      //   where: { id: body.category_id },
      // });
      // if (!fetchCategory) {
      //   return res.status(400).json({
      //     message: "Category not found",
      //     success: false,
      //     statusCode: 400,
      //   });
      // }
      let fetchSub_category = await filterProduct.findOne();
      let fetchGender = fetchSub_category?.gender;
      let checkExist = fetchGender?.find(
        (el) => el?.id == body?.sub_category_id
      );
      // console.log(checkExist,"check exits")
      if (!checkExist) {
        return res.status(400).json({
          message: "Sub category not found",
          success: false,
          statusCode: 400,
        });
      }
      let fetchCategory = fetchSub_category?.categories;
      let checkExistCategory = fetchCategory?.find(
        (el) => el?.id == body?.category_id
      );
      // ccccccccccc.log(checkExist,"check exits")
      if (!checkExistCategory) {
        return res.status(400).json({
          message: "Category not found",
          success: false,
          statusCode: 400,
        });
      }
      const uisectioninfo = await UiInnerSection.findOne({
        where: {
          category_id: body.category_id,
          sub_category_id: body.sub_category_id,
        },
        raw: true,
      });
      if (uisectioninfo && uisectioninfo?.id) {

        if (uisectioninfo.image) {
        // console.log(uisectioninfo.image,"ui section info . image",body.imageData,"req.file.");
          try {
             cdnFuncCall(body?.imageData.filename,body?.imageData.path, "ui");
          } catch (err) {
            console.log(err, " uplod in cdn");
          }
          try {
             deleteCdnFile(uisectioninfo.image, "ui");
          } catch (err) {
            console.log(err, "err in cdn delete");
          }
          try {
            await removefIle(uisectioninfo.image,'ui');
          } catch (err) {
            console.log(err, "error in delete uplaod folder");
          }
        }

        await UiInnerSection.update(
          {
            slug: body.slug || uisectioninfo.slug,
            heading: body.heading || uisectioninfo.heading,
            description: body.description || uisectioninfo.description,
            image: body.image || uisectioninfo.image,
            status: body.status || uisectioninfo.status,
            remarks: body.remarks || uisectioninfo.remarks,
            color: body.color || uisectioninfo.color,
          },
          { where: { id: uisectioninfo.id } }
        );

        return res.status(200).json({
          success: true,
          message: "Update Successfully ",
          statusCode: 200,
        });
      } else {
        if (!body?.imageData) {
          return res.status(400).json({
            message: "Image is mandatory",
            success: false,
            statusCode: 400,
          });
        }
        try {
           cdnFuncCall(body?.imageData.filename,body?. imageData.path, "ui");
        } catch (err) {
          console.log(err, " uplod in cdn");
        }
        await UiInnerSection.create(body);
        return res.status(201).json({
          success: true,
          message: "Added Successfully ",
          statusCode: 201,
        });
      }
    } catch (err) {
      console.log(err, "ee");
    }
    // return res
    //   .status(201)
    //   .json({ success: true, message: "Added Successfully " });
  }
  async updateUIFrameConfig(req, res) {
    try {
      const data = await FrameSizeConfig.findOne({
        where: { heading: req.body.heading },
      });
      if (data) {
        let obj = {
          heading: req.body.heading || data?.heading,
          description: req.body.description || data?.description,
          updated_at: new Date(),
        };
        FrameSizeConfig.update(obj, { where: { heading: req.body.heading } })
          .then((result) => {
            return res
              .status(201)
              .json({ success: true, message: "values updated" });
          })
          .catch((error) => {
            return res
              .status(500)
              .json({ success: false, message: error?.message });
          });
      } else {
        FrameSizeConfig.create({
          heading: req.body.heading,
          description: req.body.description,
        })
          .then((newRecord) => {
            return res
              .status(201)
              .json({ success: true, message: "values created" });
          })
          .catch((error1) => {
            return res
              .status(500)
              .json({ success: false, message: error1?.message });
          });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
  async getFrameConfig(req, res) {
    try {
      const data = await FrameSizeConfig.findAll();
      return res.status(200).json({
        success: true,
        message: "Data fetched successfully",
        data: data,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error?.message });
    }
  }
}
const UIInnerSectionServicesObj = new UIInnerSectionServices();
export default UIInnerSectionServicesObj;
