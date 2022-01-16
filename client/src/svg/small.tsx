export const BurgerMenu = () => {
  return (
    // <svg
    //   width={1}
    //   height={1}
    //   fill="currentColor"
    //   className="h-8 w-8"
    //   viewBox="0 0 1792 1792"
    //   xmlns="http://www.w3.org/2000/svg"
    // >
    //   <path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z"></path>
    // </svg>
    <>
      <div className="w-6 h-1 bg-gray-800 dark:bg-white mb-1"></div>
      <div className="w-6 h-1 bg-gray-800 dark:bg-white mb-1"></div>
      <div className="w-6 h-1 bg-gray-800 dark:bg-white mb-1"></div>
    </>
  );
};

export const EmailIcon = () => {
  return (
    <svg
      width={15}
      height={15}
      fill="currentColor"
      viewBox="0 0 1792 1792"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1792 710v794q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-794q44 49 101 87 362 246 497 345 57 42 92.5 65.5t94.5 48 110 24.5h2q51 0 110-24.5t94.5-48 92.5-65.5q170-123 498-345 57-39 100-87zm0-294q0 79-49 151t-122 123q-376 261-468 325-10 7-42.5 30.5t-54 38-52 32.5-57.5 27-50 9h-2q-23 0-50-9t-57.5-27-52-32.5-54-38-42.5-30.5q-91-64-262-182.5t-205-142.5q-62-42-117-115.5t-55-136.5q0-78 41.5-130t118.5-52h1472q65 0 112.5 47t47.5 113z"></path>
    </svg>
  );
};

export const PasswordIcon = () => {
  return (
    <svg
      width={15}
      height={15}
      fill="currentColor"
      viewBox="0 0 1792 1792"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z"></path>
    </svg>
  );
};

export const ErrorIcon = () => {
  return (
    <svg
      className="h-6 w-6 text-red-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
};

export const CheckIcon = () => {
  return (
    <svg
      className="w-6 h-6 text-green-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
};

export const Loading = ({ css }: { css?: string }) => {
  return (
    <div
      className={`loader ease-linear rounded-full border-2 border-t-2 border-gray-200 h-32 w-32 ${css}`}
    ></div>
  );
};

export const LoadingFlexCenter = ({ css }: { css?: string }) => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div
        className={`loader ease-linear rounded-full border-2 border-t-2 border-gray-200 ${css}`}
      ></div>
    </div>
  );
};

export const Heart = () => {
  return (
    <svg
      width={25}
      height={25}
      fill="currentColor"
      viewBox="0 0 1792 1792"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1664 596q0-81-21.5-143t-55-98.5-81.5-59.5-94-31-98-8-112 25.5-110.5 64-86.5 72-60 61.5q-18 22-49 22t-49-22q-24-28-60-61.5t-86.5-72-110.5-64-112-25.5-98 8-94 31-81.5 59.5-55 98.5-21.5 143q0 168 187 355l581 560 580-559q188-188 188-356zm128 0q0 221-229 450l-623 600q-18 18-44 18t-44-18l-624-602q-10-8-27.5-26t-55.5-65.5-68-97.5-53.5-121-23.5-138q0-220 127-344t351-124q62 0 126.5 21.5t120 58 95.5 68.5 76 68q36-36 76-68t95.5-68.5 120-58 126.5-21.5q224 0 351 124t127 344z"></path>
    </svg>
  );
};

export const LeftArrow = ({ css }: { css?: string }) => {
  return (
    <svg
      className={`w-6 h-6 ${css}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
};

export const RightArrow = ({ css }: { css?: string }) => {
  return (
    <svg
      className={`w-6 h-6 ${css}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
};

export const UpArrow = ({ css }: { css?: string }) => {
  return (
    <svg
      className={`w-6 h-6 ${css}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 15l7-7 7 7"
      />
    </svg>
  );
};

export const DownArrow = ({ css }: { css?: string }) => {
  return (
    <svg
      className={`w-6 h-6 ${css}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
};

export const ImageIcon = ({ css }: { css?: string }) => {
  return (
    <svg
      className={`w-6 h-6 ${css}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
};

export const StructureIcon = ({ css }: { css?: string }) => {
  return (
    <svg
      className={`w-6 h-6 ${css}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  );
};

export const SettingsIcon = ({ css }: { css?: string }) => {
  return (
    <svg
      className={`w-6 h-6 ${css}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
};

export const PlusCircle = ({ css }: { css?: string }) => {
  return (
    <svg
      className={`w-6 h-6 ${css}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};

export const VideoIcon = ({ css }: { css?: string }) => {
  return (
    <svg
      className={`w-6 h-6 ${css}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};

export const DocumentIcon = ({ css }: { css?: string }) => {
  return (
    <svg
      className={`w-6 h-6 ${css}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
};

export const QuizzIcon = ({ css }: { css?: string }) => {
  return (
    <svg
      className={`w-6 h-6 ${css}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};

export const AssignmentIcon = ({ css }: { css?: string }) => {
  return (
    <svg
      className={`w-6 h-6 ${css}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );
};

export const MoveIcon = ({ css }: { css?: string }) => {
  return (
    <svg
      className={`w-6 h-6 ${css}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
      />
    </svg>
  );
};

export const CloseIcon = ({ css }: { css?: string }) => {
  return (
    <svg
      className={`w-6 h-6 ${css}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

// Video Icons

export const PlayIcon = ({ css }: { css?: string }) => {
  return (
    <svg
      className={`${css}`}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
    </svg>
  );
};
