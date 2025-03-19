import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "What is Continuum Block?",
    answer: "Continuum Block is an innovative online platform focused on providing comprehensive blockchain and fintech education. It offers a range of courses and resources designed to help learners of all levels understand and apply blockchain technology.",
    value: "item-1",
  },
  {
    question: "How can I sign up for courses on Continuum Block?",
    answer: "You can sign up for courses on Continuum Block by creating an account on our platform, browsing through the course catalog, and enrolling in the course that suits your interests and needs.",
    value: "item-2",
  },
  {
    question: "Are there any prerequisites for enrolling in courses?",
    answer: "Some courses on Continuum Block may have prerequisites, which are clearly listed on the course page. These prerequisites are designed to ensure that all participants have the foundational knowledge required to succeed in the course.",
    value: "item-3",
  },
  {
    question: "What types of courses does Continuum Block offer?",
    answer: "Continuum Block offers a variety of courses ranging from beginner to advanced levels, covering topics such as blockchain basics, smart contract development, blockchain for business, and advanced coding techniques for decentralized applications.",
    value: "item-4",
  },
  {
    question: "Is there a certification process for completing a course?",
    answer: "Yes, Continuum Block provides certificates of completion for courses once participants meet all the course requirements, such as completing all modules, passing assessments, and submitting final projects where applicable.",
    value: "item-5",
  },
  {
    question: "Can I access courses on mobile devices?",
    answer: "Yes, Continuum Block is designed to be fully accessible on mobile devices, allowing learners to study on the go from anywhere at any time.",
    value: "item-6",
  },
  {
    question: "What support does Continuum Block offer to learners?",
    answer: "Continuum Block offers various forms of support, including access to instructors, peer collaboration forums, and customer service for technical or account-related queries.",
    value: "item-7",
  },
  {
    question: "How often are new courses added to Continuum Block?",
    answer: "New courses are added regularly. We aim to stay at the forefront of blockchain education by updating our course offerings to reflect the latest trends and developments in the field.",
    value: "item-8",
  },
  {
    question: "Is there a community or network I can join through Continuum Block?",
    answer: "Yes, Continuum Block offers access to a vibrant community of learners, professionals, and experts. You can interact, network, and collaborate with peers across the globe through forums and group projects.",
    value: "item-9",
  },
  {
    question: "Are there any fees associated with using Continuum Block?",
    answer: "While many courses on Continuum Block are available for free, some specialized courses or advanced material may require a fee. These fees are used to compensate instructors and maintain the platform.",
    value: "item-10",
  },
];


export const FAQ = () => {
  return (
    <section id="faq" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Questions
        </span>
      </h2>

      <Accordion type="single" collapsible className="w-full AccordionRoot">
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>
            <AccordionContent>
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Still have questions?{" "}
        <a
          rel="noreferrer noopener"
          href="#"
          className="text-primary transition-all border-primary hover:border-b-2">
          Contact us
        </a>
      </h3>
    </section>
  );
};
