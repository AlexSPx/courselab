import { GetServerSideProps } from "next";
import { getServerSideSitemap, ISitemapField } from "next-sitemap";
import axios from "axios";
import { baseurl } from "../../lib/fetcher";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { data: popularCourses } = await axios.get(
    `${baseurl}/course/mostpopular`
  );

  const courses: any[] = popularCourses.map((course: any) => ({
    loc: `https://course-lab.xyz/course/${course.name}`,
    lastmod: new Date().toISOString(),
  }));

  const fields: ISitemapField[] = [...courses];

  return getServerSideSitemap(ctx, fields);
};

export default function Site() {}
