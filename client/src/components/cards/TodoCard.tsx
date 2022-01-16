export default function TodoCard() {
  return (
    <div className="flex flex-col bg-gray-50 w-full p-4 hover:bg-gray-100 cursor-pointer">
      <p className="text-gray-400 font-normal leading-none">9:00 PM</p>
      <p className="font-semibold text-xl mb-1">Machine Learning essentials</p>
      <p className="font-semibold text-gray-500 leading-none">
        Lorem ipsum dolor sit amet consectetur.
      </p>
      <div className="border-b-2 border-gray-600 border-dashed mt-3"></div>
    </div>
  );
}

export const TodoCardSkeleton = () => {
  return <div className="w-full h-32 bg-gray-200 animate-pulse rounded"></div>;
};
