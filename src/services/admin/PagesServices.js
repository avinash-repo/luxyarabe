import PagesModel from "../../models/PagesModel.js";
import { Op } from "sequelize";
import { environmentVars } from "../../config/environmentVar.js";
import PagesSubSectionModel from "../../models/PagesSubSectionModel.js";

class PagesServices {
  async createPages(req, res) {
    try {
      let {
        title,
        slug,
        content,
        meta_keyword,
        meta_title,
        meta_description,
        status,
        display_in_menu,
        parent_id,
      } = req.body;

      let findTitle = await PagesModel.findOne({
        where: { title: title?.trim() },
        raw: true,
      });

      let image = "";
      if (req.files && req.files?.pages_image?.length) {
        image = req.files?.pages_image[0]?.filename;
      }
      let obj = {
        title: title?.trim(),
        slug: slug?.trim(),
        content: content?.trim(),
        meta_keyword: meta_keyword?.trim(),
        meta_title: meta_title?.trim(),
        meta_description: meta_description?.trim(),
        banner_image: image,
        status: status,
        display_in_menu,
        parent_id,
      };
      let message = "";
      let statusCode;
      // console.log(obj, "objectttttttttttttt");
      if (findTitle && findTitle?.id) {
        message = "Page update successfuly";
        statusCode = 200;
        obj.updated_at = Date.now();
        await PagesModel.update(obj, { where: { id: findTitle?.id } });
      } else {
        message = "Page create successfuly";
        statusCode = 201;
        await PagesModel.create(obj);
      }
      return res
        .status(statusCode)
        .json({ message, statusCode, success: true });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async deletePagesById(req, res) {
    try {
      let id = req.query.id;
      let checkDoc = await PagesModel.findOne({ where: { id: id }, raw: true });
      let message = "";
      let statusCode;
      let success;
      if (checkDoc) {
        message = "Pages delete successfully";
        statusCode = 200;
        success = true;

        await PagesModel.destroy({ where: { id } });
      } else {
        message = "Pages already deleted or not exist";
        statusCode = 400;
        success = false;
      }
      return res.status(statusCode).json({ message, statusCode, success });
    } catch (err) {
      console.log(err, "Errorrrrrrrrrrrrrrrrr");
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async createSubPagesData(req, res) {
    try {
      let {
        position,
        page_id,
        heading_one,
        heading_two,
        paragraph,
        button,
        status,
      } = req.body;

      let findTitle = await PagesSubSectionModel.findOne({
        where: { position },
        raw: true,
      });

      let image = [];
      if (req.files && req.files?.length) {
        for (let el of req.files) {
          image.push(el?.fileName);
        }
      }

      let obj = {
        position,
        page_id,
        heading_one: heading_one?.trim(),
        heading_two: heading_two?.trim(),
        paragraph: paragraph?.trim(),
        button,
        status,
        image,
      };
      let message = "";
      let statusCode;
      if (findTitle && findTitle?.id) {
        message = "Sub Section Page data update successfuly";
        statusCode = 200;
        await PagesSubSectionModel.update(obj, {
          where: { id: findTitle?.id },
        });
      } else {
        message = "Sub Section Page data create successfuly";
        statusCode = 201;
        await PagesSubSectionModel.create(obj);
      }
      return res
        .status(statusCode)
        .json({ message, statusCode, success: true });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

  async deletePages(req, res) {
    try {
      let { id } = req.query;
      let checkDoc = await PagesSubSectionModel.findOne({
        where: { id: id },
        raw: true,
      });
      let message = "";
      let statusCode;
      let success;
      if (checkDoc) {
        message = "Sub ssection pages delete successfully";
        statusCode = 200;
        success = true;

        await PagesSubSectionModel.destroy({ where: { id } });
      } else {
        message = "Sub ssection pages already deleted or not exist";
        statusCode = 400;
        success = false;
      }
      return res.status(statusCode).json({ message, statusCode, success });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }

}

const PagesServicesObj = new PagesServices();
export default PagesServicesObj;
