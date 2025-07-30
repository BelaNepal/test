"use client";

import React, { useState } from "react";
import { useLayout } from "@/context/LayoutContext";


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

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:5000/api/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Your project info has been submitted successfully!");
    } else {
      alert("Error: " + result.message);
    }
  } catch (err) {
    alert("An error occurred. Please try again later.");
  }
};

  const { collapsed } = useLayout();

  // === Dynamic Field Configs ===

  const primaryFields = [
    { label: "Client’s / Organisation’s Full Name", name: "fullName" },
    { label: "Phone No.", name: "phone" },
    { label: "E-Mail", name: "email" },
    { label: "Date", name: "date", type: "date" },
  ];

  const addressFields = [
    { label: "Province", name: "province" },
    { label: "District", name: "district" },
    { label: "Municipality / Rural Municipality", name: "municipality" },
    { label: "Ward No.", name: "ward" },
    { label: "Tole / Street Name", name: "street" },
    { label: "House No. (or additional landmarks)", name: "houseNo" },
  ];

  const projectTypes = ["Residential", "Commercial", "Other"];
  const projectScopes = ["New Build", "Addition / Renovation", "Other"];

  const projectFields = [
    { label: "Total Land Area", name: "landArea" },
    { label: "Total Square Footage to be Constructed", name: "squareFootage" },
    { label: "Desired Project Completion Date", name: "completionDate", type: "date" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 shadow-xl border border-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row overflow-hidden rounded-xl shadow-md mb-10">
        <div className="flex-1 bg-white px-6 py-8 flex flex-col justify-center text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1e2d4d] tracking-tight leading-tight">
            PROJECT INFO
          </h1>
          <p className="text-gray-600 mt-4 text-base sm:text-lg lg:text-xl font-medium leading-relaxed">
            To apply for a project with us, kindly complete this form with accurate information.
          </p>
        </div>
        <div className="bg-[#1e2d4d] text-white flex items-center justify-center px-6 py-8 w-full sm:w-80">
          <div className="flex flex-col items-center sm:items-end text-center sm:text-right w-full">
            <div className="w-24 sm:w-28 lg:w-32 mb-3">
              <img src="/Logo-Bela.svg" alt="Bela Nepal Logo" className="w-full h-auto object-contain" />
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
        {/* Section: Primary Info */}
        <div>
          <h2 className="text-md font-semibold bg-[#ef7e1a] text-white px-4 py-2 rounded">
            PRIMARY CONTACT INFORMATION :
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {primaryFields.map(({ label, name, type = "text" }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  className="input w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section: Address */}
        <div>
          <h2 className="text-md font-semibold bg-[#ef7e1a] text-white px-4 py-2 rounded">
            CONSTRUCTION SITE ADDRESS :
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {addressFields.map(({ label, name }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="input w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section: Project Requirements */}
        <div>
          <h2 className="text-md font-semibold bg-[#ef7e1a] text-white px-4 py-2 rounded">
            PROJECT REQUIREMENTS :
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {/* Project Type Radio Buttons */}
            <div>
              <label className="block mb-1 font-medium">Project Type :</label>
              <div className="space-y-1">
                {projectTypes.map((type) => (
                  <label className="flex items-center gap-2" key={type}>
                    <input
                      type="radio"
                      name="projectType"
                      value={type}
                      checked={formData.projectType === type}
                      onChange={handleChange}
                      className="accent-blue-600"
                    />
                    {type}
                  </label>
                ))}
                {formData.projectType === "Other" && (
                  <input
                    type="text"
                    name="projectTypeOther"
                    value={formData.projectTypeOther}
                    placeholder="Other (please specify)"
                    onChange={handleChange}
                    className="input w-full"
                  />
                )}
              </div>
            </div>

            {/* Project Fields */}
            {projectFields.map(({ label, name, type = "text" }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="input w-full"
                />
              </div>
            ))}

            {/* Project Scope */}
            <div>
              <label className="block mb-1 font-medium">Project Scope :</label>
              <div className="space-y-1">
                {projectScopes.map((scope) => (
                  <label className="flex items-center gap-2" key={scope}>
                    <input
                      type="radio"
                      name="projectScope"
                      value={scope}
                      checked={formData.projectScope === scope}
                      onChange={handleChange}
                      className="accent-blue-600"
                    />
                    {scope}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Vision Text Area */}
          <div className="mt-6">
            <label className="block mb-2 font-medium">Project Vision and Goals :</label>
            <textarea
              name="vision"
              value={formData.vision}
              onChange={handleChange}
              rows={5}
              placeholder="Please describe your vision and goals for the completed project"
              className="w-full input"
            />
          </div>

          {/* Note */}
          <p className="text-sm text-gray-700 mt-3">
            <strong>Note:</strong> Please attach a PDF or image of the land and/or building blueprint(s) to{" "}
            <a href="mailto:belanepal2025@gmail.com" className="text-blue-600 underline">
              belanepal2025@gmail.com
            </a>
          </p>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded w-full sm:w-auto"
          >
            Submit Project Info
          </button>
        </div>
      </form>
    </div>
  );
}
