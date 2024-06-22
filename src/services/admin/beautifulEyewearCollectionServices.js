import {
  cdnFuncCall,
  deleteCdnFile,
  removefIle,
} from "../../helpers/validateImageFile.js";
import BeautifulEyewearCollection from "../../models/BeautifulEyewearCollection.js";
class BeautifulEyewearCollectionServices {
  async addBeautifulEyewear(req, res) {
    try {
      if (req.query.id) {
        let obj;
        if (req?.file?.filename) {
          obj = {
            name: req.body.name,
            slug: req.body.slug,
            image: req.file.filename,
          };
        } else {
          obj = {
            name: req.body.name,
            slug: req.body.slug,
          };
        }
        if (req.file.filename) {
          let findData = await BeautifulEyewearCollection.findOne({
            where: { id: req.query.id },
            raw: true,
            attributes: ["image", "name", "id"],
          });
          // console.log(findData,"######################");
          if (findData && findData?.id) {
            // console.log(findData,"finddtaataatt");
            try {
              await removefIle(findData?.image, "ui");
            } catch (err) {
              console.log(err, "error in delete uplaod folder");
            }
            try {
              await deleteCdnFile(findData?.image, "ui");
            } catch (err) {
              console.log(err, "err in cdn delete");
            }
          }
          try {
             cdnFuncCall(req.file?.filename, req.file?.path, "ui");
          } catch (err) {
            console.log(err, " uplod in cdn");
          }
        }
        BeautifulEyewearCollection.update(obj, { where: { id: req.query.id } })
          .then((response) => {
            return res
              .status(201)
              .json({ success: true, message: "Values updated" });
          })
          .catch((error2) => {
            return res
              .status(500)
              .json({ success: false, message: error2?.message });
          });
      } else {
        const data = await BeautifulEyewearCollection.findOne({
          where: {
            name: req.body.name,
          },
          raw: true,
        });
        console.log(data);
        if (data) {
          return res
            .status(400)
            .json({ success: false, message: "Data already exist" });
        } else {
          try {
            console.log(req.file,"req.fileq.filesreq.file");
             cdnFuncCall(req.file?.filename, req.file?.path, "ui");
          } catch (err) {
            console.log(err, " uplod in cdn");
          }
          BeautifulEyewearCollection.create({
            name: req.body.name,
            slug: req.body.slug,
            image: req.file.filename,
          })
            .then(async (response) => {
              return res
                .status(201)
                .json({ success: true, message: "New collection created" });
            })
            .catch((error1) => {
              return res
                .status(500)
                .json({ success: false, message: error1?.message });
            });
        }
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
  async deleteBeautifulEyewear(req, res) {
    try {
      let findData=await BeautifulEyewearCollection.findOne({where:{id: req.params.id},raw:true})
      if(findData&&findData?.id){
        console.log(findData,"@@@@@2findDatafindData");
        try {
          await removefIle(findData?.image,'ui');
        } catch (err) {
          console.log(err, "error in delete uplaod folder");
        }
        try {
          await deleteCdnFile(findData?.image, "ui");
        } catch (err) {
          console.log(err, "err in cdn delete");
        }
      } 
      BeautifulEyewearCollection.destroy({ where: { id: req.params.id } })
        .then((response) => {
          return res
            .status(201)
            .json({ success: false, message: "deleted successfully" });
        })
        .catch((error1) => {
          return res
            .status(500)
            .json({ success: false, message: error1?.message });
        });
    } catch (error) {
      return res.status(500).json({ success: false, message: error?.message });
    }
  }
  async getBeautifulEyewear(req, res) {
    try {
      const data = await BeautifulEyewearCollection.findAll({});
      return res
        .status(200)
        .json({ success: true, message: "Data fetched", data: data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
}

const beautifulEyewearCollectionServicesObj =
  new BeautifulEyewearCollectionServices();

export default beautifulEyewearCollectionServicesObj;
