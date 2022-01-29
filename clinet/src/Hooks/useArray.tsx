import { useState } from "react";

export default function useArray(defaultValue: any[]) {
  const [array, setArray] = useState(defaultValue);

  function push(element: any) {
    setArray((arr) => [...arr, element]);
  }

  function filter(callback: any) {
    setArray((arr) => arr.filter(callback));
  }

  function remove(condition: any) {
    setArray((arr) => [arr.filter(condition)]);
  }

  return { array, set: setArray, push, filter, remove };
}
