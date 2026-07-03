import React, {useState} from "react";
import Navbar from "../components/Navbar";
import AlfezAbout from "./AlfezAbout";
import HasnainAbout from "./HasnainAbout";

function AboutSection() {
  const [activeTab, setActiveTab] = useState("frontend");

  return (
    <div>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isAbout/>
      {activeTab ==='frontend' ? <AlfezAbout/> : <HasnainAbout/>}
    </div>
  );
}

export default AboutSection;
