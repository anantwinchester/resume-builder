// ResumeBuilder.jsx
// Single-file React component (default export) using Tailwind CSS.
// Features:
// - Editable form for personal details, summary, skills, experience, education.
// - Add/remove multiple experiences/education/skills.
// - Live preview with two template styles.
// - Save/load to localStorage.
// - Export preview to PDF using html2canvas + jsPDF (install those packages).
//
// Installation notes (include in your project README):
// npm install react react-dom html2canvas jspdf
// Tailwind must be configured for your project (create-react-app or Vite + Tailwind setup).
// Usage: Import <ResumeBuilder /> into your app and render.

import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ResumeBuilder() {
  const [profile, setProfile] = useState(() => ({
    name: 'Anant Chaudhary',
    title: 'BTech CSE Student',
    email: 'you@example.com',
    phone: '+91 90000 00000',
    location: 'Noida, India',
    linkedin: '',
    github: '',
    website: '',
    summary: 'Motivated 1st-year BTech CSE student with a passion for building practical projects and learning machine learning and web development.',
  }));

  const [skills, setSkills] = useState(['Python', 'C', 'HTML/CSS']);
  const [experiences, setExperiences] = useState([
    { role: 'Project: Fake News Detector', org: 'Personal', start: '2025', end: 'Present', details: 'Built an ML classifier to detect fake news using NLP and sklearn.' },
  ]);
  const [education, setEducation] = useState([
    { degree: 'B.Tech (CSE)', school: 'XYZ University, Noida', start: '2025', end: 'Present', grade: '' },
  ]);

  const [template, setTemplate] = useState('modern');
  const previewRef = useRef(null);

  useEffect(() => {
    // load from localStorage if exists
    const saved = localStorage.getItem('resume_builder_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.skills) setSkills(parsed.skills);
        if (parsed.experiences) setExperiences(parsed.experiences);
        if (parsed.education) setEducation(parsed.education);
        if (parsed.template) setTemplate(parsed.template);
      } catch (e) {
        console.warn('Could not parse saved resume data', e);
      }
    }
  }, []);

  useEffect(() => {
    const payload = { profile, skills, experiences, education, template };
    localStorage.setItem('resume_builder_data', JSON.stringify(payload));
  }, [profile, skills, experiences, education, template]);

  function updateProfile(key, value) {
    setProfile(prev => ({ ...prev, [key]: value }));
  }

  function addSkill(skill = '') {
    setSkills(s => [...s, skill]);
  }

  function updateSkill(index, value) {
    setSkills(s => s.map((sk, i) => (i === index ? value : sk)));
  }

  function removeSkill(index) {
    setSkills(s => s.filter((_, i) => i !== index));
  }

  function addExperience() {
    setExperiences(e => [...e, { role: '', org: '', start: '', end: '', details: '' }]);
  }

  function updateExperience(index, key, value) {
    setExperiences(e => e.map((ex, i) => (i === index ? { ...ex, [key]: value } : ex)));
  }

  function removeExperience(index) {
    setExperiences(e => e.filter((_, i) => i !== index));
  }

  function addEducation() {
    setEducation(ed => [...ed, { degree: '', school: '', start: '', end: '', grade: '' }]);
  }

  function updateEducation(index, key, value) {
    setEducation(ed => ed.map((it, i) => (i === index ? { ...it, [key]: value } : it)));
  }

  function removeEducation(index) {
    setEducation(ed => ed.filter((_, i) => i !== index));
  }

  async function exportToPDF(filename = 'resume.pdf') {
    if (!previewRef.current) return;
    const node = previewRef.current;
    const originalWidth = node.scrollWidth;
    const originalHeight = node.scrollHeight;

    // render to canvas
    const canvas = await html2canvas(node, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'pt', 'a4');
    // calculate dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  }

  function resetDemoData() {
  
    setProfile({
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: '',
      summary: '',
    });
    setSkills([]);
    setExperiences([]);
    setEducation([]);
  }

  function importJSON(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.skills) setSkills(parsed.skills);
        if (parsed.experiences) setExperiences(parsed.experiences);
        if (parsed.education) setEducation(parsed.education);
        if (parsed.template) setTemplate(parsed.template);
        alert('Imported successfully');
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  }

  function exportJSON() {
    const payload = { profile, skills, experiences, education, template };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Editor */}
        <div className="col-span-1 bg-white p-4 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-3">Resume Builder — Editor</h2>

          <section className="mb-4">
            <label className="block text-sm font-medium">Full name</label>
            <input value={profile.name} onChange={e => updateProfile('name', e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" placeholder="Your name" />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input value={profile.title} onChange={e => updateProfile('title', e.target.value)} className="block w-full border rounded px-3 py-2" placeholder="Title (e.g., BTech CSE Student)" />
              <input value={profile.location} onChange={e => updateProfile('location', e.target.value)} className="block w-full border rounded px-3 py-2" placeholder="Location" />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input value={profile.email} onChange={e => updateProfile('email', e.target.value)} className="block w-full border rounded px-3 py-2" placeholder="Email" />
              <input value={profile.phone} onChange={e => updateProfile('phone', e.target.value)} className="block w-full border rounded px-3 py-2" placeholder="Phone" />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input value={profile.linkedin} onChange={e => updateProfile('linkedin', e.target.value)} className="block w-full border rounded px-3 py-2" placeholder="LinkedIn URL" />
              <input value={profile.github} onChange={e => updateProfile('github', e.target.value)} className="block w-full border rounded px-3 py-2" placeholder="GitHub URL" />
            </div>
            <input value={profile.website} onChange={e => updateProfile('website', e.target.value)} className="mt-2 block w-full border rounded px-3 py-2" placeholder="Personal website" />
          </section>

          <section className="mb-4">
            <label className="block text-sm font-medium">Summary / Objective</label>
            <textarea value={profile.summary} onChange={e => updateProfile('summary', e.target.value)} rows={4} className="mt-1 block w-full border rounded px-3 py-2" placeholder="Write 2-4 lines about yourself" />
          </section>

          <section className="mb-4">
            <label className="block text-sm font-medium">Skills</label>
            <div className="space-y-2 mt-2">
              {skills.map((sk, idx) => (
                <div key={idx} className="flex gap-2">
                  <input value={sk} onChange={e => updateSkill(idx, e.target.value)} className="flex-1 border rounded px-3 py-2" />
                  <button onClick={() => removeSkill(idx)} className="px-3 rounded bg-red-500 text-white">Remove</button>
                </div>
              ))}
              <div className="flex gap-2">
                <button onClick={() => addSkill('')} className="px-3 rounded bg-blue-600 text-white">Add skill</button>
                <button onClick={() => setSkills([])} className="px-3 rounded bg-gray-200">Clear</button>
              </div>
            </div>
          </section>

          <section className="mb-4">
            <label className="block text-sm font-medium">Experience</label>
            <div className="space-y-3 mt-2">
              {experiences.map((ex, idx) => (
                <div key={idx} className="p-3 border rounded">
                  <div className="grid grid-cols-2 gap-2">
                    <input value={ex.role} onChange={e => updateExperience(idx, 'role', e.target.value)} placeholder="Role / Project title" className="border rounded px-2 py-1" />
                    <input value={ex.org} onChange={e => updateExperience(idx, 'org', e.target.value)} placeholder="Organization" className="border rounded px-2 py-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input value={ex.start} onChange={e => updateExperience(idx, 'start', e.target.value)} placeholder="Start" className="border rounded px-2 py-1" />
                    <input value={ex.end} onChange={e => updateExperience(idx, 'end', e.target.value)} placeholder="End (or Present)" className="border rounded px-2 py-1" />
                  </div>
                  <textarea value={ex.details} onChange={e => updateExperience(idx, 'details', e.target.value)} rows={3} className="mt-2 border rounded px-2 py-1" placeholder="Details / achievements" />
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => removeExperience(idx)} className="px-3 rounded bg-red-500 text-white">Remove</button>
                  </div>
                </div>
              ))}
              <div>
                <button onClick={addExperience} className="px-3 rounded bg-blue-600 text-white">Add experience</button>
              </div>
            </div>
          </section>

          <section className="mb-4">
            <label className="block text-sm font-medium">Education</label>
            <div className="space-y-3 mt-2">
              {education.map((ed, idx) => (
                <div key={idx} className="p-3 border rounded">
                  <input value={ed.degree} onChange={e => updateEducation(idx, 'degree', e.target.value)} placeholder="Degree" className="w-full border rounded px-2 py-1" />
                  <input value={ed.school} onChange={e => updateEducation(idx, 'school', e.target.value)} placeholder="School / College" className="w-full border rounded px-2 py-1 mt-2" />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input value={ed.start} onChange={e => updateEducation(idx, 'start', e.target.value)} placeholder="Start" className="border rounded px-2 py-1" />
                    <input value={ed.end} onChange={e => updateEducation(idx, 'end', e.target.value)} placeholder="End" className="border rounded px-2 py-1" />
                  </div>
                  <input value={ed.grade} onChange={e => updateEducation(idx, 'grade', e.target.value)} placeholder="Grade / CGPA" className="w-full border rounded px-2 py-1 mt-2" />
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => removeEducation(idx)} className="px-3 rounded bg-red-500 text-white">Remove</button>
                  </div>
                </div>
              ))}
              <div>
                <button onClick={addEducation} className="px-3 rounded bg-blue-600 text-white">Add education</button>
              </div>
            </div>
          </section>

          <section className="flex gap-2 items-center">
            <label className="text-sm font-medium">Template</label>
            <select value={template} onChange={e => setTemplate(e.target.value)} className="border rounded px-2 py-1">
              <option value="modern">Modern (single column)</option>
              <option value="classic">Classic (two column)</option>
            </select>
          </section>

          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => exportToPDF('resume.pdf')} className="px-4 py-2 rounded bg-green-600 text-white">Download PDF</button>
            <button onClick={exportJSON} className="px-4 py-2 rounded bg-indigo-600 text-white">Export JSON</button>
            <label className="px-4 py-2 rounded bg-gray-200 cursor-pointer">
              Import JSON
              <input type="file" accept="application/json" onChange={importJSON} className="hidden" />
            </label>
            <button onClick={resetDemoData} className="px-4 py-2 rounded bg-red-500 text-white">Reset</button>
          </div>

        </div>

        {/* Right: Preview (span 2 columns) */}
        <div className="col-span-2 p-4">
          <h2 className="text-xl font-semibold mb-3">Live Preview</h2>

          <div ref={previewRef} className="bg-white p-6 rounded-2xl shadow-lg w-full">
            {/* Template renderer */}
            {template === 'modern' ? (
              <div className="max-w-3xl mx-auto">
                <div className="flex items-start gap-4">
                  <div>
                    <h1 className="text-3xl font-bold">{profile.name || 'Your Name'}</h1>
                    <p className="text-gray-600 mt-1">{profile.title}</p>
                    <div className="mt-3 text-sm text-gray-700 space-y-1">
                      <div>{profile.email} • {profile.phone}</div>
                      <div>{profile.location}</div>
                      <div>
                        {profile.linkedin && <span className="mr-2">LinkedIn: {profile.linkedin}</span>}
                        {profile.github && <span>GitHub: {profile.github}</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {profile.summary && (
                  <section className="mt-6">
                    <h3 className="font-semibold">Summary</h3>
                    <p className="text-sm mt-2 text-gray-700">{profile.summary}</p>
                  </section>
                )}

                {skills.length > 0 && (
                  <section className="mt-6">
                    <h3 className="font-semibold">Skills</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skills.map((s, i) => s && <span key={i} className="px-3 py-1 border rounded text-sm">{s}</span>)}
                    </div>
                  </section>
                )}

                {experiences.length > 0 && (
                  <section className="mt-6">
                    <h3 className="font-semibold">Projects & Experience</h3>
                    <div className="space-y-3 mt-2">
                      {experiences.map((ex, i) => (
                        <div key={i}>
                          <div className="flex justify-between">
                            <div>
                              <strong>{ex.role}</strong> <span className="text-sm text-gray-600">• {ex.org}</span>
                            </div>
                            <div className="text-sm text-gray-600">{ex.start} – {ex.end}</div>
                          </div>
                          <div className="text-sm text-gray-700 mt-1">{ex.details}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {education.length > 0 && (
                  <section className="mt-6">
                    <h3 className="font-semibold">Education</h3>
                    <div className="space-y-3 mt-2">
                      {education.map((ed, i) => (
                        <div key={i}>
                          <div className="flex justify-between">
                            <div>
                              <strong>{ed.degree}</strong>
                              <div className="text-sm text-gray-600">{ed.school}</div>
                            </div>
                            <div className="text-sm text-gray-600">{ed.start} – {ed.end}</div>
                          </div>
                          {ed.grade && <div className="text-sm text-gray-700 mt-1">Grade: {ed.grade}</div>}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

              </div>
            ) : (
              <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6">
                <div className="col-span-1 bg-gray-100 p-4 rounded">
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <div className="text-sm text-gray-600 mt-1">{profile.title}</div>
                  <div className="mt-3 text-sm">{profile.email}<br />{profile.phone}<br />{profile.location}</div>

                  {skills.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold">Skills</h4>
                      <ul className="mt-2 text-sm list-disc ml-4">
                        {skills.map((s, i) => s && <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}

                </div>
                <div className="col-span-2 p-4">
                  {profile.summary && (
                    <section>
                      <h3 className="font-semibold">Summary</h3>
                      <p className="text-sm mt-2 text-gray-700">{profile.summary}</p>
                    </section>
                  )}

                  {experiences.length > 0 && (
                    <section className="mt-4">
                      <h3 className="font-semibold">Projects & Experience</h3>
                      <div className="mt-2 space-y-3 text-sm">
                        {experiences.map((ex, i) => (
                          <div key={i}>
                            <div className="font-medium">{ex.role} <span className="text-gray-600">• {ex.org}</span></div>
                            <div className="text-gray-600 text-xs">{ex.start} – {ex.end}</div>
                            <div className="mt-1">{ex.details}</div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {education.length > 0 && (
                    <section className="mt-4">
                      <h3 className="font-semibold">Education</h3>
                      <div className="mt-2 text-sm space-y-2">
                        {education.map((ed, i) => (
                          <div key={i}>
                            <div className="font-medium">{ed.degree}</div>
                            <div className="text-xs text-gray-600">{ed.school} — {ed.start}–{ed.end}</div>
                            {ed.grade && <div className="mt-1 text-sm">{ed.grade}</div>}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600">Tip: Edit fields on left. Your changes save automatically in your browser.</p>
          </div>

        </div>
      </div>
    </div>
  );
}

