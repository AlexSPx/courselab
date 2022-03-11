import { AssignmentSubmits } from "@prisma/client";
import { unlink } from "fs/promises";
import path from "path";

const basepath = (fileName: string) =>
  path.join(__dirname + `../../../files/${fileName}`);

export const deleteAttachments = async (submits: AssignmentSubmits[]) => {
  if (!submits) return;
  submits.forEach((submit) => {
    submit.attachments.forEach((attachment) => {
      if (!attachment) return;

      if (attachment.hasOwnProperty("path")) {
        unlink(basepath((attachment as any).path));
      } else if (attachment.hasOwnProperty("doc")) {
      }
    });
  });
};
