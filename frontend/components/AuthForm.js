"use client";
import React, { useState } from "react";

const LoginPage = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-200 to-blue-200 flex items-center justify-center">
      <div className={`bg-white rounded-3xl shadow-lg relative overflow-hidden w-[768px] max-w-full min-h-[480px] ${isActive ? 'active' : ''}`}>
        
        {/* Sign Up Form */}
        <div className={`absolute top-0 h-full transition-all duration-500 ease-in-out left-0 w-1/2
          ${isActive ? 'translate-x-full opacity-100 z-20 pointer-events-auto' : 'opacity-0 z-10 pointer-events-none'}`}>
          <form className="bg-white h-full flex flex-col items-center justify-center px-10" onSubmit={(e) => e.preventDefault()}>
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Create Account</h1>
            <div className="flex gap-3 my-5">
              <a href="#" className="border border-gray-300 rounded-[20%] w-10 h-10 flex items-center justify-center text-gray-600"><i className="fa-brands fa-google-plus-g"></i></a>
              <a href="#" className="border border-gray-300 rounded-[20%] w-10 h-10 flex items-center justify-center text-gray-600"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="border border-gray-300 rounded-[20%] w-10 h-10 flex items-center justify-center text-gray-600"><i className="fa-brands fa-github"></i></a>
              <a href="#" className="border border-gray-300 rounded-[20%] w-10 h-10 flex items-center justify-center text-gray-600"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
            <span className="text-sm mb-4 text-gray-600">or use your email for registration</span>
            <input type="text" placeholder="Name" className="w-full bg-gray-100 border-none rounded-lg py-2 px-4 text-sm mb-2 outline-none text-gray-800" />
            <input type="email" placeholder="Email" className="w-full bg-gray-100 border-none rounded-lg py-2 px-4 text-sm mb-2 outline-none text-gray-800" />
            <input type="password" placeholder="Password" className="w-full bg-gray-100 border-none rounded-lg py-2 px-4 text-sm mb-2 outline-none text-gray-800" />
            <button className="bg-indigo-700 text-white text-xs px-11 py-3 rounded-lg font-semibold uppercase tracking-wider mt-3 cursor-pointer hover:bg-indigo-800 transition-colors">Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className={`absolute top-0 h-full transition-all duration-500 ease-in-out left-0 w-1/2 z-20
          ${isActive ? 'translate-x-full opacity-0 z-10 pointer-events-none' : 'translate-x-0 opacity-100 z-20 pointer-events-auto'}`}>
          <form className="bg-white h-full flex flex-col items-center justify-center px-10" onSubmit={(e) => e.preventDefault()}>
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Sign In</h1>
            <div className="flex gap-3 my-5">
              <a href="#" className="border border-gray-300 rounded-[20%] w-10 h-10 flex items-center justify-center text-gray-600"><i className="fa-brands fa-google-plus-g"></i></a>
              <a href="#" className="border border-gray-300 rounded-[20%] w-10 h-10 flex items-center justify-center text-gray-600"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="border border-gray-300 rounded-[20%] w-10 h-10 flex items-center justify-center text-gray-600"><i className="fa-brands fa-github"></i></a>
              <a href="#" className="border border-gray-300 rounded-[20%] w-10 h-10 flex items-center justify-center text-gray-600"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
            <span className="text-sm mb-4 text-gray-600">or use your email password</span>
            <input type="email" placeholder="Email" className="w-full bg-gray-100 border-none rounded-lg py-2 px-4 text-sm mb-2 outline-none text-gray-800" />
            <input type="password" placeholder="Password" className="w-full bg-gray-100 border-none rounded-lg py-2 px-4 text-sm mb-2 outline-none text-gray-800" />
            <a href="#" className="text-sm text-gray-700 my-4">Forget Your Password?</a>
            <button className="bg-indigo-700 text-white text-xs px-11 py-3 rounded-lg font-semibold uppercase tracking-wider mt-3 cursor-pointer hover:bg-indigo-800 transition-colors">Sign In</button>
          </form>
        </div>

        {/* Toggle Container */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-500 ease-in-out rounded-l-[150px] z-50
          ${isActive ? '-translate-x-full rounded-l-none rounded-r-[150px]' : ''}`}>
          <div className={`bg-gradient-to-r from-indigo-500 to-indigo-700 h-full relative -left-full w-[200%] text-white transform
            ${isActive ? 'translate-x-1/2' : 'translate-x-0'} transition-transform duration-500 ease-in-out`}>
            <div className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-8 text-center transition-transform duration-500 ease-in-out
              ${isActive ? 'translate-x-0' : '-translate-x-[200%]'}`}>
              <h1 className="text-2xl font-bold mb-4">Welcome Back!</h1>
              <p className="text-sm leading-5 tracking-wide my-5">Enter your personal details to use all of site features</p>
              <button onClick={() => setIsActive(false)} className="bg-transparent border border-white text-white text-xs px-11 py-3 rounded-lg font-semibold uppercase tracking-wider mt-3 cursor-pointer hover:bg-white/10 transition-colors">Sign In</button>
            </div>
            <div className={`absolute right-0 w-1/2 h-full flex flex-col items-center justify-center px-8 text-center transition-transform duration-500 ease-in-out
              ${isActive ? 'translate-x-[200%]' : 'translate-x-0'}`}>
              <h1 className="text-2xl font-bold mb-4">Hello, Friend!</h1>
              <p className="text-sm leading-5 tracking-wide my-5">Register with your personal details to use all of site features</p>
              <button onClick={() => setIsActive(true)} className="bg-transparent border border-white text-white text-xs px-11 py-3 rounded-lg font-semibold uppercase tracking-wider mt-3 cursor-pointer hover:bg-white/10 transition-colors">Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
