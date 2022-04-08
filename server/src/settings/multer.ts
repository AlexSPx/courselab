import { Request } from "express";
import { existsSync } from "fs";
import { unlink } from "fs/promises";
import multer, { FileFilterCallback } from "multer";
import path from "path";

const baseFolder =
  process.env.NODE_ENV === "production"
    ? "../../../../../serverStorage/"
    : "../../../";
export const baseDir = path.join(__dirname + baseFolder);

const avatar_storage = multer.diskStorage({
  destination: async function (req, _file, cb) {
    const username = req.body.username || req.params.username;
    const apath = path.join(
      baseDir,
      `images/avatars/${username.toLowerCase()}`
    );

    if (existsSync(apath)) await unlink(apath);
    cb(null, baseDir + "images/avatars");
  },
  filename: function (req, _file, cb) {
    const username = req.body.username || req.params.username;
    cb(null, username.toLowerCase() + "-org.jpg");
  },
});

const courseimg_storage = multer.diskStorage({
  destination: async function (req, _file, cb) {
    const apath = path.join(
      baseDir,
      `images/courseImage/${req.body.name.toLowerCase()}`
    );

    if (existsSync(apath)) await unlink(apath);
    cb(null, baseDir + "images/courseImage");
  },
  filename: function (req, _file, cb) {
    cb(null, req.body.name.toLowerCase() + "-org.jpg");
  },
});

const coursedetails_storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, baseDir + "images/courses");
  },
  filename: function (_req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.toLowerCase()}`);
  },
});

const coursedetails_sponsors_storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, baseDir + "images/courses");
  },
  filename: function (req, _file, cb) {
    cb(
      null,
      `${req.params.course.toLowerCase()}-sponsor-${req.params.sponsor.toLowerCase()}.jpg`
    );
  },
});

const video_storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, baseDir + "videos/");
  },
  filename: function (req, file, cb) {
    const path = `${Date.now()}-${file.originalname.toLowerCase()}`;
    req.body.path = path;
    cb(null, path);
  },
});

const file_uploader = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, baseDir + "files/");
  },
  filename: function (req, file, cb) {
    const path = `${req.session.user?.username.toLowerCase()}{-divide-}${Date.now()}{-divide-}${file.originalname.toLowerCase()}`;
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
    baseDir,
    `images/courses/${req.params.course.toLowerCase()}-sponsor-${req.params.sponsor.toLowerCase()}.jpg`
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
