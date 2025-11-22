// src/App.js
import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function App() {
  const [profile, setProfile] = useState(() => ({
    name: "Anant Chaudhary",
    title: "B.Tech CSE Student",
    email: "you@example.com",
    phone: "+91 90000 00000",
    location: "Noida, India",
    linkedin: "",
    github: "",
    website: "",
    summary:
      "Motivated 1st-year B.Tech CSE student with a passion for building real-world projects and learning machine learning and web development.",
  }));

  const [skills, setSkills] = useState(["Python", "C", "HTML/CSS"]);
  const [experiences, setExperiences] = useState([
    {
      role: "Project: Fake News Detector",
      org: "Personal Project",
      start: "2025",
      end: "Present",
      details:
        "Built an ML classifier to detect fake news using NLP and scikit-learn. Achieved good accuracy on a labelled dataset.",
    },
  ]);
  const [education, setEducation] = useState([
    {
      degree: "B.Tech (Computer Science & Engineering)",
      school: "XYZ University, Noida",
      start: "2025",
      end: "Present",
      grade: "",
    },
  ]);

  const [template, setTemplate] = useState("modern");
  const [isCompactPreview, setIsCompactPreview] = useState(false);
  const previewRef = useRef(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("resume_builder_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.skills) setSkills(parsed.skills);
        if (parsed.experiences) setExperiences(parsed.experiences);
        if (parsed.education) setEducation(parsed.education);
        if (parsed.template) setTemplate(parsed.template);
        if (typeof parsed.isCompactPreview === "boolean") {
          setIsCompactPreview(parsed.isCompactPreview);
        }
      } catch (e) {
        console.warn("Could not parse saved resume data", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    const payload = {
      profile,
      skills,
      experiences,
      education,
      template,
      isCompactPreview,
    };
    localStorage.setItem("resume_builder_data", JSON.stringify(payload));
  }, [profile, skills, experiences, education, template, isCompactPreview]);

  // ----- Handlers -----

  function updateProfile(key, value) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  function addSkill(skill = "") {
    setSkills((s) => [...s, skill]);
  }

  function updateSkill(index, value) {
    setSkills((s) => s.map((sk, i) => (i === index ? value : sk)));
  }

  function removeSkill(index) {
    setSkills((s) => s.filter((_, i) => i !== index));
  }

  function addExperience() {
    setExperiences((e) => [
      ...e,
      { role: "", org: "", start: "", end: "", details: "" },
    ]);
  }

  function updateExperience(index, key, value) {
    setExperiences((e) =>
      e.map((ex, i) => (i === index ? { ...ex, [key]: value } : ex))
    );
  }

  function removeExperience(index) {
    setExperiences((e) => e.filter((_, i) => i !== index));
  }

  function addEducation() {
    setEducation((ed) => [
      ...ed,
      { degree: "", school: "", start: "", end: "", grade: "" },
    ]);
  }

  function updateEducation(index, key, value) {
    setEducation((ed) =>
      ed.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  }

  function removeEducation(index) {
    setEducation((ed) => ed.filter((_, i) => i !== index));
  }

  async function exportToPDF(filename = "resume.pdf") {
    if (!previewRef.current) return;
    const node = previewRef.current;

    const canvas = await html2canvas(node, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#020617", // match dark background
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  }

  function resetAll() {
    setProfile({
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
      summary: "",
    });
    setSkills([]);
    setExperiences([]);
    setEducation([]);
  }

  function importJSON(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.skills) setSkills(parsed.skills);
        if (parsed.experiences) setExperiences(parsed.experiences);
        if (parsed.education) setEducation(parsed.education);
        if (parsed.template) setTemplate(parsed.template);
        if (typeof parsed.isCompactPreview === "boolean") {
          setIsCompactPreview(parsed.isCompactPreview);
        }
        alert("Imported successfully ✨");
      } catch (err) {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  }

  function exportJSON() {
    const payload = {
      profile,
      skills,
      experiences,
      education,
      template,
      isCompactPreview,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  // ----- UI Components -----

  const inputBase =
    "w-full rounded-xl border border-slate-700/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring focus:ring-blue-500/30 transition";
  const labelBase = "block text-xs font-medium text-slate-300/90";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-sans">
      {/* Subtle top glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-500/15 to-transparent blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row md:px-8 md:py-10">
        {/* Left: Editor */}
        <div className="md:w-[46%]">
          {/* Header bar */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold tracking-tight md:text-xl">
                Resume Studio
              </h1>
              <p className="text-xs text-slate-400 md:text-sm">
                Dark, modern resume builder – built by you. ✨
              </p>
            </div>

            {/* Small template toggle */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/60 p-1 text-xs">
                <button
                  onClick={() => setTemplate("modern")}
                  className={`rounded-full px-3 py-1 transition ${
                    template === "modern"
                      ? "bg-slate-100 text-slate-900 shadow-sm"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  Modern
                </button>
                <button
                  onClick={() => setTemplate("classic")}
                  className={`rounded-full px-3 py-1 transition ${
                    template === "classic"
                      ? "bg-slate-100 text-slate-900 shadow-sm"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  Classic
                </button>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-[11px] text-slate-400">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900"
                  checked={isCompactPreview}
                  onChange={(e) => setIsCompactPreview(e.target.checked)}
                />
                Compact preview
              </label>
            </div>
          </div>

          {/* Editor card */}
          <div className="h-[78vh] overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/70 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl">
            <div className="flex items-center gap-2 border-b border-slate-800/80 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              <span className="ml-2 text-xs text-slate-400">
                editor/app.js
              </span>
            </div>

            <div className="flex h-full flex-col gap-4 overflow-y-auto px-4 pb-4 pt-3 md:px-5 md:pt-4">
              {/* Personal section */}
              <section className="space-y-2 rounded-2xl bg-slate-900/60 px-3.5 py-3.5 ring-1 ring-slate-800/80 shadow-sm shadow-slate-950/40">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Profile
                </h2>

                <div className="space-y-2.5">
                  <div className="space-y-1.5">
                    <label className={labelBase}>Full name</label>
                    <input
                      className={inputBase}
                      value={profile.name}
                      onChange={(e) => updateProfile("name", e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className={labelBase}>Title</label>
                      <input
                        className={inputBase}
                        value={profile.title}
                        onChange={(e) =>
                          updateProfile("title", e.target.value)
                        }
                        placeholder="B.Tech CSE Student"
                      />
                    </div>
                    <div>
                      <label className={labelBase}>Location</label>
                      <input
                        className={inputBase}
                        value={profile.location}
                        onChange={(e) =>
                          updateProfile("location", e.target.value)
                        }
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className={labelBase}>Email</label>
                      <input
                        className={inputBase}
                        value={profile.email}
                        onChange={(e) =>
                          updateProfile("email", e.target.value)
                        }
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className={labelBase}>Phone</label>
                      <input
                        className={inputBase}
                        value={profile.phone}
                        onChange={(e) =>
                          updateProfile("phone", e.target.value)
                        }
                        placeholder="+91 ..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className={labelBase}>LinkedIn</label>
                      <input
                        className={inputBase}
                        value={profile.linkedin}
                        onChange={(e) =>
                          updateProfile("linkedin", e.target.value)
                        }
                        placeholder="linkedin.com/in/..."
                      />
                    </div>
                    <div>
                      <label className={labelBase}>GitHub</label>
                      <input
                        className={inputBase}
                        value={profile.github}
                        onChange={(e) =>
                          updateProfile("github", e.target.value)
                        }
                        placeholder="github.com/..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelBase}>Website / Portfolio</label>
                    <input
                      className={inputBase}
                      value={profile.website}
                      onChange={(e) =>
                        updateProfile("website", e.target.value)
                      }
                      placeholder="your-portfolio.com"
                    />
                  </div>
                </div>
              </section>

              {/* Summary */}
              <section className="space-y-2 rounded-2xl bg-slate-900/60 px-3.5 py-3.5 ring-1 ring-slate-800/80">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Summary
                </h2>
                <textarea
                  rows={4}
                  className={`${inputBase} min-h-[80px] resize-y`}
                  value={profile.summary}
                  onChange={(e) =>
                    updateProfile("summary", e.target.value)
                  }
                  placeholder="Write 2–4 lines about your strengths, interests, and what you’re looking for."
                />
              </section>

              {/* Skills */}
              <section className="space-y-2 rounded-2xl bg-slate-900/60 px-3.5 py-3.5 ring-1 ring-slate-800/80">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Skills
                  </h2>
                  <button
                    onClick={() => addSkill("")}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-900 shadow-sm hover:bg-white transition"
                  >
                    + Add
                  </button>
                </div>

                <div className="space-y-1.5">
                  {skills.map((sk, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        className={inputBase}
                        value={sk}
                        onChange={(e) =>
                          updateSkill(idx, e.target.value)
                        }
                        placeholder="e.g., Python, React, SQL"
                      />
                      <button
                        onClick={() => removeSkill(idx)}
                        className="rounded-xl border border-red-500/40 bg-red-500/10 px-2.5 text-xs text-red-300 hover:bg-red-500/20 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {skills.length === 0 && (
                    <p className="text-xs text-slate-500">
                      No skills added yet. Click “+ Add” to start.
                    </p>
                  )}
                </div>
              </section>

              {/* Experience */}
              <section className="space-y-2 rounded-2xl bg-slate-900/60 px-3.5 py-3.5 ring-1 ring-slate-800/80">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Projects & Experience
                  </h2>
                  <button
                    onClick={addExperience}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-900 shadow-sm hover:bg-white transition"
                  >
                    + Add
                  </button>
                </div>

                <div className="space-y-2.5">
                  {experiences.map((ex, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-3"
                    >
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className={labelBase}>Role / Project</label>
                          <input
                            className={inputBase}
                            value={ex.role}
                            onChange={(e) =>
                              updateExperience(idx, "role", e.target.value)
                            }
                            placeholder="e.g., Fake News Detection (ML)"
                          />
                        </div>
                        <div>
                          <label className={labelBase}>Org / Context</label>
                          <input
                            className={inputBase}
                            value={ex.org}
                            onChange={(e) =>
                              updateExperience(idx, "org", e.target.value)
                            }
                            placeholder="e.g., Personal / College"
                          />
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-2.5">
                        <div>
                          <label className={labelBase}>Start</label>
                          <input
                            className={inputBase}
                            value={ex.start}
                            onChange={(e) =>
                              updateExperience(idx, "start", e.target.value)
                            }
                            placeholder="2025"
                          />
                        </div>
                        <div>
                          <label className={labelBase}>End</label>
                          <input
                            className={inputBase}
                            value={ex.end}
                            onChange={(e) =>
                              updateExperience(idx, "end", e.target.value)
                            }
                            placeholder="Present"
                          />
                        </div>
                      </div>

                      <div className="mt-2">
                        <label className={labelBase}>Details</label>
                        <textarea
                          rows={3}
                          className={`${inputBase} min-h-[70px] resize-y`}
                          value={ex.details}
                          onChange={(e) =>
                            updateExperience(
                              idx,
                              "details",
                              e.target.value
                            )
                          }
                          placeholder="Explain what you did, tech used, and results."
                        />
                      </div>

                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={() => removeExperience(idx)}
                          className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs text-red-300 hover:bg-red-500/20 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  {experiences.length === 0 && (
                    <p className="text-xs text-slate-500">
                      No projects added yet. Add at least 1–2 projects for a
                      strong resume.
                    </p>
                  )}
                </div>
              </section>

              {/* Education */}
              <section className="space-y-2 rounded-2xl bg-slate-900/60 px-3.5 py-3.5 ring-1 ring-slate-800/80 mb-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Education
                  </h2>
                  <button
                    onClick={addEducation}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-900 shadow-sm hover:bg-white transition"
                  >
                    + Add
                  </button>
                </div>

                <div className="space-y-2.5">
                  {education.map((ed, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-3"
                    >
                      <div>
                        <label className={labelBase}>Degree</label>
                        <input
                          className={inputBase}
                          value={ed.degree}
                          onChange={(e) =>
                            updateEducation(idx, "degree", e.target.value)
                          }
                          placeholder="B.Tech CSE"
                        />
                      </div>
                      <div className="mt-2">
                        <label className={labelBase}>College / School</label>
                        <input
                          className={inputBase}
                          value={ed.school}
                          onChange={(e) =>
                            updateEducation(idx, "school", e.target.value)
                          }
                          placeholder="College name"
                        />
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2.5">
                        <div>
                          <label className={labelBase}>Start</label>
                          <input
                            className={inputBase}
                            value={ed.start}
                            onChange={(e) =>
                              updateEducation(idx, "start", e.target.value)
                            }
                            placeholder="2025"
                          />
                        </div>
                        <div>
                          <label className={labelBase}>End</label>
                          <input
                            className={inputBase}
                            value={ed.end}
                            onChange={(e) =>
                              updateEducation(idx, "end", e.target.value)
                            }
                            placeholder="2029"
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <label className={labelBase}>Grade / CGPA</label>
                        <input
                          className={inputBase}
                          value={ed.grade}
                          onChange={(e) =>
                            updateEducation(idx, "grade", e.target.value)
                          }
                          placeholder="e.g., 8.5 CGPA"
                        />
                      </div>

                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={() => removeEducation(idx)}
                          className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs text-red-300 hover:bg-red-500/20 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  {education.length === 0 && (
                    <p className="text-xs text-slate-500">
                      Add your degree and school/college details here.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => exportToPDF("resume.pdf")}
              className="inline-flex items-center gap-1 rounded-full bg-blue-500 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-sm shadow-blue-500/50 hover:bg-blue-400 hover:shadow-md transition"
            >
              ⬇ Download PDF
            </button>
            <button
              onClick={exportJSON}
              className="inline-flex items-center gap-1 rounded-full border border-slate-600 bg-slate-900/70 px-3.5 py-1.5 text-xs text-slate-100 hover:bg-slate-800 transition"
            >
              ⬇ Export JSON
            </button>
            <label className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-slate-600 bg-slate-900/70 px-3.5 py-1.5 text-xs text-slate-100 hover:bg-slate-800 transition">
              ⬆ Import JSON
              <input
                type="file"
                accept="application/json"
                onChange={importJSON}
                className="hidden"
              />
            </label>
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1 rounded-full border border-red-500/40 bg-red-500/10 px-3.5 py-1.5 text-xs text-red-200 hover:bg-red-500/20 transition"
            >
              Reset
            </button>

            <span className="ml-auto text-[11px] text-slate-500">
              Changes auto-save in your browser.
            </span>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="md:w-[54%]">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs text-slate-400 md:text-sm">
              Live resume preview · {template === "modern" ? "Modern" : "Classic"} layout
            </p>
          </div>

          <div
            className={`relative flex h-[82vh] items-center justify-center rounded-[32px] border border-slate-800/80 bg-slate-900/80 p-3 shadow-[0_20px_80px_rgba(15,23,42,0.9)] backdrop-blur-2xl`}
          >
            {/* subtle gradient glow */}
            <div className="pointer-events-none absolute inset-x-6 top-6 h-16 rounded-3xl bg-gradient-to-r from-blue-500/20 via-sky-400/10 to-violet-500/20 blur-2xl" />

            <div
              ref={previewRef}
              className={`relative w-full max-w-[780px] rounded-3xl bg-slate-50 px-8 ${
                isCompactPreview ? "py-7" : "py-9"
              } text-slate-900 shadow-xl shadow-slate-900/40 transition-transform duration-300 hover:-translate-y-1`}
              style={{
                fontFamily:
                  '-apple-system, system-ui, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif',
              }}
            >
              {template === "modern" ? (
                <ModernTemplate
                  profile={profile}
                  skills={skills}
                  experiences={experiences}
                  education={education}
                  compact={isCompactPreview}
                />
              ) : (
                <ClassicTemplate
                  profile={profile}
                  skills={skills}
                  experiences={experiences}
                  education={education}
                  compact={isCompactPreview}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----- Templates -----

function ModernTemplate({ profile, skills, experiences, education, compact }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          {profile.name || "Your Name"}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {profile.title || "Your title / role"}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600">
          {(profile.email || profile.phone) && (
            <span>
              {profile.email}
              {profile.email && profile.phone && " · "}
              {profile.phone}
            </span>
          )}
          {profile.location && <span>{profile.location}</span>}
          {profile.linkedin && <span>LinkedIn: {profile.linkedin}</span>}
          {profile.github && <span>GitHub: {profile.github}</span>}
          {profile.website && <span>{profile.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {profile.summary && (
        <section className="text-[11.5px] leading-relaxed text-slate-700">
          <SectionHeading>Summary</SectionHeading>
          <p className="mt-1.5">{profile.summary}</p>
        </section>
      )}

      {/* Skills */}
      {skills.filter(Boolean).length > 0 && (
        <section className="text-[11.5px] text-slate-700">
          <SectionHeading>Skills</SectionHeading>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {skills
              .filter(Boolean)
              .map((s, i) => (
                <span
                  key={i}
                  className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px]"
                >
                  {s}
                </span>
              ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="text-[11.5px] text-slate-700">
          <SectionHeading>Projects & Experience</SectionHeading>
          <div className="mt-1.5 space-y-2.5">
            {experiences.map((ex, i) => (
              <div key={i}>
                <div className="flex flex-wrap items-baseline justify-between gap-1">
                  <div className="font-medium text-slate-900">
                    {ex.role || "Role / Project"}
                    {ex.org && (
                      <span className="ml-1 text-slate-500">
                        · {ex.org}
                      </span>
                    )}
                  </div>
                  {(ex.start || ex.end) && (
                    <div className="text-[11px] text-slate-500">
                      {ex.start} {ex.start && ex.end && "–"} {ex.end}
                    </div>
                  )}
                </div>
                {ex.details && (
                  <p className="mt-0.5 text-[11.3px] leading-relaxed text-slate-700">
                    {ex.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="text-[11.5px] text-slate-700">
          <SectionHeading>Education</SectionHeading>
          <div className="mt-1.5 space-y-2">
            {education.map((ed, i) => (
              <div key={i}>
                <div className="flex flex-wrap items-baseline justify-between gap-1">
                  <div>
                    <div className="font-medium text-slate-900">
                      {ed.degree || "Degree"}
                    </div>
                    {ed.school && (
                      <div className="text-[11px] text-slate-500">
                        {ed.school}
                      </div>
                    )}
                  </div>
                  {(ed.start || ed.end) && (
                    <div className="text-[11px] text-slate-500">
                      {ed.start} {ed.start && ed.end && "–"} {ed.end}
                    </div>
                  )}
                </div>
                {ed.grade && (
                  <div className="mt-0.5 text-[11px] text-slate-600">
                    Grade: {ed.grade}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ClassicTemplate({
  profile,
  skills,
  experiences,
  education,
  compact,
}) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      <aside className="space-y-4 border-r border-slate-200 pr-4 text-[11.5px] text-slate-700">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {profile.name || "Your Name"}
          </h1>
          <p className="mt-0.5 text-[11px] text-slate-500">
            {profile.title || "Your title / role"}
          </p>
        </div>

        <div>
          <SubHeading>Contact</SubHeading>
          <div className="mt-1.5 space-y-0.5">
            {profile.email && <p>{profile.email}</p>}
            {profile.phone && <p>{profile.phone}</p>}
            {profile.location && <p>{profile.location}</p>}
            {profile.linkedin && <p>LinkedIn: {profile.linkedin}</p>}
            {profile.github && <p>GitHub: {profile.github}</p>}
            {profile.website && <p>{profile.website}</p>}
          </div>
        </div>

        {skills.filter(Boolean).length > 0 && (
          <div>
            <SubHeading>Skills</SubHeading>
            <ul className="mt-1.5 list-disc space-y-0.5 pl-4">
              {skills
                .filter(Boolean)
                .map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
            </ul>
          </div>
        )}
      </aside>

      <main className="md:col-span-2 space-y-4 text-[11.5px] text-slate-700">
        {profile.summary && (
          <section>
            <SubHeading>Summary</SubHeading>
            <p className="mt-1.5 leading-relaxed">{profile.summary}</p>
          </section>
        )}

        {experiences.length > 0 && (
          <section>
            <SubHeading>Projects & Experience</SubHeading>
            <div className="mt-1.5 space-y-2.5">
              {experiences.map((ex, i) => (
                <div key={i}>
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <div className="font-medium text-slate-900">
                      {ex.role || "Role / Project"}
                      {ex.org && (
                        <span className="ml-1 text-slate-500">
                          · {ex.org}
                        </span>
                      )}
                    </div>
                    {(ex.start || ex.end) && (
                      <div className="text-[11px] text-slate-500">
                        {ex.start} {ex.start && ex.end && "–"} {ex.end}
                      </div>
                    )}
                  </div>
                  {ex.details && (
                    <p className="mt-0.5 leading-relaxed">
                      {ex.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <SubHeading>Education</SubHeading>
            <div className="mt-1.5 space-y-2">
              {education.map((ed, i) => (
                <div key={i}>
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <div>
                      <div className="font-medium text-slate-900">
                        {ed.degree || "Degree"}
                      </div>
                      {ed.school && (
                        <div className="text-[11px] text-slate-500">
                          {ed.school}
                        </div>
                      )}
                    </div>
                    {(ed.start || ed.end) && (
                      <div className="text-[11px] text-slate-500">
                        {ed.start} {ed.start && ed.end && "–"} {ed.end}
                      </div>
                    )}
                  </div>
                  {ed.grade && (
                    <div className="mt-0.5 text-[11px] text-slate-600">
                      Grade: {ed.grade}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h3 className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-slate-500">
      {children}
    </h3>
  );
}

function SubHeading({ children }) {
  return (
    <h3 className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-slate-500">
      {children}
    </h3>
  );
}
