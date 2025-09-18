import multer from "multer";
import path from "path";
import fs from "fs";

const uploadFolder = "./uploads/profile_pics";
if (!fs.existsSync(uploadFolder))
  fs.mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only images allowed"), false);
};

export const upload = multer({ storage, fileFilter });

export const uploadSingle = (field) => {
  const handler = upload.single(field);
  return async (ctx, next) =>
    new Promise((resolve, reject) => {
      handler(ctx.req, ctx.res, (err) => {
        if (err) return reject(err);
        ctx.file = ctx.req.file; // pass file to Koa ctx
        resolve(next());
      });
    });
};
