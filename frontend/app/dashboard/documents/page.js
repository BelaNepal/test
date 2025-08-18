"use client";

import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000/api/documents";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [fileTypeFilter, setFileTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error("Failed to fetch documents");
      const data = await res.json();
      setDocuments(data);
      setFilteredDocs(data);
    } catch (error) {
      console.error(error);
      alert("Error loading documents");
    }
  }

  useEffect(() => {
    let filtered = documents;

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          (doc.title?.toLowerCase().includes(lowerSearch) ||
          doc.description?.toLowerCase().includes(lowerSearch))
      );
    }

    if (fileTypeFilter !== "all") {
      filtered = filtered.filter((doc) => {
        const ext = doc.filename?.split(".").pop().toLowerCase();
        return ext === fileTypeFilter;
      });
    }

    filtered = filtered.filter((doc) => {
      if (dateFilter === "all") return true;
      if (!doc.uploaded_at) return false;
      const uploadedDate = new Date(doc.uploaded_at);
      const now = new Date();

      if (dateFilter === "last7days") {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        return uploadedDate >= sevenDaysAgo;
      }
      if (dateFilter === "last30days") {
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return uploadedDate >= thirtyDaysAgo;
      }
      if (dateFilter === "lastYear") {
        const lastYear = new Date(now);
        lastYear.setFullYear(now.getFullYear() - 1);
        return uploadedDate >= lastYear;
      }
      return true;
    });

    setFilteredDocs(filtered);
  }, [searchTerm, fileTypeFilter, dateFilter, documents]);

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file || !title.trim()) {
      alert("Please provide a title and select a file");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title.trim());
    formData.append("description", description.trim());

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      await fetchDocuments();
      setFile(null);
      setTitle("");
      setDescription("");
      setActiveTab("view");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }

    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete document");
      await fetchDocuments();
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  }

  return (
    <main className="bg-white px-4 sm:px-6 pb-8 overflow-auto min-h-screen">
      <h1 className="text-2xl font-bold text-[#1e2d4d] mb-6">Document Management</h1>

      {/* Tabs */}
      <nav className="bg-gray-100 mb-6 rounded-md px-4 py-3 border border-gray-300 flex flex-wrap gap-3 sm:gap-6">
        {["upload", "view", "search"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`uppercase font-semibold tracking-wide px-3 py-2 rounded-md transition
              ${
                activeTab === tab
                  ? "bg-[#ef7e1e] text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Upload Tab */}
      {activeTab === "upload" && (
        <form onSubmit={handleUpload} className="max-w-3xl space-y-6">
          <div>
            <label htmlFor="title" className="block font-semibold mb-1 text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ef7e1e]"
              placeholder="Document title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-semibold mb-1 text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ef7e1e]"
              placeholder="Brief description (optional)"
            />
          </div>

          <div>
            <label htmlFor="file" className="block font-semibold mb-1 text-gray-700">
              Upload File <span className="text-red-500">*</span>
            </label>
            <input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="w-full"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#ef7e1e] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#d66c17] transition"
          >
            {loading ? "Uploading..." : "Upload Document"}
          </button>
        </form>
      )}

      {/* View Tab */}
      {activeTab === "view" && (
        <>
          {documents.length === 0 ? (
            <p className="text-center text-gray-500">No documents uploaded yet.</p>
          ) : (
            <ul className="max-w-5xl space-y-4">
              {documents.map(({ id, title, description, url, filename }) => (
                <li
                  key={id}
                  className="border border-gray-300 rounded-md p-4 flex justify-between items-center shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-[#1e2d4d]">{title}</h3>
                    <p className="text-gray-600 mt-1">{description}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#ef7e1e] underline font-semibold hover:text-[#d66c17]"
                    >
                      View
                    </a>
                    <a
                      href={url}
                      download={filename}
                      className="text-green-600 underline font-semibold hover:text-green-800"
                    >
                      Download
                    </a>
                    <button
                      onClick={() => handleDelete(id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="max-w-5xl space-y-6">
          <input
            type="search"
            placeholder="Search documents by title, description or images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ef7e1e]"
          />

          <div className="flex flex-wrap gap-4 mt-4 items-center">
            <div>
              <label htmlFor="fileTypeFilter" className="block font-semibold mb-1 text-gray-700">
                Filter by file type
              </label>
              <select
                id="fileTypeFilter"
                value={fileTypeFilter}
                onChange={(e) => setFileTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ef7e1e]"
              >
                <option value="all">All</option>
                <option value="pdf">PDF</option>
                <option value="doc">DOC</option>
                <option value="docx">DOCX</option>
                <option value="xls">XLS</option>
                <option value="xlsx">XLSX</option>
                <option value="txt">TXT</option>
                <option value="jpg">JPG</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="gif">GIF</option>
              </select>
            </div>

            <div>
              <label htmlFor="dateFilter" className="block font-semibold mb-1 text-gray-700">
                Filter by upload date
              </label>
              <select
                id="dateFilter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ef7e1e]"
              >
                <option value="all">All time</option>
                <option value="last7days">Last 7 days</option>
                <option value="last30days">Last 30 days</option>
                <option value="lastYear">Last year</option>
              </select>
            </div>
          </div>

          {filteredDocs.length === 0 ? (
            <p className="mt-4 text-center text-gray-500">No matching documents found.</p>
          ) : (
            <ul className="mt-6 space-y-4">
              {filteredDocs.map(({ id, title, description, url, filename }) => (
                <li
                  key={id}
                  className="border border-gray-300 rounded-md p-4 flex justify-between items-center shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-[#1e2d4d]">{title}</h3>
                    <p className="text-gray-600 mt-1">{description}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#ef7e1e] underline font-semibold hover:text-[#d66c17]"
                    >
                      View
                    </a>
                    <a
                      href={url}
                      download={filename}
                      className="text-green-600 underline font-semibold hover:text-green-800"
                    >
                      Download
                    </a>
                    <button
                      onClick={() => handleDelete(id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}
