"use client";

import React from "react";
import Hero from "./components/Hero";
import FeaturedCourses from "./components/FeaturedCourses";
import { About } from "./components/About";
import { Services } from "./components/Services";
import Team from "./components/Team"
import { Sponsors } from "./components/Sponsors";

const Landing = () => {

  return (
    <>
    <Hero/>
    {/* <Sponsors/> */}
    <FeaturedCourses/>
    <Services/>
    <About/>
    <Team />
    </>
  );
};

export default Landing;
