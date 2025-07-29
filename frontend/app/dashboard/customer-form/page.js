"use client";

import React, { useState } from "react";

export default function ProjectInfoForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    date: "",
    province: "",
    district: "",
    municipality: "",
    ward: "",
    street: "",
    houseNo: "",
    projectType: "",
    projectTypeOther: "",
    landArea: "",
    squareFootage: "",
    projectScope: "",
    completionDate: "",
    vision: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 shadow-xl border border-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row overflow-hidden rounded-xl shadow-md mb-10">
        {/* Left: Text */}
        <div className="flex-1 bg-white px-6 py-8 flex flex-col justify-center text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1e2d4d] tracking-tight leading-tight">
            PROJECT INFO
          </h1>
          <p className="text-gray-600 mt-4 text-base sm:text-lg lg:text-xl font-medium leading-relaxed">
            To apply for a project with us, kindly complete this form with accurate information.
          </p>
        </div>

        {/* Right: Logo & Company Info */}
        <div className="bg-[#1e2d4d] text-white flex items-center justify-center px-6 py-8 w-full sm:w-80">
          <div className="flex flex-col items-center sm:items-end text-center sm:text-right w-full">
            <div className="w-24 sm:w-28 lg:w-32 mb-3">
              <img
                src="/Logo-Bela.svg"
                alt="Bela Nepal Logo"
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="text-sm sm:text-base leading-snug space-y-1 break-words w-full">
              <p className="font-semibold tracking-wide">Bela Nepal Pvt. Ltd.</p>
              <p className="opacity-90">Chhauni-15, Kathmandu</p>
              <p className="opacity-90">+977-9802375303</p>
              <p className="opacity-90 break-all">info@belanepal.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-10 text-sm">
        <div>
          <h2 className="text-md font-semibold bg-orange-500 text-white px-4 py-2 rounded">PRIMARY CONTACT INFORMATION :</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client’s / Organisation’s Full Name</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange} required className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone No.</label>
              <input name="phone" value={formData.phone} onChange={handleChange} required className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
              <input name="email" value={formData.email} onChange={handleChange} required className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input name="date" type="date" value={formData.date} onChange={handleChange} required className="input w-full" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-md font-semibold bg-orange-500 text-white px-4 py-2 rounded">CONSTRUCTION SITE ADDRESS :</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
              <input name="province" value={formData.province} onChange={handleChange} className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <input name="district" value={formData.district} onChange={handleChange} className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Municipality / Rural Municipality</label>
              <input name="municipality" value={formData.municipality} onChange={handleChange} className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ward No.</label>
              <input name="ward" value={formData.ward} onChange={handleChange} className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tole / Street Name</label>
              <input name="street" value={formData.street} onChange={handleChange} className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">House No. (or additional landmarks)</label>
              <input name="houseNo" value={formData.houseNo} onChange={handleChange} className="input w-full" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-md font-semibold bg-orange-500 text-white px-4 py-2 rounded">PROJECT REQUIREMENTS :</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block mb-1 font-medium">Project Type :</label>
              <div className="space-y-1">
                <label className="flex items-center gap-2">
                  <input type="radio" name="projectType" value="Residential" checked={formData.projectType === "Residential"} onChange={handleChange} className="accent-blue-600" /> Residential
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="projectType" value="Commercial" checked={formData.projectType === "Commercial"} onChange={handleChange} className="accent-blue-600" /> Commercial
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="projectType" value="Other" checked={formData.projectType === "Other"} onChange={handleChange} className="accent-blue-600" /> Other
                </label>
                {formData.projectType === "Other" && (
                  <input type="text" name="projectTypeOther" value={formData.projectTypeOther} placeholder="Other (please specify)" onChange={handleChange} className="input w-full" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Land Area</label>
              <input name="landArea" value={formData.landArea} onChange={handleChange} className="input w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Square Footage to be Constructed</label>
              <input name="squareFootage" value={formData.squareFootage} onChange={handleChange} className="input w-full" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Project Scope :</label>
              <div className="space-y-1">
                <label className="flex items-center gap-2">
                  <input type="radio" name="projectScope" value="New Build" checked={formData.projectScope === "New Build"} onChange={handleChange} className="accent-blue-600" /> New Build
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="projectScope" value="Addition / Renovation" checked={formData.projectScope === "Addition / Renovation"} onChange={handleChange} className="accent-blue-600" /> Addition / Renovation
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="projectScope" value="Other" checked={formData.projectScope === "Other"} onChange={handleChange} className="accent-blue-600" /> Other
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Desired Project Completion Date</label>
              <input name="completionDate" type="date" value={formData.completionDate} onChange={handleChange} className="input w-full" />
            </div>
          </div>

          <div className="mt-6">
            <label className="block mb-2 font-medium">Project Vision and Goals :</label>
            <textarea name="vision" value={formData.vision} onChange={handleChange} rows={5} placeholder="Please describe your vision and goals for the completed project" className="w-full input" />
          </div>

          <p className="text-sm text-gray-700 mt-3">
            <strong>Note:</strong> Please attach a PDF or image of the land and/or building blueprint(s) to <a href="mailto:belanepal2025@gmail.com" className="text-blue-600 underline">belanepal2025@gmail.com</a>
          </p>
        </div>

        <div className="text-center">
          <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded w-full sm:w-auto">
            Submit Project Info
          </button>
        </div>
      </form>
    </div>
  );
}
