import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import SeoTags from "../../components/SeoTags";
import { withSession } from "../../lib/withSession";
import Landing from "../../svg/Landing";

export const LandingPage: NextPage = () => {
  return (
    <div>
      <SeoTags
        title="CourseLab | Online courses"
        description="An online learning platform for students to access course-specific study resources. And instructors, teachers or anyone to create courses."
      />
      <div className="container mx-auto h-full mt-56 md:mt-8 px-2">
        <div className="flex flex-col-reverse md:flex-row items-center h-1/2 w-full font-thin">
          <div className="flex flex-col w-2/3 md:w-1/2 justify-center text-left">
            <h1 className="text-3xl md:text-5xl font-semibold">
              Create and Enroll in courses <br className="hidden mg:flex" /> for
              free with <strong>CourseLab</strong>
            </h1>
            <h2 className="text-xl font-normal">
              An online learning platform for students to access course-specific{" "}
              <br className="hidden mg:flex" />
              study resources. And instructors, teachers or anyone to create
              courses
            </h2>
            <Link href="/register">
              <a className="btn btn-outline w-44 mt-6">Get Started</a>
            </Link>
          </div>
          <div className="flex w-full md:w-1/2 h-full justify-center">
            <div className="flex w-3/5 md:w-full justify-center">
              <Landing />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req }) => {
    return {
      props: {
        user: req.user || null,
      },
    };
  },
  {
    requiresAuth: false,
  }
);
