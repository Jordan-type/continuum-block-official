"use client";

import React from "react";
import Hero from "./components/Hero";
import FeaturedCourses from "./components/FeaturedCourses";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Testimonials } from "./components/Testimonials";
import Team from "./components/Team"
import { Sponsors } from "./components/Sponsors";
import { FAQ } from "./components/Faqz";

const Landing = () => {

  return (
    <>
    <Hero/>
    {/* <Sponsors/> */}
    <FeaturedCourses/>
    <Services/>
    <About/>
    <Testimonials />
    <Team />
    <FAQ />
    </>
  );
};

export default Landing;
