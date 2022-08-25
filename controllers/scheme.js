const Scheme = require("../models/scheme");
const User = require("../models/user");
const fs = require('fs');

// ERROR: DISSCUSS ON WHATSAPP

exports.getSchemeById = (req, res, next, id) => {
  console.log("in getSchemeById");
  Scheme.findById(id).exec((err, scheme) => {
    if (err || !scheme) {
      return res.status(400).json({
        error: "No Scheme was found in DB",
      });
    }
    req.scheme = scheme;
    next();
  });
};

exports.findallSchemes = (req, res) => {
  // console.log("inside scheme route");
  Scheme.find({}, (err, schemes) => {
    if (err) {
      return res.json({
        error: err,
      });
    }
    res.status(200).json(schemes);
  });
};

exports.createNewScheme = (req, res) => {
  let img = fs.readFileSync(req.files.image[0].path);
  let file = fs.readFileSync(req.files.files[0].path);
  let encode_img = img.toString("base64");
  let encode_file = file.toString("base64");
  let final_img = {
    contentType: req.files.image[0].mimetype,
    image: Buffer.from(encode_img, "base64"),
  };
  let final_file = {
    contentType: req.files.files[0].mimetype,
    file: Buffer.from(encode_file, "base64"),
  };
  const { compTitle, organizer, deadline, starting, ending, registrationLink } =
    req.body;
  const scheme = new Scheme({
    compTitle,
    organizer,
    deadline,
    starting,
    ending,
    registrationLink,
    fileLink: final_file,
    imageLink: final_img,
  });
  // const schemeId = scheme._id;
  // const user = req.profile;
  // scheme.user = user;
  scheme.save((err, scheme) => {
    if (err) {
      res.json({
        error: err,
      });
    }
    res.json(scheme);
  });
};

exports.DeleteScheme = (req, res) => {
  let scheme = req.scheme;
  console.log(req.scheme);
  scheme.remove((err, deletedScheme) => {
    if (err || !deletedScheme) {
      res.status(400).json({
        error: err,
      });
    }
    res.json({
      message: "scheme deleted",
      deletedScheme,
    });
  });
};

// exports.createNewScheme = (req, res) => {
//   let form = new formidable.IncomingForm();
//   form.keepExtensions = true;
//   form.parse(req, (err, fields, file) => {
//     if (err) {
//       console.log("error");
//       console.log(err);
//       return res.status(400).json({
//         error: "problem with uploads",
//       });
//     }

//     let scheme = new Scheme(fields);
//     scheme.details.data = fs.readFileSync(file.details.path);
//     scheme.details.contentType = file.details.type;
//     scheme.image.data = fs.readFileSync(file.image.path);
//     scheme.image.contentType = file.image.type;

//     scheme.save((err, scheme) => {
//       if (err) {
//         res.status(400).json({
//           error: "saving failed",
//         });
//       }
//       res.status(200).json(scheme);
//     });
//   });
// };
