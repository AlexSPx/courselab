import React from "react";
import useHasImage from "../../Hooks/useHasImage";
import { CourseGeneralInterface } from "../../interfaces";
import Image from "next/image";
import Link from "next/link";

export default function Card({ course }: { course: CourseGeneralInterface }) {
  const { url } = useHasImage(`${course.name}`, {
    type: "course_logo",
    width: 500,
    height: 500,
  });

  return (
    <Link href={`/course/${course.name}`}>
      <a className="block md:w-3/4 xl:w-1/2 overflow-hidden bg-white shadow-xl rounded-2xl hover:bg-slate-50">
        <div className="w-full h-48 relative">
          <Image
            src={url}
            layout="fill"
            objectFit="cover"
            alt={`${course.public_name} banner`}
          />
        </div>
        <div className="relative pt-20 text-center">
          <div
            className="
          
            absolute
            w-24
            h-24
            rounded-lg
            shadow-xl
            transform
            -translate-x-1/2
            -top-10
            left-1/2
          "
          >
            <Image
              src={url}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
              alt={`${course.public_name} banner`}
            />
          </div>
          <div className="px-6 sm:px-12">
            <h5 className="text-xl font-bold text-gray-900">
              {course.public_name}
            </h5>
            <p className="mt-2 text-sm text-gray-500">
              {course.details.description}
            </p>
          </div>
          <dl
            className="
            flex flex-col
            items-center
            justify-center
            px-6
            py-4
            mt-6
            border-t border-gray-100
            sm:flex-row sm:items-start sm:px-12
          "
          >
            <div className="flex items-center">
              <span className="flex-shrink-0 p-1 text-white bg-green-600 rounded-full">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
              <span
                className="
                flex
                ml-3
                text-sm
                font-medium
                text-gray-600
                space-x-1 space-x-reverse
              "
              >
                <dt>Reviews</dt>
                <dd className="order-first">12,540</dd>
              </span>
            </div>
            <div className="flex items-center mt-3 sm:ml-6 sm:mt-0">
              <span className="flex-shrink-0 p-1 text-white bg-green-600 rounded-full">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </span>
              <span
                className="
                flex
                ml-3
                text-sm
                font-medium
                text-gray-600
                space-x-1 space-x-reverse
              "
              >
                <dt>Students</dt>
                <dd className="order-first">1,520,404</dd>
              </span>
            </div>
          </dl>
        </div>
      </a>
    </Link>
  );
}
