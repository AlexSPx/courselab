import { NextPage } from "next";
import SeoTags from "../../components/SeoTags";

export const FAQ: NextPage = () => {
  const FAQ = ({ Q, A }: { Q: string; A: string }) => {
    return (
      <li className="w-2/5">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{Q}</h3>
        <p className="mt-2"></p>
        <p className="text-base leading-6 text-gray-500">{A}</p>
        <p />
      </li>
    );
  };
  return (
    <section className="container mx-auto p-8">
      <SeoTags
        title="CourseLab | Frequently Asked Questions"
        description="An online learning platform for students to access course-specific study resources. And instructors, teachers or anyone to create courses."
        keywords="courselab, course lab, course-lab, course-lab xyz, course, free courses, create course, create courses, enroll, enroll in courses, build your course, course builder, quiz builder, 
        assignment, assignments, quiz, quizzes, students, teachers, structure, structure course"
      />
      <h2 className="text-3xl font-extrabold leading-9 border-b-2 border-gray-100 text-gray-900 mb-12">
        FAQs
      </h2>
      <ul className="flex items-start gap-8 flex-wrap">
        <FAQ
          Q="Can I both enroll in a course and create one?"
          A="Yes. You can enroll in as many courses as you like and still create and publish content."
        />
        <FAQ
          Q="How do I enroll into a CourseLab course?"
          A="All of the courses are entirely on-demand. You can begin the course whenever you like. 
          The deadlines are determined by the course teachers. After you enroll in a course 
          it will popup on your home page alongside information for your progression and tasks."
        />
        <FAQ
          Q="How can I leave a CourseLab course?"
          A='Leaving a course is as easy as clicking one button. On your course page(/learn/{course}) 
          there is a "Leave" button on the left side. When you click it you will be out of the course. 
          But by doing that you will lose all of your progress.'
        />
        <FAQ
          Q="Are there prerequisites or language requirements?"
          A="All of the prerequisites, if any, should be listed in the extended course infromation. 
        If they are not, you can contact the teachers/creators to inform them about it. If they do 
        not cooperate you can report it to the support. CourseLab does not have any language requirements, 
        for now the website is only in English, but we hope to change that soon by adding native translations. 
        Staring with Bulgarian. There are no limitations for in what language the courses should be, it is up to the teachers."
        />
        <FAQ
          Q="Do I have to be online at the same time as the other course members?"
          A="No. The idea of the platform is to be asynchronous. So all of the resources are available at any time."
        />
        <FAQ
          Q="How to use courselab?"
          A="Register from the /register tab, browse the course explorer, find something that 
          you are interested in enrolling and click 'Enroll'"
        />
        <FAQ
          Q="Why are courses important?"
          A="Everyone's goal should be to always improve and adapt to the ever-chaning world. 
          Expanding your knowledge in a certain region or starting something new will do just that for you. 
          Start now by enrolling in a courselab course."
        />
      </ul>
    </section>
  );
};
