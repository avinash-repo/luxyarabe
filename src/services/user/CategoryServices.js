import CategoryModel from "../../models/CategoryModel.js";
import { Op } from "sequelize";
import { environmentVars } from "../../config/environmentVar.js";
import { generateAccessToken } from "../../helpers/validateUser.js";
import filterProduct from "../../models/filterDataModel.js";

let salt = environmentVars.salt;

class CategoryServices {
  async getAllCategoryData(req, res) {
    try {
      let fetchArray = [];
      // fetchArray = await CategoryModel.findAll({
      //   where: { status: "active", deleted_at: null },
      //   raw: true,
      // });
      // console.log(fetchArray,"fetchhhhhhhhhhhhhhhhhh")
     
      let fetchData = await filterProduct.findOne({ raw: true });
      // console.log(fetchData, "fetchfetchGenderfetchGender");
      //  fetchArray=fetchData?.categories
      // let gender = fetchData?.gender;
      // gender = gender?.filter((el) => el?.status == "active");
      // // console.log(gender,"fetch111GenderfetchGenderfetchGender")
      // for (let el of fetchArray) {
      //   if (!el.title?.includes("kid")) {
      //     el.genderData = gender;
      //   }
      // }
      ////////////////////////////////////////////
      fetchArray = fetchData?.categories;
      let gender = fetchData?.gender;
      gender = gender?.filter((el) => el?.status == "active");
      // console.log(gender, "fetch111GenderfetchGenderfetchGender");
      fetchArray = fetchArray?.filter((el) => el?.status == "active");
      if (fetchArray) {
        for (let le of fetchArray) {
          let tempArr = [];
          if (le?.gender_arr && le?.gender_arr?.length) {
            for (let el of le?.gender_arr) {
              // console.log(el, "elelelelelell", gender);
              let findGEnderExist = gender?.find((ab) => ab?.id == el);
              if (findGEnderExist) {
                tempArr.push(findGEnderExist);
              }
            }
          }
          le.genderData = tempArr;
        }
      }
      // console.log(fetchArray,"fetchArrayfetchArrayfetchArray")
      res.status(200).json({
        message: "Fetch category data",
        data: fetchArray,
        success: true,
        statusCode: 200,
      });
      return;
    } catch (err) {
      console.log(err, "err,errreee");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
  async getCategoryById(req, res) {
    try {
   

      const data = await filterProduct.findOne({ raw: true });
      const { id } = req.params;

      if (data?.categories) {
        const categoriesData = data?.categories.filter((val) => val?.id == id);
        const genderData = data?.gender.filter((val) => {
          if (categoriesData[0]?.gender_arr.includes(`${val?.id}`)) {
            return val;
          }
        });
        let obj = categoriesData[0];
        obj.genderData = genderData;
        return res.status(200).json({
          success: true,
          message: "Data fetched",
          data: obj,
        });
      } else {
        return res
          .status(200)
          .json({ success: false, message: "categories not found" });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
}

const CategoryServicesObj = new CategoryServices();
export default CategoryServicesObj;
