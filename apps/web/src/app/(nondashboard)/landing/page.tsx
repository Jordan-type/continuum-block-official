"use client";

import React from "react";
import Hero from "./components/Hero";
import FeaturedCourses from "./components/FeaturedCourses";
import FeaturedBootcamps from "./components/FeaturedBootcamps";
import { About } from "./components/About";
import { Services } from "./components/Services";
import Testimonial from "./components/Testimonials";
import Team from "./components/Team"
import { Sponsors } from "./components/Sponsors";
import { FAQ } from "./components/Faqz";

const Landing = () => {

  return (
    <>
    <Hero/>
    {/* <Sponsors/> */}
    <FeaturedCourses/>
    <FeaturedBootcamps/>
    <Services/>
    <About/>
    <Testimonial />
    <Team />
    <FAQ />
    </>
  );
};

export default Landing;
