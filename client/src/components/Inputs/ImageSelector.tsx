import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function ImageSelector({
  image,
  setImage,
  shape = "circle",
  label = "Select",
  previewN,
}: {
  image: File | undefined;
  setImage: React.Dispatch<React.SetStateAction<File | undefined>>;
  shape?: "square" | "circle";
  label?: string;
  previewN?: string;
}) {
  const [preview, setPreview] = useState<string | null>(
    previewN ? previewN : null
  );

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      if (!previewN) setPreview(null);
      else setPreview(previewN);
    }
  }, [image, previewN]);

  return (
    <label className="relative flex w-full h-full">
      {preview ? (
        <Image
          layout="fill"
          src={preview}
          className={`flex ${shape} cursor-pointer object-cover`}
          alt="avatar"
        />
      ) : (
        <div
          className={`flex w-full h-full bg-gray-400 cursor-pointer object-cover ${shape} items-center justify-center text-white text-xl font-light text-center`}
        >
          {label}
        </div>
      )}
      <input
        type="file"
        className="hidden"
        onChange={(e: React.ChangeEvent<any>): void =>
          setImage(e.target.files[0])
        }
        accept="image/*"
      />
    </label>
  );
}
