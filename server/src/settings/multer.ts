import e, { Request } from "express";
import { existsSync, unlinkSync } from "fs";
import multer, { FileFilterCallback } from "multer";
import path from "path";

const avatar_storage = multer.diskStorage({
  destination: function (req, _file, cb) {
    const apath = path.join(
      __dirname,
      `../images/avatars/${req.body.username}`
    );

    if (existsSync(apath)) unlinkSync(apath);
    cb(null, "images/avatars");
  },
  filename: function (req, _file, cb) {
    cb(null, req.body.username + "-org.jpg");
  },
});

const courseimg_storage = multer.diskStorage({
  destination: function (req, _file, cb) {
    const apath = path.join(
      __dirname,
      `../images/courseImage/${req.body.name}`
    );

    if (existsSync(apath)) unlinkSync(apath);
    cb(null, "images/courseImage");
  },
  filename: function (req, _file, cb) {
    cb(null, req.body.name + "-org.jpg");
  },
});

const coursedetails_storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "images/courses");
  },
  filename: function (_req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const coursedetails_sponsors_storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    console.log(_file);

    cb(null, "images/courses");
  },
  filename: function (req, _file, cb) {
    cb(null, `${req.params.course}-sponsor-${req.params.sponsor}.jpg`);
  },
});

const video_storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "videos/");
  },
  filename: function (req, file, cb) {
    const path = `${Date.now()}-${file.originalname}`;
    req.body.path = path;
    cb(null, path);
  },
});

const file_uploader = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "files/");
  },
  filename: function (req, file, cb) {
    const path = `${req.session.user?.username}###${Date.now()}###${
      file.originalname
    }`;
    req.body.path = path;
    cb(null, path);
  },
});

const CourseSponsorFilter = (
  req: Request,
  _file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const apath = path.join(
    __dirname,
    `../../images/courses/${req.params.course}-sponsor-${req.params.sponsor}.jpg`
  );

  if (existsSync(apath)) {
    req.body.skip = true;
    cb(null, false);
    return;
  }
  cb(null, true);
};

export const uploadAvatar = multer({ storage: avatar_storage });
export const uploadCourseImg = multer({ storage: courseimg_storage });
export const uplaodCourseImages = multer({ storage: coursedetails_storage });
export const uplaodCourseSponsorImages = multer({
  fileFilter: CourseSponsorFilter,
  storage: coursedetails_sponsors_storage,
});
export const uploadVideo = multer({ storage: video_storage });
export const uploadFile = multer({ storage: file_uploader });
