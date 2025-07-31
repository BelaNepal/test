"use client";

import React, { useState } from "react";
import LoadingOverlay from "@/components/LoadingOverlay";
import nepalLocationData from "@/datasets/nepalData"; // Adjust path accordingly

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

  const [files, setFiles] = useState([]); // Array of File objects
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);

  // Dropdown dependent data states
  const [districts, setDistricts] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [wards, setWards] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setFormData((prev) => ({
      ...prev,
      province: selectedProvince,
      district: "",
      municipality: "",
      ward: "",
    }));

    const provinceData = nepalLocationData.find((p) => p.name === selectedProvince);
    setDistricts(provinceData?.districts || []);
    setMunicipalities([]);
    setWards([]);
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setFormData((prev) => ({
      ...prev,
      district: selectedDistrict,
      municipality: "",
      ward: "",
    }));

    const districtData = districts.find((d) => d.name === selectedDistrict);
    setMunicipalities(districtData?.municipalities || []);
    setWards([]);
  };

  const handleMunicipalityChange = (e) => {
    const selectedMunicipality = e.target.value;
    setFormData((prev) => ({
      ...prev,
      municipality: selectedMunicipality,
      ward: "",
    }));

    const municipalityData = municipalities.find((m) => m.name === selectedMunicipality);
    if (municipalityData?.wards) {
      setWards(Array.from({ length: municipalityData.wards }, (_, i) => i + 1));
    } else {
      setWards([]);
    }
  };

  const handleWardChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      ward: e.target.value,
    }));
  };

  // Multiple files selection handler
  const handleFileChange = (e) => {
    if (!e.target.files) return;

    // Combine existing files and new files, avoid duplicates by name+size
    const newFiles = Array.from(e.target.files);
    setFiles((prevFiles) => {
      const combined = [...prevFiles];
      newFiles.forEach((nf) => {
        if (!combined.some((f) => f.name === nf.name && f.size === nf.size)) {
          combined.push(nf);
        }
      });
      return combined;
    });

    // Reset file input so same file can be selected again if removed
    e.target.value = null;
  };

  // Remove file from selected list by index
  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare FormData to send files + other form fields
      const formPayload = new FormData();

      // Append form fields
      Object.entries(formData).forEach(([key, val]) => {
        formPayload.append(key, val);
      });

      // Append files (multiple)
      files.forEach((file, i) => {
        formPayload.append("blueprintFiles", file);
      });

      // Use fetch with multipart/form-data
      const response = await fetch("http://localhost:5000/api/submit-form", {
        method: "POST",
        body: formPayload,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Your project info has been submitted successfully!");
        setFormData({
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
        setFiles([]);
        setDistricts([]);
        setMunicipalities([]);
        setWards([]);
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const primaryFields = [
    { label: "Client’s / Organisation’s Full Name", name: "fullName" },
    { label: "Phone No.", name: "phone" },
    { label: "E-Mail", name: "email" },
    { label: "Date", name: "date", type: "date" },
  ];

  const projectTypes = ["Residential", "Commercial", "Other"];
  const projectScopes = ["New Build", "Addition / Extension", "Other"];

  const projectFields = [
    { label: "Total Land Area", name: "landArea" },
    { label: "Total Square Footage to be Constructed", name: "squareFootage" },
  ];

  return (
    <div
      className="relative bg-white shadow-xl border border-gray-200 rounded-md w-full min-h-screen px-4 py-8"
      style={{
        paddingTop: "4rem", // adjust for your navbar height
        boxSizing: "border-box",
      }}
    >
      <LoadingOverlay show={loading || testLoading} text="Submitting your form..." />

      {/* Banner */}
      <div className="flex flex-col lg:flex-row overflow-hidden rounded-xl shadow-md mb-10 w-full">
        <div className="flex-1 bg-white px-6 py-8 flex flex-col justify-center text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1e2d4d] tracking-tight leading-tight">
            PROJECT INFO
          </h1>
          <p className="text-gray-600 mt-4 text-base sm:text-lg lg:text-xl font-medium leading-relaxed">
            To apply for a project with us, kindly complete this form with accurate information.
          </p>
        </div>
        <div className="bg-[#1e2d4d] text-white flex items-center justify-center px-6 py-8 w-full lg:w-80">
          <div className="flex flex-col items-center lg:items-end text-center lg:text-right w-full">
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
      <form onSubmit={handleSubmit} className="space-y-10 text-sm w-full">
        {/* Primary Info */}
        <div>
          <h2 className="text-md font-semibold bg-[#ef7e1a] text-white px-4 py-2 rounded">
            PRIMARY CONTACT INFORMATION :
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {primaryFields.map(({ label, name, type = "text" }) => (
              <div key={name} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                {name === "phone" ? (
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder="98XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setFormData((prev) => ({ ...prev, phone: val }));
                    }}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1e2d4d]"
                  />
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1e2d4d]"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Address Info */}
        <div>
          <h2 className="text-md font-semibold bg-[#ef7e1a] text-white px-4 py-2 rounded">
            CONSTRUCTION SITE ADDRESS :
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Province */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
              <select
                name="province"
                value={formData.province}
                onChange={handleProvinceChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1e2d4d]"
              >
                <option value="">Select Province</option>
                {nepalLocationData.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleDistrictChange}
                disabled={!districts.length}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1e2d4d]"
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Municipality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Municipality / Rural Municipality
              </label>
              <select
                name="municipality"
                value={formData.municipality}
                onChange={handleMunicipalityChange}
                disabled={!municipalities.length}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1e2d4d]"
              >
                <option value="">Select Municipality</option>
                {municipalities.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ward */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ward No.</label>
              <select
                name="ward"
                value={formData.ward}
                onChange={handleWardChange}
                disabled={!wards.length}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1e2d4d]"
              >
                <option value="">Select Ward</option>
                {wards.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            {/* Street */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tole / Street Name</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1e2d4d]"
              />
            </div>

            {/* House No. */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                House No. (or additional landmarks)
              </label>
              <input
                type="text"
                name="houseNo"
                value={formData.houseNo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1e2d4d]"
              />
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div>
          <h2 className="text-md font-semibold bg-[#ef7e1a] text-white px-4 py-2 rounded">
            PROJECT REQUIREMENTS :
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Project Type */}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1e2d4d]"
                  />
                )}
              </div>
            </div>
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

          {/* Total Land Area and Square Footage in 2 columns */}
          <div className="grid grid-cols-2 gap-6 mt-4">
            {projectFields.map(({ label, name, type = "text" }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1e2d4d]"
                />
              </div>
            ))}
          </div>

          {/* Desired Project Completion Date and File Upload in 2 columns */}
          <div className="grid grid-cols-2 gap-6 mt-4 items-start">
            {/* Completion Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Desired Project Completion Date
              </label>
              <input
                type="date"
                name="completionDate"
                value={formData.completionDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1e2d4d]"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attach Land/Building Blueprint(s) (PDF or Images)
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Selected files list */}
              {files.length > 0 && (
                <ul className="mt-2 max-h-32 overflow-y-auto border border-gray-300 rounded p-2 space-y-1 bg-gray-50">
                  {files.map((file, idx) => (
                    <li
                      key={file.name + file.size}
                      className="flex justify-between items-center px-2 py-1 rounded hover:bg-gray-200 group"
                    >
                      <span className="truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition-opacity"
                        aria-label={`Remove file ${file.name}`}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Project Vision */}
          <div className="mt-6">
            <label className="block mb-2 font-medium">Project Vision and Goals :</label>
            <textarea
              name="vision"
              value={formData.vision}
              onChange={handleChange}
              rows={5}
              placeholder="Please describe your vision and goals for the completed project"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1e2d4d]"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded w-full sm:w-auto text-base"
          >
            Submit Project Info
          </button>
        </div>

      </form>
    </div>
  );
}
