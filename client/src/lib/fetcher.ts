import axios from "axios";

export const baseurl = `http://localhost:5000/api`;
export const absurl = `http://localhost:5000`;
export const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);
