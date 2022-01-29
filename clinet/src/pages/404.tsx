import Link from "next/link";
import React from "react";

export default function Custom404() {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center font-light">
      <div className="border-b p-4 border-gray-800 text-2xl">
        404 - Page Not Found
      </div>

      <Link href="/">
        <a className="uppercase py-1 px-3 bg-gray-800 border border-transparent text-white text-md hover:bg-gray-900 font-extralight mt-2 text-xl">
          Go Back Home
        </a>
      </Link>
    </div>
  );
}
