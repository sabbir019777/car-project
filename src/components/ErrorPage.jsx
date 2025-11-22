import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* Bg Video */}

  <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      >
    <source
    src="https://www.shutterstock.com/shutterstock/videos/3661933713/preview/stock-footage-skull-and-bones-hud-satelite-style-hologram-video.webm"
          type="video/mp4"
        />
      </video>

      {/* Button Lower */}

 <div className="absolute inset-0 flex justify-center items-end pb-5">
  <button
    onClick={() => navigate("/")}
    className="relative inline-block px-8 py-4 bg-white/10 rounded-xl shadow-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:bg-gray-800"
  >
    <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent font-bold uppercase text-lg">
      Back  Home
    </span>

    {/*  shine effect */}

    <span className="absolute top-0 left-0 w-full h-full bg-white/10 rounded-xl opacity-0 transition-opacity hover:opacity-20"></span>
  </button>
</div>


    </div>
  );
};

export default ErrorPage;
