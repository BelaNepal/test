"use client";

import { useState } from "react";

export default function CustomerFormPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    projectLocation: "",
    houseType: "",
    storeys: "",
    budget: "",
    timeline: "",
    specialRequirements: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted project info:", formData);
    setSubmitted(true);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Preliminary Project Form</h1>

      {submitted ? (
        <div className="bg-green-100 text-green-800 p-4 rounded shadow">
          Thank you! We've received your project details.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Project Location</label>
              <input
                type="text"
                name="projectLocation"
                required
                value={formData.projectLocation}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type of House</label>
              <select
                name="houseType"
                value={formData.houseType}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="School/Institution">School / Institution</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Number of Storeys</label>
              <select
                name="storeys"
                value={formData.storeys}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select</option>
                <option value="1">1 Storey</option>
                <option value="2">2 Storeys</option>
                <option value="3">3 Storeys</option>
                <option value="4+">4 or more</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estimated Budget (NPR)</label>
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expected Timeline</label>
              <select
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select</option>
                <option value="1-3 months">1–3 months</option>
                <option value="3-6 months">3–6 months</option>
                <option value="6+ months">6+ months</option>
                <option value="Not sure">Not sure</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Special Requirements / Notes</label>
            <textarea
              name="specialRequirements"
              rows={4}
              value={formData.specialRequirements}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded"
          >
            Submit Project Info
          </button>
        </form>
      )}
    </div>
  );
}
