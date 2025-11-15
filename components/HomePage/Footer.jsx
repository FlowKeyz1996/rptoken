import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        {/* Left Section */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
          <p className="mb-6 text-gray-300">
            Connect with thousands of RP Token supporters and stay updated on the latest developments.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              X (Twitter)
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-500 px-4 py-2 rounded hover:bg-indigo-600 transition"
            >
              Discord
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-500 px-4 py-2 rounded hover:bg-purple-600 transition"
            >
              Telegram
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
            >
              YouTube
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-500 px-4 py-2 rounded hover:bg-pink-600 transition"
            >
              Instagram
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              TikTok
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex flex-col justify-start gap-4">
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-700 px-6 py-3 rounded text-center font-semibold hover:bg-blue-800 transition"
          >
            Join Telegram
          </a>
          <a
            href="/whitepaper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-gray-900 px-6 py-3 rounded text-center font-semibold hover:bg-gray-100 transition"
          >
            Download Whitepaper
          </a>
        </div>
      </div>

      <p className="text-center text-gray-500 mt-10 text-sm">
        &copy; {new Date().getFullYear()} RP Token. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
