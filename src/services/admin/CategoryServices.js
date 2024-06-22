import CategoryModel from "../../models/CategoryModel.js";
import { Op } from "sequelize";
import { environmentVars } from "../../config/environmentVar.js";
import { generateAccessToken } from "../../helpers/validateUser.js";
import filterProduct from "../../models/filterDataModel.js";
import fs from "fs";
import { cdnFuncCall, deleteCdnFile, removefIle } from "../../helpers/validateImageFile.js";

class CategoryServices {
  async addCateogry(req, res) {
    try {
      let { mainTitle, value, status, min, max, id } = req.body;
      let fetchDbData = await filterProduct.findOne({ raw: true });
      let shapeDbArr = fetchDbData?.shape;
      let shapeArr = shapeDbArr?.length ? [...shapeDbArr] : [];
      //=-----------------------------------------------------

      let tempArr = [];

      for (let el in fetchDbData) {
        if (el == mainTitle) {
          tempArr = fetchDbData[el];
        }
      }
      // if (tempArr?.length == 0) {
      //   return res.status(400).json({
      //     message: "maintitle is not exist",
      //     statusCode: 400,
      //     success: false,
      //   });
      // }
      if (
        mainTitle == "shape" &&
        req.files?.shape_image &&
        req.files?.shape_image[0]?.filename
      ) {
        try {
          let obj = tempArr?.find((el) => el?.id == id);
          if (obj && obj?.image) {
            // console.log(obj?.image, "obj?.imageobj?.image");
            let filePath = `./src/uploads/filterProduct/category/${obj?.image}`;
            await fs.unlinkSync(filePath);
            try {
              await deleteCdnFile(obj?.image, "shape");
            } catch (err) {
              console.log(err, "err in cdn delete");
            }
          }
        } catch (err) {
          console.log(err, "erro add only category ");
        }
      }
      let findExistCehck = {};
      if (mainTitle != "price_range") {
        findExistCehck = tempArr?.find((el) => el?.value == value);
      }
      if (!id) {
        if (findExistCehck) {
          if (findExistCehck && mainTitle != "price_range") {
            return res.status(400).json({
              message: "value must be unique",
              statusCode: 400,
              success: false,
            });
          }
        }
      }
      let lengthCheck = tempArr?.length + 1;
      if (tempArr && tempArr?.length > 0) {
        lengthCheck = tempArr[tempArr?.length - 1]?.id + 1;
      }
      let object = {
        value,
        status,
        id: lengthCheck || 1,
      };
      if (mainTitle == "shape") {
        if (
          req.files?.shape_image &&
          req.files?.shape_image[0]?.filename &&
          req.files?.shape_image?.length
        ) {
          object.image = req.files?.shape_image[0]?.filename;
          try {
            await cdnFuncCall(
              req.files?.shape_image[0]?.filename,
              req.files?.shape_image[0]?.path,
              "shape"
            );
          } catch (err) {
            console.log(err, " uplod in cdn");
          }

        }
      }
      if (id) {
        if (mainTitle == "price_range") {
          if (min < -1 || max < -1) {
            return res.status(400).json({
              message: "Price_range max value ,min value cannot be less than 0",
              statusCode: 400,
              success: false,
            });
          }
          if (min > max) {
            return res.status(400).json({
              message: "Price_range max value cannot be less than min value",
              statusCode: 400,
              success: false,
            });
          }
          object.min = min;
          object.max = max;
        }
        tempArr = tempArr.map((el) => {
          if (el.id == id) {
            let ob = {
              ...el,
              value,
              status,
            };
            if (mainTitle == "shape") {
              if (
                req.files?.shape_image &&
                req.files?.shape_image[0]?.filename &&
                req.files?.shape_image?.length
              ) {
                ob.image = req.files?.shape_image[0]?.filename;
                
              }
            }
            if (mainTitle == "price_range") {
              (ob.min = min), (ob.max = max);
              delete ob.value;
            }
            return ob;
          } else {
            return el;
          }
        });
        // console.log(tempArr, "tempaaaaaaaaaaaa");
        let name = mainTitle;
        let object2 = {};
        object2[name] = tempArr;
        // console.log(object2, "object222222222222222");

        await filterProduct.update(object2, { where: { id: fetchDbData?.id } });
        return res.status(200).json({
          message: "update successfully",
          statusCode: 200,
          success: true,
        });
      } else {
        if (mainTitle == "price_range") {
          object.min = min;
          object.max = max;
        }
        if (tempArr) {
          tempArr?.push(object);
        } else {
          tempArr = [object];
        }
        let name = mainTitle;
        let object23 = {};
        object23[name] = tempArr;
        await filterProduct.update(object23, {
          where: { id: fetchDbData?.id },
        });

        return res.status(201).json({
          message: "category added successfully",
          statusCode: 201,
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

  async addOnlyCateogryData(req, res) {
    try {
      let { title, slug, value, status, gender_arr, id, is_special_offer } =
        req.body;
      // console.log(req.body, "reqqqqqqqqqqqq");

      let fetchDbData = await filterProduct.findOne({ raw: true });
      let categoriesDbArr = fetchDbData?.categories;
      let genderArr = fetchDbData?.gender;
      let categoriesArr = categoriesDbArr?.length ? [...categoriesDbArr] : [];
      let lengthCheck = categoriesArr?.length + 1;
      if (categoriesArr && categoriesArr?.length > 0) {
        lengthCheck = categoriesArr[categoriesArr?.length - 1]?.id + 1;
      }
      if (gender_arr && gender_arr?.length) {
        for (let le of gender_arr) {
          if (le != "") {
            let genderExist = genderArr?.find((el) => el.id == le);
            if (!genderExist) {
              return res.status(400).json({
                message: "Invalid gender inserted",
                statusCode: 400,
                success: false,
              });
            }
          }
        }
      }
      let image = "";
      // console.log(req.file,"reeeeeeeeeeeeeeeeeeeee")
      if (req.files && req.files?.image?.length) {
        image = req.files?.image[0]?.filename;
        try {
          await cdnFuncCall(
            req.files?.image[0]?.filename,
            req.files?.image[0]?.path,
            "category"
          );
        } catch (err) {
          console.log(err, "erro");
        }
      }

      let tempObj = {
        id: lengthCheck,
        title,
        slug,
        value,
        status,
        gender_arr,
        is_special_offer,
      };

      if (!fetchDbData) {
        // if (req.files?.image?.length == 0) {
        //   return res.status(400).json({
        //     message: "Image is mandatory",
        //     statusCode: 400,
        //     success: false,
        //   });
        // }
        tempObj.image = image;
        categoriesArr.push(tempObj);
        let obj = {
          categories: categoriesArr,
        };
        await filterProduct.create(obj);
        return res.status(200).json({
          message: "Category added successfully",
          statusCode: 200,
          success: true,
        });
      } else {
        if (id != "" && id != undefined) {
          let nameImage = "";
          // console.log(id, "idddddddddddddddddd");
          let findData = categoriesArr?.find((el) => el?.id == id);
          if (!findData) {
            return res.status(400).json({
              message: "Category not found",
              statusCode: 400,
              success: false,
            });
            // console.log(req.files, "Req.filessssssssssss");
          } else {
            categoriesArr = categoriesArr?.map((el) => {
              if (el?.id == id) {
                nameImage = el?.image;
                let obj = {
                  ...el,
                  title: title || el?.title,
                  slug: slug || el?.slug,
                  value: value || el?.value,
                  status: status || el?.status,
                  gender_arr: gender_arr || el?.gender_arr,
                  is_special_offer: is_special_offer || el?.is_special_offer,
                };
                if (req.files && req.files?.image?.length) {
                  obj.image = req.files?.image[0]?.filename || el?.image;
                }
                return obj;
              } else {
                return el;
              }
            });
            // let tempobj=categoriesArr?.find((el)=>el?.id==id)
            // categoriesArr.push(tempObj);////
            let obj = {
              categories: categoriesArr,
            };
            await filterProduct.update(obj, { where: { id: fetchDbData?.id } });
            if (req.files && req.files?.image?.length) {
              if(nameImage){
                try {
                  let filePath = `./src/uploads/filterProduct/category/${nameImage}`;
                  await fs.unlinkSync(filePath);
                } catch (err) {
                  console.log(err, "erro add only category ");
                }
                try{
                  await deleteCdnFile(nameImage, "category");
                }catch(err){console.log(err,"eroro ");}
              }
            }
            return res.status(200).json({
              message: "Category update successfully",
              statusCode: 200,
              success: true,
            });
          }
        } else {
          tempObj.image = image;
          categoriesArr.push(tempObj);
          let obj = {
            categories: categoriesArr,
          };
          await filterProduct.update(obj, { where: { id: fetchDbData?.id } });
          return res.status(200).json({
            message: "Category added successfully",
            statusCode: 200,
            success: true,
          });
        }
      }
    } catch (err) {
      console.log(err, "Error incat");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async addOnlyGenderData(req, res) {
    try {
      let { value, status, id, dbImage } = req.body;

      let fetchDbData = await filterProduct.findOne({ raw: true });
      // let categoriesDbArr = fetchDbData?.categories;
      let genderDbArr = fetchDbData?.gender;
      let genderArr = genderDbArr?.length ? [...genderDbArr] : [];
      let lengthCheck = genderArr.length + 1;
      if (genderArr && genderArr?.length > 0) {
        lengthCheck = genderArr[genderArr?.length - 1]?.id + 1;
      }
      let image = "";
      // console.log(req.file,"reeeeeeeeeeeeeeeeeeeee")
      if (req.files && req.files?.image?.length) {
        image = req.files?.image[0]?.filename || dbImage;
        try {
          await cdnFuncCall(
            req.files?.image[0]?.filename,
            req.files?.image[0]?.path,
            "gender"
          );
        } catch (err) {
          console.log(err, " uplod in cdn");
        }
      }

      let tempObj = {
        id: lengthCheck,
        value,
        status,
      };

      if (!fetchDbData) {
        tempObj.image = image;
        genderArr.push(tempObj);
        let obj = {
          gender: genderArr,
        };
        await filterProduct.create(obj);

        return res.status(200).json({
          message: "Gender added successfully",
          statusCode: 200,
          success: true,
        });
      } else {
        if (id != "" && id != undefined) {
          let nameImage = "";
          let findData = genderArr?.find((el) => el?.id == id);
          if (!findData) {
            return res.status(400).json({
              message: "Gender not found",
              statusCode: 400,
              success: false,
            });
          } else {
            genderArr = genderArr.map((el) => {
              if (el?.id == id) {
                nameImage = el?.image;
                let obj = {
                  ...el,
                  value: value || el?.value,
                  status: status || el?.status,
                };
                if (req.files && req.files?.image?.length) {
                  obj.image = req.files?.image[0]?.filename || el?.image;
                }
                return obj;
              } else {
                return el;
              }
            });
            // tempObj.image = image || dbImage;
            // genderArr.push(tempObj);
            let obj = {
              gender: genderArr,
            };
            await filterProduct.update(obj, { where: { id: fetchDbData?.id } });
            if (req.files && req.files?.image?.length) {
              try {
                let filePath = `./src/uploads/filterProduct/gender/${nameImage}`;
                await fs.unlinkSync(filePath);
              } catch (err) {
                console.log(err, "err fs.unSync");
              }
              try {
                await deleteCdnFile(nameImage, "gender");
              } catch (err) {
                console.log(err, "err in cdn delete");
              }
            }
            return res.status(200).json({
              message: "Gender Update successfully",
              statusCode: 200,
              success: true,
            });
          }
        } else {
          tempObj.image = image || dbImage;
          genderArr.push(tempObj);
          let obj = {
            gender: genderArr,
          };
          await filterProduct.update(obj, { where: { id: fetchDbData?.id } });
          return res.status(200).json({
            message: "Gender added successfully",
            statusCode: 200,
            success: true,
          });
        }
      }
    } catch (err) {
      console.log(err, "Error incat");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  //done
  async changeCategoryStatus(req, res) {
    try {
      // console.log(req.body, "reeeeeeeeeeeeeeeeeee");
      let { title, id, status, value, dbImage } = req.body;
      let imageData = "";
      if (req.files && req.files && req.files?.image?.length) {
        imageData = req.files?.image[0]?.filename;
      }
      let findCategory = await filterProduct.findOne({
        raw: true,
      });
      let existCheck;

      for (let el in findCategory) {
        if (el == title) {
          existCheck = findCategory[el];
          findCategory[el]?.find((el) => {
            if (el?.id == id) {
              el.status = status;
              if (title != "price_range") {
                el.value = value || el.value;
              }
              if (title == "categories" || title == "gender") {
                el.image = imageData || el.image;
              }
            }
          });
        }
      }
      let findIdExist = existCheck.find((el) => el?.id == id);
      if (!findIdExist) {
        return res.status(400).json({
          message: "Category id is not exist",
          statusCode: 400,
          success: false,
        });
      }
      await filterProduct.update(findCategory, {
        where: { id: findCategory?.id },
      });

      return res.status(200).json({
        message: "Category status update successfully",
        statusCode: 200,
        success: true,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  //no use
  async getAllCategoryData(req, res) {
    try {
      let fetchArray = [];
      fetchArray = await CategoryModel.findAll({
        where: { status: "active", deleted_at: null },
        raw: true,
      });
      // console.log(fetchArray, "fetchArray");
      let fetch = await filterProduct.findOne();

      let gender = fetch?.gender;
      gender = gender?.filter((el) => el?.status == "active");
      for (let el of fetchArray) {
        if (!el.title?.includes("kid")) {
          el.genderData = gender;
        }
      }
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

  //working
  async getAllCategoryDataForAdmin(req, res) {
    try {
      let fetchData = await filterProduct.findOne({ raw: true });
      // fetchArray = fetchData?.categories;
      // let gender = fetchData?.gender;
      // for (let le of fetchArray) {
      //   let tempArr = [];
      //   for (let el of le?.gender_arr) {
      //     let findGEnderExist = gender?.find((ab) => ab?.id == el);
      //     if (findGEnderExist) {
      //       tempArr.push(findGEnderExist);
      //     }
      //   }
      //   le.genderData = tempArr;
      // }

      res.status(200).json({
        message: "Fetch category data",
        data: fetchData,
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

  // async editCategory(req, res) {
  //   //pending data
  //   try {
  //     let { title, id, value, status } = req.body;
  //     title = title?.trim();

  //     if (title && title != "") {
  //       let existingCategory = await CategoryModel.findOne({
  //         where: {
  //           title: title, // Replace 'YourTitleToCheck' with the title you want to check
  //           id: { [Op.ne]: id }, // Exclude the current record's ID
  //         },
  //       });
  //       if (existingCategory && existingCategory.id) {
  //         return res.status(400).json({
  //           message: "Title must be unique",
  //           success: false,
  //           statusCode: 400,
  //         });
  //       }
  //     }
  //     let fetchCategoryObj = await CategoryModel.findOne({ where: { id } });
  //     if (!fetchCategoryObj) {
  //       return res.status(400).json({
  //         message: "Category not found",
  //         statusCode: 400,
  //         success: false,
  //       });
  //     }
  //     const image = req.files?.category_image
  //       ? req.files?.category_image[0]?.filename
  //       : fetchCategoryObj?.photo;
  //     let obj = {
  //       title: title || fetchCategoryObj?.title,
  //       slug: slug || fetchCategoryObj?.slug,
  //       summary: summary || fetchCategoryObj?.summary,
  //       is_parent: is_parent || fetchCategoryObj?.is_parent,
  //       parent_id: parent_id || fetchCategoryObj?.parent_id,
  //       added_by: added_by || fetchCategoryObj?.added_by,
  //       status: status || fetchCategoryObj?.status,
  //       photo: image,
  //     };
  //     await CategoryModel.update(obj, { where: { id: id } });
  //     res.status(200).json({
  //       message: "Category Update successfully",
  //       success: true,
  //       statusCode: 200,
  //     });
  //     return;
  //   } catch (err) {
  //     console.log(err, "EEDFSD");
  //     return res
  //       .status(500)
  //       .json({ message: err?.message, success: false, statusCode: 500 });
  //   }
  // }

  // done
  async deleteCategoryById(req, res) {
    try {
      let { title, id, filter_id } = req.query;

      let findCategory = await filterProduct.findOne({
        raw: true,
      });

      if (!findCategory) {
        return res.status(404).json({
          message: "Category not found",
          statusCode: 404,
          success: false,
        });
      }
      let categoryArray = findCategory[title];

      if (!categoryArray || !Array.isArray(categoryArray)) {
        return res.status(400).json({
          message: "Invalid category array",
          statusCode: 400,
          success: false,
        });
      }
      let findDataExist = categoryArray.find((el) => el?.id == id);
      if (!findDataExist) {
        return res.status(400).json({
          message: "Category not found or deleted already",
          statusCode: 400,
          success: false,
        });
      }
      findCategory[title] = categoryArray.filter((elem) => elem?.id != id);
      await filterProduct.update(findCategory, {
        where: { id: findCategory?.id },
      });
      try {
        let obj = categoryArray.find((elem) => elem?.id == id);
        if (obj && obj?.image?.length) {
          let filePath = `./src/uploads/filterProduct/category/${obj?.image}`;
          if (title != "categories" && title != "shape") {
            filePath = `./src/uploads/filterProduct/${title}/${obj?.image}`;
          }
          await fs.unlinkSync(filePath);
        }
        try {
          await deleteCdnFile(obj?.image, title);
        } catch (err) {
          console.log(err, "err in cdn delete");
        }
      } catch (err) {
        console.log(err, "erro add only category ");
      }

      return res.status(200).json({
        message: "Category deleted successfully",
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      console.log(err, "E delte");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
}

const CategoryServicesObj = new CategoryServices();
export default CategoryServicesObj;
