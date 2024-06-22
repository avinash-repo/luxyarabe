import beautifulEyewearCollectionServicesObj from "../../services/admin/beautifulEyewearCollectionServices.js";
import { BeautifulEyewearCollectionSchema } from "../../helpers/beautifulEyewearCollectionSchema.js";
import { ImageFileCheck, removefIle } from "../../helpers/validateImageFile.js";
const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};
class BeautifulEyewearCollection {
  async addBeautifulEyewearCollection(req, res) {
    try{

      const { error } = BeautifulEyewearCollectionSchema.validate(
        req.body,
        options
      );
      if (error) {
        return res.status(400).json({ success: false, message: error?.message });
      }
      // console.log(req.file,"req.filesssssssssssss   @@@ ### $$$$ ");
      if (req.file && req.file) {
      let name = req.file?.filename;
      let size = req.file?.size;
      let get = await ImageFileCheck(name, 'ui', size);
      if (get == "invalid file") {
        try {removefIle(name,'ui')} catch (er) {console.log(er,"eoror in remove image")  }
        return res.status(400).json({
          message:
            "Image must be png or jpeg or webp file and size must be less than 500 kb",
          statusCode: 400,
          success: false,
        });
      }
    } 
    // else {
      //   return res.status(400).json({
        //     message: "Image is mandatory",
        //     success: false,
        //     statusCode: 400,
        //   });
        // }
        beautifulEyewearCollectionServicesObj.addBeautifulEyewear(req, res);
      }catch(err){
        return res.status(500).json({message:err?.message,statusCode:500,success:false})
      }
    }
  async deleteBeautifulEyewearCollection(req, res) {
    beautifulEyewearCollectionServicesObj.deleteBeautifulEyewear(req, res);
  }

async getBeautifulEyewearCollection(req, res) {
    beautifulEyewearCollectionServicesObj.getBeautifulEyewear(req, res);
  }
}
const beautifulEyewearCollectionControllerObj =
  new BeautifulEyewearCollection();
export default beautifulEyewearCollectionControllerObj;
