import React, { useState } from "react";
import axios from "axios";
import { Typewriter } from "react-simple-typewriter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faSync } from "@fortawesome/free-solid-svg-icons";
import logo from "./Vector 1.svg"; // Update this to your actual logo path

function App() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [displaySummary, setDisplaySummary] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  const [typewriterDone, setTypewriterDone] = useState(false);

  const handleGenerateClick = async () => {
    setLoading(true);
    setDisplaySummary(false);
    setTypewriterDone(false);
    try {
      const response = await axios.post(
        `https://equipment-602z.onrender.com/api/scrape/?url=${encodeURIComponent(
          url
        )}`
      );
      const summaryText = response.data.data;
      setSummary(summaryText);
      setIsArabic(/[\u0600-\u06FF]/.test(summaryText));
      setDisplaySummary(true);
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSummary("Error fetching summary. Please try again.");
      setDisplaySummary(true);
    }
    setLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleGenerateClick();
    }
  };

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(summary)
      .then(() => {
        alert("Summary copied to clipboard");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  return (
    <div className="App">
      <header className="bg-white p-4 shadow-md">
        <nav className="flex justify-between items-center container mx-auto">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-16 w-16 " />
          </div>
          <ul className="flex space-x-6 items-center">
            <li>
              <a href="/" className="text-gray-800 hover:text-green-600">
                Home
              </a>
            </li>
            <li>
              <a href="/" className="text-gray-800 hover:text-green-600">
                About
              </a>
            </li>
            <li>
              <a href="/" className="text-gray-800 hover:text-green-600">
                Services{" "}
                <span className="text-xs text-white bg-green-500 px-1 rounded">
                  NEW
                </span>
              </a>
            </li>
            <li>
              <a href="/" className="text-gray-800 hover:text-green-600">
                Contact Us
              </a>
            </li>
            <li className="text-gray-800">
              <i className="fas fa-user-circle fa-2x"></i>
            </li>
          </ul>
        </nav>
        <h1 className="text-center mt-6 text-3xl text-gray-800 px-4 font-serif italic leading-relaxed">
          The Art of summarization
        </h1>
      </header>
      <main className="container mx-auto text-center my-10">
        <div className="flex justify-center items-center mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Put your url here ..."
            className="border border-gray-300 rounded-l px-4 py-2 w-2/3"
          />
          <button
            onClick={handleGenerateClick}
            className="bg-green-500 text-white px-4 py-2 rounded-r"
            disabled={loading}
          >
            Generate
          </button>
        </div>
        {loading ? (
          <div className="spinner-border text-green-500" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <div
            className={`relative bg-green-100 p-6 rounded-lg text-left w-2/3 mx-auto ${
              isArabic ? "rtl" : ""
            }`}
          >
            {displaySummary && isArabic ? (
              <h2 className="text-gray-800 font-bold mb-2">ملخصك هنا :</h2>
            ) : displaySummary && !isArabic ? (
              <h2 className="text-gray-800 font-bold mb-2">
                Your summary is here
              </h2>
            ) : (
              <h2 className="text-gray-800 font-bold mb-2">
                Your summary will display here
              </h2>
            )}

            {displaySummary && (
              <p className="text-gray-700">
                <Typewriter
                  words={[summary]}
                  loop={1}
                  cursor
                  cursorStyle="_"
                  typeSpeed={20}
                  deleteSpeed={20}
                  delaySpeed={1000}
                  onDone={() => {
                    console.log("Typewriter animation done");
                    setTypewriterDone(true);
                  }}
                />
              </p>
            )}
            {typewriterDone && (
              <div className="absolute bottom-2 right-2 flex space-x-4">
                <FontAwesomeIcon
                  icon={faCopy}
                  className="text-gray-600 hover:text-gray-800 cursor-pointer"
                  onClick={handleCopyClick}
                />
                <FontAwesomeIcon
                  icon={faSync}
                  className="text-gray-600 hover:text-gray-800 cursor-pointer"
                  onClick={handleGenerateClick}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
