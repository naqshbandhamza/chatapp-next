import Image from "next/image";
import HomeNavbar from "@/components/layout/homeNavbar";
import { Montserrat } from 'next/font/google'
 
const inter = Montserrat({
  weight: '400',
  subsets: ['latin'],
})


export default function Home() {
  return (
   <div className={`${inter.className}`}>
        <nav className="navbar">
            <div className="container sm:px-4 lg:px-8 flex flex-wrap items-center justify-between lg:flex-nowrap">
                

                <a className="inline-block mr-4 py-0.5 text-xl whitespace-nowrap hover:no-underline focus:no-underline" href="index.html">
                  Chime
                </a>

                <div className="navbar-collapse offcanvas-collapse lg:flex lg:flex-grow lg:items-center" id="navbarsExampleDefault">
                    <ul className="pl-0 mt-3 mb-2 ml-auto flex flex-col list-none lg:mt-0 lg:mb-0 lg:flex-row">
                        <li>
                            <a className="nav-link page-scroll active" href="#header">Home <span className="sr-only">(current)</span></a>
                        </li>
                    </ul>
                </div> 
            </div> 
        </nav> 

        <header id="header" className="header py-28 text-center md:pt-36 lg:text-left xl:pt-44 xl:pb-32">
            <div className="container px-4 sm:px-8 lg:grid lg:grid-cols-2 lg:gap-x-8">
                <div className="mb-16 lg:mt-32 xl:mt-40 xl:mr-12">
                    <h1 className="h1-large mb-5">Chime - Chat Application</h1>
                    <p className="p-large mb-8">Where the real ones chat</p>
                    <a className="btn-solid-lg" href="/sign-up">Sign Up</a>
                    <a className="btn-solid-lg secondary" href="/sign-in">Sign In</a>
                </div>
                <div className="xl:text-right">
                    <img className="inline" src="images/header-smartphone.png" alt="alternative" />
                </div>
            </div> 
        </header> 

      
        <div id="download" className="basic-5">
            <div className="container px-4 sm:px-8 lg:grid lg:grid-cols-2">
                <div className="mb-16 lg:mb-0">
                    <img src="images/conclusion-smartphone.png" alt="alternative" />
                </div>
                <div className="lg:mt-24 xl:mt-44 xl:ml-12">
                    <p className="mb-9 text-gray-800 text-3xl leading-10">This isn’t just another messaging app—it’s where your people actually are. No filters, no fake vibes, just unfiltered, real-time conversations with the ones who matter. Whether it’s deep talks at 2AM, chaotic group chats, or random memes that make your day, this is the space where authenticity wins. Built for Gen Z energy—raw, relatable, and real.</p>
                    <a className="btn-solid-lg" href="#your-link">Download</a>
                </div>
            </div> 
        </div>
       


        <div className="footer">
            <div className="container px-4 sm:px-8">
                <h4 className="mb-8 lg:max-w-3xl lg:mx-auto">you can reach the team at <a className="text-indigo-600 hover:text-gray-500" href="mailto:email@domain.com">chime@domain.com</a></h4>
                <div className="social-container">
                    <span className="fa-stack">
                        <a href="#your-link">
                            <i className="fas fa-circle fa-stack-2x"></i>
                            <i className="fab fa-facebook-f fa-stack-1x"></i>
                        </a>
                    </span>
                    <span className="fa-stack">
                        <a href="#your-link">
                            <i className="fas fa-circle fa-stack-2x"></i>
                            <i className="fab fa-twitter fa-stack-1x"></i>
                        </a>
                    </span>
                    <span className="fa-stack">
                        <a href="#your-link">
                            <i className="fas fa-circle fa-stack-2x"></i>
                            <i className="fab fa-pinterest-p fa-stack-1x"></i>
                        </a>
                    </span>
                    <span className="fa-stack">
                        <a href="#your-link">
                            <i className="fas fa-circle fa-stack-2x"></i>
                            <i className="fab fa-instagram fa-stack-1x"></i>
                        </a>
                    </span>
                    <span className="fa-stack">
                        <a href="#your-link">
                            <i className="fas fa-circle fa-stack-2x"></i>
                            <i className="fab fa-youtube fa-stack-1x"></i>
                        </a>
                    </span>
                </div>
            </div> 
        </div> 


        <div className="copyright">
            <div className="container px-4 sm:px-8 lg:grid lg:grid-cols-3">
                <ul className="mb-4 list-unstyled p-small">
                    <li className="mb-2"><a href="terms.html">Terms & Conditions</a></li>
                    <li className="mb-2"><a href="privacy.html">Privacy Policy</a></li>
                </ul>
                <p className="pb-2 p-small statement">Copyright © <a href="#your-link" className="no-underline">Chime</a></p>

            </div> 

       
        </div> 
   </div>
  );
}
