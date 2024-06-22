import axios from "axios";
import fs from "fs";
import https from "https";

function checkFileSignature(buffer) {
  const fileSignatures = {
    "89504E470D0A1A0A": "PNG",
    FFD8FFE0: "JPEG",
    FFD8FF: "JPG",
    52494646: "WEBP",
    // Add more file signatures as needed
  };
  const hexSignature = buffer.slice(0, 8).toString("hex").toUpperCase();

  for (const signature in fileSignatures) {
    if (hexSignature.startsWith(signature)) {
      return fileSignatures[signature];
    }
  }
  return null;
}
const maxSize = 500 * 1024;
export async function ImageFileCheck(name, data, size) {
  try {
    let filePath = `./src/uploads/${name}`;
    if (data == "category") {
      filePath = `./src/uploads/filterProduct/category/${name}`;
    } else if (data == "bestSeller") {
      filePath = `./src/uploads/bestSeller/${name}`;
    } else if (data == "gender") {
      filePath = `./src/uploads/filterProduct/gender/${name}`;
    } else if (data == "educationInfo") {
      filePath = `./src/uploads/educationCertificate/${name}`;
    } else if (data == "footer") {
      filePath = `./src/uploads/footer/${name}`;
    }else if(data=='ui'){
      filePath = `./src/uploads/ui/${name}`;
      
    }
    // console.log(filePath,"filepasthhhhhhh",maxSize,"maxSizemaxSize",size,"sizesize")
    let check = fs.readFileSync(filePath);
    const filetype = checkFileSignature(check);
    // console.log(filetype,"filetypefiletype");
    if (filetype == "PNG" || filetype == "JPEG" || filetype == "WEBP"||filetype=='JPG') {
      // console.log(filetype,"  ####filetypefiletype@@@@@@@@@@2");
      if (size > maxSize) {
        // console.log(size,maxSize,"sssssssssss")
        await fs.unlinkSync(filePath);
        return "invalid file";
      } else {
        return "valid file";
      }
    } else if (filetype == null) {
      // res.status(400).json({
      //   message: "Invalid file uploaded",
      //   success: false,
      //   statusCode: 400,
      // });
      await fs.unlinkSync(filePath);
      return "invalid file";
    }
  } catch (err) {
    console.error(err, "errro");
    return false;
  }
}

export async function ImageFileCheckForUI(name, res, size) {
  try {
    const filePath = `./src/uploads/ui/${name}`;
    // console.log(filePath,"filepasthhhhhhh")
    let check = fs.readFileSync(filePath);
    const filetype = checkFileSignature(check);
    if (filetype == "PNG" || filetype == "JPEG" || filetype == "WEBP"||filetype=='JPG') {
      if (size > maxSize) {
        // console.log(size,maxSize,"sssssssssss")
        await fs.unlinkSync(filePath);
        return "invalid file";
      } else {
        return "valid file";
      }
    } else if (filetype == null) {
      // res.status(400).json({
      //   message: "Invalid file uploaded",
      //   success: false,
      //   statusCode: 400,
      // });
      await fs.unlinkSync(filePath);
      return "invalid file";
    }
  } catch (err) {
    console.error(err, "errro in ImageFileCheckForUI");
  }
}

export async function removefIle(name, data) {
  try {
    let filePath = `./src/uploads/${name}`;
    if (data == "category") {
      filePath = `./src/uploads/filterProduct/category/${name}`;
    } else if (data == "bestSeller") {
      filePath = `./src/uploads/bestSeller/${name}`;
    } else if (data == "gender") {
      filePath = `./src/uploads/filterProduct/gender/${name}`;
    } else if (data == "educationInfo") {
      filePath = `./src/uploads/educationCertificate/${name}`;
    }else if(data=='ui'){
      filePath = `./src/uploads/ui/${name}`;
    }else if(data=='footer'){
      filePath = `./src/uploads/footer/${name}`;
    }
    console.log(filePath, "filepathdwqdqw");
    await fs.unlinkSync(filePath);
  } catch (err) {
    console.error(err, "err removefIle");
  }
}

