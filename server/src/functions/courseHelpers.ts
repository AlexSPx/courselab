import { AssignmentSubmits } from "@prisma/client";
import { unlinkSync } from "fs";
import path from "path";

const basepath = (fileName: string) =>
  path.join(__dirname + `../../../files/${fileName}`);

export const deleteAttachments = async (submits: AssignmentSubmits[]) => {
  if (!submits) return;
  submits.forEach((submit) => {
    submit.attachments.forEach((attachment) => {
      if (!attachment) return;

      if (attachment.hasOwnProperty("path")) {
        unlinkSync(basepath((attachment as any).path));
      } else if (attachment.hasOwnProperty("doc")) {
      }
    });
  });
};
