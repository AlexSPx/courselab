import { Request, Response, NextFunction } from "express";
import { join } from "path";
import sharp from "sharp";

const paths = new Map([
  ["/api/user/avatars/", join(__dirname, "../../images/avatars")],
  ["/api/course/logo/", join(__dirname, "../../images/courseImage")],
  ["/api/course/images/", join(__dirname, "../../images/courses")],
]);

export default function resizingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const data = parseResizingURI(req.baseUrl); // Extract data from the URI

  if (!data) {
    return next();
  } // Could not parse the URI

  resizeImage(data.path, data.width, data.height)
    .then((buffer) => {
      // Success. Send the image
      res.set("Content-type", `image/${data.extension || "png"}`); // using 'mime-types' package
      res.send(buffer);
    })
    .catch(next); // File not found or resizing failed
}

function limitNumberToRange(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

function parseResizingURI(uri: any) {
  // Attempt to extract some variables using Regex
  const matches = uri.match(
    /(?<path>.*\/)(?<name>[^\/]+)_(?<width>\d+)x(?<height>\d+)(?<extension>\.[a-z\d]+)$/i
  );

  if (matches) {
    const { path, name, width, height, extension } = matches.groups;

    const folderPath = paths.get(path) || "";
    return {
      path: join(folderPath, `${name}${extension}`), // Original file path
      width: limitNumberToRange(+width, 16, 2000), // Ensure the size is in a range
      height: limitNumberToRange(+height, 16, 2000), // so people don't try 999999999
      extension: extension,
    };
  }
  return false;
}

function resizeImage(path: string, width: number, height: number) {
  return sharp(path)
    .resize({
      width,
      height,
      // Preserve aspect ratio, while ensuring dimensions are <= to those specified
      fit: sharp.fit.inside,
    })
    .toBuffer();
}
