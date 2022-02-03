import Image from "next/image";
import Link from "next/link";
import { CourseInterface } from "../../interfaces";
import useHasImage from "../../Hooks/useHasImage";

export default function CourseDraftCard({ draft }: { draft: CourseInterface }) {
  const { url } = useHasImage(`${draft.name}`, { type: "course_logo" });

  return (
    <Link href={`/course/edit/${draft.name}/general`} passHref>
      <div className="border w-44 h-32 rounded-xl flex flex-col justify-start dark:bg-gray-800 gap-4 overflow-hidden hover:border-gray-600 cursor-pointer mx-1">
        <div className="w-full h-full relative">
          <Image
            src={url}
            alt="Image"
            layout="fill"
            className="rounded-xl object-contain md:object-cover bg-gray-200"
          />
        </div>
        <p className="border-t text-center">{draft.public_name}</p>
      </div>
    </Link>
  );
}
