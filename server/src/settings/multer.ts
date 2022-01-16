import { existsSync, unlinkSync } from "fs";
import multer from "multer";
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

export const uploadAvatar = multer({ storage: avatar_storage });
export const uploadCourseImg = multer({ storage: courseimg_storage });
export const uploadVideo = multer({ storage: video_storage });
