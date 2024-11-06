import React from "react";
import WelcomeHeader from "../components/WelcomeHeader/WelcomeHeader";
import MainBanner from "../components/MainBanner/MainBanner";
import AboutSection from "../components/AboutSection/AboutSection";

function Home() {
  return (
    <div>
      <MainBanner>
        <WelcomeHeader />
      </MainBanner>
      <AboutSection />
    </div>
  );
}

export default Home;
