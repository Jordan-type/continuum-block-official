import { Statistics } from "./Statistics";

export const About = () => {
  return (
    <section
      id="about"
      className="container py-24 sm:py-32"
    >
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img
            src="/growth.png"
            alt=""
            className="w-[300px] object-contain rounded-lg"
          />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
                  About{" "}
                </span>
                Continuum Block
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
              Continuum Block is an educational platform dedicated to advancing software developers&apos; expertise in blockchain and Web3 technologies. By providing comprehensive training that ranges from foundational concepts to complex programming techniques, it aims to fill the industry&apos;s skill gap. 
              The platform fosters a community of innovative developers through formal courses, practical workshops, and collaborative projects, equipping them to impact both global and local communities positively.
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};