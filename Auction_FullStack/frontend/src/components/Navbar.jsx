import { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  const menuHandler = () => {
    setOpenMenu(!openMenu);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={`flex justify-between items-center bg-transparent backdrop-blur-lg h-20 p-6 md:p-12 w-[89%] m-auto fixed left-1/2 translate-x-[-50%] drop-shadow-xl z-20 border border-neutral-400/80 transition-all duration-300 ${
          scrolling ? "top-5 w-[89%] rounded-xl md:p-6" : "fixed top-5 rounded-xl"
        }`}
      >
        <div className=" container  mx-auto relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-extrabold italic uppercase bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white transform hover:scale-110 transition-transform duration-300">
                Saturn ai
              </h1>
            </div>
            <ul
              className={`md:flex gap-12 font-semibold  text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white [&>li]:cursor-pointer  absolute md:static top-20 bg-white max-md:p-3  text-center ${
                openMenu ? "" : "hidden"
              } ${
                scrolling && openMenu
                  ? "top-12 w-full right-0 rounded-b-none"
                  : "rounded-b-xl right-5"
              }`}
            >
              <a href="/">
                <li className=" transform hover:scale-110 transition-transform duration-300 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white ">HOME</li>
              </a>
              <a href="/">
                <li className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white transform hover:scale-110 transition-transform duration-300">ABOUT</li>
              </a>
              <a href="/">
                <li className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white transform hover:scale-110 transition-transform duration-300">CONTACT US</li>
              </a>
            </ul>
            <div className="md:hidden">
              <button onClick={menuHandler}>
                {openMenu ? (
                  <CloseIcon
                    sx={{
                      fontSize: 32,
                      fill: "url(#gradient-icon)",
                    }}
                  />
                ) : (
                  <MenuIcon
                    sx={{
                      fontSize: 32,
                      fill: "url(#gradient-icon)",
                    }}
                  />
                )}

                {/* Define the gradient for SVG */}
                <svg width="0" height="0">
                  <linearGradient
                    id="gradient-icon"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop stopColor="#525252" offset="0%" />
                    <stop stopColor="white" offset="50%" />
                    <stop stopColor="white" offset="100%" />
                  </linearGradient>
                </svg>
              </button>
            </div>
          </div>
          {openMenu && (
            <div className="fixed flex flex-col font-bold items-center justify-center w-full right-0 z-50 bg-black  backdrop-blur  lg:hidden  rounded-lg min-h-screen">
              <ul className=" cursor-pointer text-lg text-center ">
                <a href="#services" onClick={menuHandler}>
                  <li
                    className="text-center pb-12 bg-clip-text text-transparent bg-gradient-to-t from-neutral-800 via-white to-white   hover:text-transparent hover:bg-gradient-to-r hover:from-gray-200 hover:via-zinc-300 hover:to-slate-200 transition-colors duration-300"
                    id="item"
                  >
                    HOME
                  </li>
                  <hr className="border-white bg-white" />
                </a>
                <a href="#features" onClick={menuHandler}>
                  <li
                    className="text-center p-12 bg-clip-text text-transparent bg-gradient-to-t from-neutral-800 via-white to-white   hover:text-transparent hover:bg-gradient-to-r hover:from-gray-200 hover:via-zinc-300 hover:to-slate-200 transition-colors duration-300"
                    id="item"
                  >
                    ABOUT
                  </li>
                  <hr className="border-white bg-white" />
                </a>
                <a href="#contact" onClick={menuHandler}>
                  <li
                    className="text-center p-12 bg-clip-text text-transparent bg-gradient-to-t from-neutral-800 via-white to-white  hover:text-transparent hover:bg-gradient-to-r hover:from-gray-200 hover:via-zinc-300 hover:to-slate-200 transition-colors duration-300"
                    id="item"
                  >
                    CONTACT US
                  </li>
                </a>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;