// export async function cdnFuncCall(filename, type) {
//   try {
//     let filePathOf = `./src/uploads/${filename}`;
//     console.log(filePathOf, "filePathOffilePathOf");
//     const fileData = fs.readFileSync(filePathOf);
//     let path = `/vuezen/uploads/${filename}`;

//     const options = {
//       method: "PUT",
//       host: "storage.bunnycdn.com",
//       path: path,
//       headers: {
//         AccessKey: process.env.SECRET_BUNNY,
//         "Content-Type": "application/octet-stream",
//       },
//     };
//     const cdnReq = https.request(options, (cdnRes) => {
//       cdnRes.on("data", (chunk) => {
//         console.log(chunk.toString("utf8"));
//       });
//     });
//     cdnReq.on("error", (error) => {
//       console.error(error, "aaaaaaaaaaa");
//     });
//     cdnReq.write(fileData);
//     cdnReq.end();
//   } catch (err) {
//     console.log(err, "error  in sendig image to bunny.net");
//   }
// }
let j;
export async function deleteCdnFile(filename, type) {
  try {
    let path = `https://storage.bunnycdn.com/vuezen/uploads/${filename}`;
    if (type == "categories") {
      path = `https://storage.bunnycdn.com/vuezen/uploads/filterProduct/category/${filename}`;
    } else if (type == "category") {
      path = `https://storage.bunnycdn.com/vuezen/uploads/filterProduct/category/${filename}`;
    } else if (type == "gender") {
      path = `https://storage.bunnycdn.com/vuezen/uploads/filterProduct/gender/${filename}`;
    } else if (type == "shape") {
      path = `https://storage.bunnycdn.com/vuezen/uploads/filterProduct/shape/${filename}`;
    }else if(type=='ui'){
      path = `https://storage.bunnycdn.com/vuezen/uploads/ui/${filename}`;
    }else if(type=='bestSeller'){
      path = `https://storage.bunnycdn.com/vuezen/uploads/bestSeller/${filename}`;
    }else if(type=='footer'){
      path = `https://storage.bunnycdn.com/vuezen/uploads/footer/${filename}`;
    }
    const options = {
      method: "DELETE",
      url: path,
      headers: {
        AccessKey: process.env.SECRET_BUNNY,
      },
    };
    axios
      .request(options)
      .then(function (response) {
        console.log("Images deleted");
      })
      .catch(function (error) {
        console.error(error?.message, " start error");
      });
  } catch (err) {
    console.log(err, "erorroor");
  }
}

export async function cdnFuncCall(filename, filePath, type) {
  try {
    // const filePath = `./src/uploads/${filename}`;
    console.log(filePath, "filePath !@#",type,"######");

    const fileData = fs.readFileSync(filePath);
    // ./src/uploads/filterProduct/category
    let path = `/vuezen/uploads/${filename}`;
    if (type == "category") {
      path = `/vuezen/uploads/filterProduct/category/${filename}`;
    } else if (type == "gender") {
      path = `/vuezen/uploads/filterProduct/gender/${filename}`;
    } else if (type == "shape") {
      path = `/vuezen/uploads/filterProduct/shape/${filename}`;
    }else if(type=='ui'){
      path = `/vuezen/uploads/ui/${filename}`;
    }else if(type=='bestSeller'){
      path = `/vuezen/uploads/bestSeller/${filename}`;
    }else if(type=='footer'){
      path = `/vuezen/uploads/footer/${filename}`;
    }
    const url = `https://storage.bunnycdn.com${path}`;

    const options = {
      headers: {
        AccessKey: process.env.SECRET_BUNNY,
        "Content-Type": "application/octet-stream",
      },
    };
    await axios.put(url, fileData, options);
    console.log("Image uploaded successfully");
  } catch (error) {
    console.error("Error uploading image:", error);
  }
}

// export async function deleteCdnFile(filename, type) {
//   try {
//     const path = `/vuezen/uploads/${filename}`;
//     const url = `https://storage.bunnycdn.com${path}`;

//     const options = {
//       headers: {
//         AccessKey: process.env.SECRET_BUNNY,
//       },
//     };

//     await axios.delete(url, options);

//     console.log('Image deleted successfully');
//   } catch (error) {
//     console.error('Error deleting image:', error);
//   }
// }
