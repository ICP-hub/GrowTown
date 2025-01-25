import * as React from "react"
import Header from "../components/Header";
import HeroComp from "../components//HeroComp";
import { VideoComp } from "../components//VideoComp";
import About from "../components//About";
import Characters from "../components//Characters";
import Gameplay from "../components/Gameplay1";
import Gameplay2 from "../components/Gameplay2";
import Footer from "../components/Footer";
const LandingPage = ()=>{

    return(
      <div className=" w-screen">
        <Header/>
        <HeroComp/>
        <VideoComp/>
        <About/>
        <Characters/>
        <Gameplay/>
        <Gameplay2/>
       <Footer/>
      </div>
    )

}
export default LandingPage;