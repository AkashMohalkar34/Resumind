import React from "react";
import SanikaImg from "../pages/sm.jpg";
import toast from "react-hot-toast";

function Contact() {
  function messageSend() {
    toast.success("Message Sent", {
      position: "top-center",
      autoClose: 3000,
    });
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-6 sm:px-5 sm:py-10"
      style={{ backgroundImage: `url(${SanikaImg})` }}
    >
      <div className="w-full max-w-5xl rounded-2xl bg-neutral-content bg-opacity-80 p-4 shadow-lg hover:bg-opacity-90 sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-black text-center mb-5">
          Contact Me
        </h1>

        {/* Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-2">
            <label htmlFor="name" className="mb-2 block text-base font-bold text-black sm:text-lg">
              Full Name:
            </label>
            <input
              className="mt-1 h-11 w-full rounded-md border-none bg-black p-3 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              placeholder="Enter Name"
              id="name"
              name="name"
            />
          </div>

          <div className="p-2">
            <label htmlFor="email" className="mb-2 block text-base font-bold text-black sm:text-lg">
              Email:
            </label>
            <input
              className="mt-1 h-11 w-full rounded-md border-none bg-black p-3 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="email"
              placeholder="Enter Email"
              id="email"
              name="email"
            />
          </div>
        </div>

        <div className="p-2">
          <label className="mb-2 block text-base font-bold text-black sm:text-lg">Message:</label>
          <textarea
            className="mt-1 h-28 w-full rounded-md bg-black p-3 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Write your message here..."
          ></textarea>
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md w-full mt-5 transition duration-300"
          onClick={messageSend}
        >
          Send Message
        </button>
      </div>
    </div>
  );
}

export default Contact;
