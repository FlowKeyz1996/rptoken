"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FiMenu,
  FiX,
  FiMoon,
  FiSun,
  FiChevronDown,
  FiBook,
  FiMap,
  FiFileText,
  FiCompass,
  FiActivity,
  FiCpu,
  FiLayers,
  FiDatabase,
  FiCode,
} from "react-icons/fi";
import CustomConnectButton from "../Global/CustomConnectButton";

const TOKEN_NAME = process.env.NEXT_PUBLIC_TOKEN_NAME;
const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL;
const EXPLORER_TOKEN_URL = process.env.NEXT_PUBLIC_EXPLORER_TOKEN_URL;
const EXPLORER_ADDRESS_URL = process.env.NEXT_PUBLIC_EXPLORER_ADDRESS_URL;
const LINKTUM_ADDRESS = process.env.NEXT_PUBLIC_LINKTUM_ADDRESS;

const Header = ({ isDarkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const timeoutRef = useRef(null);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMegaMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMegaMenu(null), 300);
  };

  const handleMenuHover = (menuId) => {
    clearTimeout(timeoutRef.current);
    setActiveMegaMenu(menuId);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 50);
      setActiveMegaMenu(null);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClasses = `
    w-full transition-all duration-500 ease-out fixed top-0 left-0 z-50 shadow-lg border-b
    ${isDarkMode ? "bg-[#0E0B12]/95 border-gray-800/50" : "bg-white/95 border-gray-200/50"}
  `;

  const megaMenus = {
    ecosystem: {
      title: "Ecosystem",
      columns: [
        {
          title: "Core Technology",
          links: [
            { icon: <FiActivity className="text-fuchsia-500" />, label: "RPtoken", href: "https://linktum.gitbook.io/linktum" },
            { icon: <FiCpu className="text-indigo-500" />, label: "AIVM", href: "https://linktum.gitbook.io/linktum/linktum-docs/quickstart" },
            { icon: <FiLayers className="text-fuchsia-500" />, label: "Framework", href: "https://linktum.gitbook.io/linktum/linktum-docs" },
          ],
        },
        {
          title: "Applications",
          links: [
            { icon: <FiCode className="text-fuchsia-500" />, label: "How To Buy", href: "https://linktum.gitbook.io/linktum/linktum-docs/publish-your-docs" },
            { icon: <FiCompass className="text-indigo-500" />, label: "Explorer", href: `${EXPLORER_TOKEN_URL}${LINKTUM_ADDRESS}` },
            { icon: <FiMap className="text-fuchsia-500" />, label: "Create Wallet", href: "https://linktum.gitbook.io/linktum/linktum-docs/publish-your-docs/create-a-wallet" },
          ],
        },
        {
          title: "Community",
          links: [
            { icon: <FiFileText className="text-indigo-500" />, label: "Token Documentation", href: "https://linktum.gitbook.io/linktum/tokenomics" },
            { icon: <FiBook className="text-fuchsia-500" />, label: "Referral", href: "https://linktum.gitbook.io/linktum/referral" },
            { icon: <FiCompass className="text-indigo-500" />, label: "Audits", href: "https://linktum.gitbook.io/linktum/audits" },
          ],
        },
      ],
      featuredBox: {
        title: "Join Our Community",
        description: "Be part of the Linktum revolution and help shape the future of AI-driven blockchain.",
        linkText: "Join Discord",
        linkUrl: "https://discord.com",
        bgClass: isDarkMode ? "bg-indigo-500/10" : "bg-indigo-100/60",
      },
    },

    resources: {
      title: "Resources",
      columns: [
        {
          title: "Learn",
          links: [
            { icon: <FiFileText className="text-fuchsia-500" />, label: "Whitepaper", href: "https://rptoken.co" },
            { icon: <FiMap className="text-indigo-500" />, label: "Import Token", href: "https://rptoken.co" },
            { icon: <FiBook className="text-fuchsia-500" />, label: "Documentation", href: "https://rptoken.co" },
          ],
        },
        {
          title: "Tools",
          links: [
            { icon: <FiCompass className="text-fuchsia-500" />, label: "Block Explorer", href: `${EXPLORER_ADDRESS_URL}${LINKTUM_ADDRESS}` },
            { icon: <FiDatabase className="text-indigo-500" />, label: "Analytics", href: "/dashboard" },
            { icon: <FiCpu className="text-fuchsia-500" />, label: "Dashboard", href: "/dashboard" },
          ],
        },
      ],
      featuredBox: {
        title: "Start Building Today",
        description: "Access developer resources and start building on the RPtoken Protocol.",
        linkText: "Developer Portal",
        linkUrl: "/dashboard",
        bgClass: isDarkMode ? "bg-teal-500/10" : "bg-teal-100/60",
      },
    },
  };

  return (
    <>
      <header className={headerClasses} ref={menuRef}>

        {/* TOP BANNER */}
        {!isScrolled && (
          <div className="relative py-3 overflow-hidden whitespace-nowrap">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 z-10"></div>
            <div className="absolute inset-0 z-0 opacity-20"></div>
            <div className="animate-marquee inline-block text-white whitespace-nowrap relative z-10">
              <span className="mx-4 text-sm md:text-base">
                {TOKEN_NAME} ({TOKEN_SYMBOL}) Presale is now live! 🌍 Join today! 🔥
              </span>
            </div>
          </div>
        )}

        {/* MAIN HEADER */}
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">

          {/* LOGO */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <img src="logo.jpg" className="w-10 h-10 mr-3" />
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                {TOKEN_NAME}
              </span>
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <nav className="hidden lg:flex items-center space-x-6">
            {["ecosystem", "resources"].map((key) => (
              <div
                key={key}
                className="relative group"
                onMouseEnter={() => handleMenuHover(key)}
                onMouseLeave={handleMenuLeave}
              >
                <button
                  className={`flex items-center space-x-1 py-2 px-1 ${
                    isDarkMode ? "text-gray-300 hover:text-blue-500" : "text-gray-700 hover:text-blue-600"
                  }`}
                  onClick={() => setActiveMegaMenu(activeMegaMenu === key ? null : key)}
                >
                  <span className="capitalize">{megaMenus[key].title}</span>
                  <FiChevronDown className={`${activeMegaMenu === key ? "rotate-180" : ""} transition`} />
                </button>
              </div>
            ))}

            <Link
              href={`${EXPLORER_ADDRESS_URL}${LINKTUM_ADDRESS}`}
              className={`py-2 px-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"} hover:text-blue-600`}
            >
              Explore
            </Link>
          </nav>

          {/* RIGHT (DESKTOP) */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            >
              {isDarkMode ? <FiSun /> : <FiMoon />}
            </button>

            <Link href="/dashboard">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 
                  01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 
                  01-.437-.695z"/>
                </svg>
              </div>
            </Link>

            <CustomConnectButton active={true} />
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="flex lg:hidden items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            >
              {isDarkMode ? <FiSun /> : <FiMoon />}
            </button>
            <button onClick={toggleMenu}>
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* MEGA MENUS (DESKTOP) */}
        {Object.keys(megaMenus).map((menuKey) => {
          const menu = megaMenus[menuKey];
          const isActive = activeMegaMenu === menuKey;

          return (
            <div
              key={menuKey}
              className={`absolute left-0 w-full z-40 transition-all duration-300 ${
                isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5 pointer-events-none"
              } ${isDarkMode ? "bg-[#14101A]/95" : "bg-white/95"} backdrop-blur-md shadow-xl`}
            >
              <div className="container mx-auto py-8 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {menu.columns.map((column, idx) => (
                  <div key={idx}>
                    <h3 className={`text-sm font-bold uppercase mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {column.title}
                    </h3>
                    <ul className="space-y-2">
                      {column.links.map((link, linkIdx) => (
                        <li key={linkIdx}>
                          <Link
                            href={link.href}
                            target="_blank"
                            className={`flex items-center space-x-2 ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            } hover:text-blue-600`}
                          >
                            <span>{link.icon}</span>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* FEATURED BOX */}
                <div className={`p-6 rounded-xl ${menu.featuredBox.bgClass} flex flex-col justify-between`}>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{menu.featuredBox.title}</h3>
                    <p className="text-sm mb-4">{menu.featuredBox.description}</p>
                  </div>
                  <Link
                    href={menu.featuredBox.linkUrl}
                    className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center"
                  >
                    {menu.featuredBox.linkText}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* MOBILE SIDE MENU */}
        <div
          className={`lg:hidden fixed inset-y-0 left-0 w-4/5 max-w-xs z-50 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition duration-300 ${
            isDarkMode ? "bg-[#14101A] border-r border-gray-800" : "bg-white border-r border-gray-200"
          }`}
        >
          <div className="p-5 border-b flex justify-between items-center">
            <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center">
              <img src="/logo.jpg" className="w-6 h-6 mr-3" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                {TOKEN_NAME}
              </span>
            </Link>

            <button onClick={toggleMenu}>
              <FiX size={24} className={isDarkMode ? "text-blue-500" : "text-purple-500"} />
            </button>
          </div>

          <div className="p-5">

            {/* ECOSYSTEM */}
            <MobileAccordionItem
              title="Ecosystem"
              isDarkMode={isDarkMode}
              items={[
                { icon: <FiActivity className="text-blue-500" />, label: "RPtoken", href: "https://linktum.gitbook.io/linktum" },
                { icon: <FiCpu className="text-blue-500" />, label: "AIVM", href: "https://linktum.gitbook.io/linktum/linktum-docs/quickstart" },
                { icon: <FiLayers className="text-blue-500" />, label: "Framework", href: "https://linktum.gitbook.io/linktum/linktum-docs" },
              ]}
            />

            {/* RESOURCES */}
            <MobileAccordionItem
              title="Resources"
              isDarkMode={isDarkMode}
              items={[
                { icon: <FiFileText className="text-blue-500" />, label: "Whitepaper", href: "https://rptoken.co" },
                { icon: <FiMap className="text-blue-500" />, label: "Import Token", href: "https://rptoken.co" },
                { icon: <FiBook className="text-blue-500" />, label: "Documentation", href: "https://rptoken.co" },
              ]}
            />

            {/* Dashboard Link */}
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="mt-5 block px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center"
            >
              Dashboard
            </Link>

            {/* Connect Wallet */}
            <div className="mt-4">
              <CustomConnectButton active={true} />
            </div>

          </div>
        </div>
      </header>
    </>
  );
};

export default Header;



/* ----------------------------
   MOBILE ACCORDION COMPONENT
----------------------------- */

const MobileAccordionItem = ({ title, items, isDarkMode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex justify-between items-center py-3 px-2 font-semibold ${
          isDarkMode ? "text-gray-300" : "text-gray-800"
        }`}
      >
        {title}
        <FiChevronDown className={`${open ? "rotate-180" : ""} transition`} />
      </button>

      {open && (
        <ul className="pl-4 space-y-3 pt-2">
          {items.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                target="_blank"
                className={`flex items-center space-x-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-700"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
