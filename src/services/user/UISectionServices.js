import UiSection from "../../models/UISectionsModel.js";
import UISectionCards from "../../models/UISectionCardsModel.js";
class UISectionServices {
  async getLandingPageData(res) {
    try {
      let fetchData = await UiSection.findAll({ where: { status: "active" } });
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
  async getSectionInfoByCategory(req, res) {
    try{
    // console.log(req.params, "reqqqqqqqqqqqqqqqqqqqqqqqq");
    

    let findObj = await UiSection.findOne({
      where: { id: req.params.category },raw:true
    });
    if (findObj)
      return res.status(200).json({
        success: true,
        message: "Data fetched successfully",
        statusCode: 200,
        data: findObj,
      });
    }catch(err){
      return res
      .status(500)
      .json({ message: err?.message, statusCode: 500, success: false });
    }
  }
  // async addUISections(body, res) {
  //   const uisectioninfo = await UiSection.findOne({
  //     where: { position: body.position },
  //   });
  //   if (uisectioninfo) {
  //     UiSection.update(
  //       {
  //         // module_name: body.module_name || uisectioninfo.module_name,
  //         slug: body.slug || uisectioninfo.slug,
  //         module_heading: body.module_heading || uisectioninfo.module_heading,
  //         title: body.title || uisectioninfo.title,
  //         module_description:
  //           body.module_description || uisectioninfo.module_description,
  //         image: body.image || uisectioninfo.image,
  //         status: body.status || uisectioninfo.status,
  //         remarks: body.remarks || uisectioninfo.remarks,
  //         position: body.position || uisectioninfo.position,
  //       },
  //       { where: { id: uisectioninfo.id } }
  //     );
  //     // .then((response) => {
  //     return res
  //       .status(200)
  //       .json({
  //         success: true,
  //         message: "Update Successfully ",
  //         statusCode: 200,
  //       });
  //     // })
  //     // .catch((error) => {
  //     //   return res
  //     //     .status(500)
  //     //     .json({ success: true, message: error?.message });
  //     // });
  //   } else {
  //     UiSection.create(body);
  //     // .then((response) => {
  //     return res
  //       .status(201)
  //       .json({
  //         success: true,
  //         message: "Added Successfully ",
  //         statusCode: 201,
  //       });
  //     // })
  //     // .catch((error) => {
  //     //   return res
  //     //     .status(500)
  //     //     .json({ success: true, message: error?.message });
  //     // });
  //   }
  //   // return res
  //   //   .status(201)
  //   //   .json({ success: true, message: "Added Successfully " });
  // }
  async getLandingPageSections(id, res) {
    try {
      
      const sectiondata = UISectionCards.findAll({ ui_section_id: id });
      if (sectiondata) {
        return res.status(200).json({
          success: true,
          message: "Data fetched successfully",
          data: sectiondata,
        });
      } else {
        return res
          .status(200)
          .json({ success: false, message: "data not available for given id" });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
}
const UISectionServicesObj = new UISectionServices();
export default UISectionServicesObj;
