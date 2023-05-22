import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { ResponseUtl } from "../../utils/Response";

export class ImagesController {
  async get(req: Request, res: Response, next: NextFunction) {
    const { type, id } = req.params;
    const imagesType = ["authors", "books"];
    if (!imagesType.includes(type)) {
      return ResponseUtl.sendError(res, "Invalid image type", null);
    }

    let filePath = path.join(__dirname, "../../../", "uploads", type, id);

    if (!fs.existsSync(filePath)) {
      return ResponseUtl.sendError(res, "Invalid image", null, 404);
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        return ResponseUtl.sendError(
          res,
          "Invalid image / image read error",
          null,
          404
        );
      }

      res.set("Content-Type", "image/jpeg");
      res.send(data);
    });
  }
}
