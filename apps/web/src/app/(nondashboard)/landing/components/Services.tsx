import { motion } from "framer-motion";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { MagnifierIcon, WalletIcon, ChartIcon } from "@/components/ui/Icons";

interface ServiceProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

const serviceList: ServiceProps[] = [
  {
    title: "Code Collaboration",
    description:
      "Provides platforms that enable collaborative coding experiences, including live coding sessions, peer reviews, and joint projects. This service enhances learning by leveraging community interactions and shared knowledge in blockchain technology.",
    icon: <ChartIcon />,
  },
  {
    title: "Project Management",
    description:
      "Delivers courses and workshops focused on the effective management of blockchain projects, incorporating agile methodologies and team management skills necessary for real-world blockchain applications.",
    icon: <WalletIcon />,
  },
  {
    title: "Task Automation",
    description:
      "Offers training on automating routine tasks within blockchain development, covering aspects like automated testing, deployment pipelines, and smart contract management, aimed at boosting productivity and project consistency.",
    icon: <MagnifierIcon />,
  },
];

export const Services = () => {
  return (
    <section className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-b from-[#8A2BE2] to-[#9370DB] text-transparent bg-clip-text">
              Client-Centric{" "}
            </span>
            Services
          </h2>

          <p className="text-muted-foreground text-xl mt-4 mb-8 ">
            Continuum Block offers customized training in code collaboration,
            project management, and task automation, tailored to each
            learner&apos;s style and goals. Our programs feature personalized
            learning paths, mentorship, and strong community support, equipping
            participants with the skills needed to succeed in the blockchain
            industry.
          </p>

          <div className="flex flex-col gap-8">
            {serviceList.map(
              ({ icon, title, description }: ServiceProps, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02, duration: 0.1 }}
                  viewport={{ amount: 0.4 }}
                >
                  <Card key={title}>
                    <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                      <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
                        {icon}
                      </div>
                      <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription className="text-md mt-2">
                          {description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              )
            )}
          </div>
        </div>

        <Image
          src="/cube-leg.png"
          className="w-[300px] md:w-[500px] lg:w-[600px] object-contain"
          alt="About services"
        />
      </div>
    </section>
  );
};
