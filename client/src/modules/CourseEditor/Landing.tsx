import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import { CourseInterface } from "../../interfaces";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "rgb(209 213 219)",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export default function Landing({ course }: { course: CourseInterface }) {
  const [files, setFiles] = useState<File[]>();

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: "image/*",
      onDrop: (acceptedFiles) => {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );
      },
    });

  const renderPreviewImages = files?.map((file) => {
    return (
      <div className="flex relative" key={file.name}>
        <Image src={file.preview} layout="fill" alt="" />
      </div>
    );
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div className="flex flex-col h-full w-full items-center">
      <p className="flex font-bold text-2xl text-center">
        {course.public_name} - Landing page
      </p>

      <div className="flex flex-row w-[95%] h-[32rem] mt-6">
        <div className="flex w-3/4 border border-gray-300 mx-2 rounded"></div>
        <div
          {...getRootProps({ style: style as any })}
          className="w-full items-center justify-center max-h-[32rem]"
        >
          <input {...getInputProps()} />
          <p>Drag n drop some files here, or click to select files</p>
        </div>
      </div>
    </div>
  );
}

declare module File {
  interface File {
    preview: string;
  }
}
