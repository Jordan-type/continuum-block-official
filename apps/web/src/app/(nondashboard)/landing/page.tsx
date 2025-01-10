"use client";

import React from "react";
import Hero from "./components/Hero";
import FeaturedCourses from "./components/FeaturedCourses";
import { About } from "./components/About";
import { Services } from "./components/Services";
import Team from "./components/Team"

const Landing = () => {

  return (
    <>
    <Hero/>
    <FeaturedCourses/>
    <Services/>
    <About/>
    <Team />
    </>
  );
};

export default Landing;
