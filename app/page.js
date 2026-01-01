"use client";
import { useState, useEffect } from "react";
export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    company: "",
    position: "",
    date: "",
    status: "Applied",
    resume: "",
    coverLetter: "",
    notes: "",
  });
  const [view, setView] = useState(null);
  const [tab, setTab] = useState("resume");
  const [state, setState] = useState("");
  const [showState, setShowState] = useState(false);
  const [editState, setEditState] = useState(false);
  const [showPrompt, setShowPrompt] = useState(null);
  const [copied, setCopied] = useState("");
  const resumePrompt = `Create a professional tech resume that is HIGHLY TAILORED to the specific job description. Match keywords, emphasize relevant experience, and reorder sections to highlight what matters most for THIS role.

**Tailoring Rules:**
- Mirror the job description's language and keywords naturally
- Lead with the most relevant experience for this specific role
- Emphasize skills and achievements that directly match their requirements
- Remove or minimize irrelevant experience
- Quantify achievements that relate to their needs

**Visual Design:**
- Single column layout, no tables, graphics, icons, or images
- Simple, readable fonts (Arial, Calibri, Garamond) at 10-12pt
- Generous white space — don't cram content
- Clear section headers with consistent formatting
- Standard margins (0.5-1 inch)
- No colors except black (maybe one subtle accent if any)

**6-Second Scan Optimization:**
- Name and title prominent at top
- Most important/relevant info in the top third of the page
- Clear visual hierarchy — the eye should flow naturally
- Sections in order of relevance to the role
- Key skills and keywords visible at a glance

**ATS Compatibility:**
- No headers/footers for critical info (some ATS can't read them)
- Standard section names: Summary, Skills, Experience, Projects, Education
- No text boxes or columns
- Use standard bullet characters
- Spell out acronyms once, then abbreviate
- Save as .docx or plain PDF

**Content Rules:**
- Action verbs to start every bullet (Built, Developed, Designed, Implemented)
- No pronouns (I, me, my)
- No fluff phrases ("responsible for", "duties included", "helped with")
- Quantify where possible (%, users, time saved, scale)

Keep it clean, scannable, and substance-focused. The resume should feel like it was written specifically for this job.

---

MY STATE DOCUMENT:
[PASTE YOUR STATE DOCUMENT HERE]

---

JOB DESCRIPTION:
[PASTE THE JOB DESCRIPTION HERE]`;

  const coverLetterPrompt = `Create a compelling, professional cover letter that is HIGHLY TAILORED to the specific job description. This should feel personal, enthusiastic, and directly address why I'm the perfect fit for THIS role at THIS company.

**Tailoring Rules:**
- Research/reference the company's mission, values, or recent news if possible
- Directly address 2-3 key requirements from the job description
- Connect my specific experiences to their specific needs
- Show genuine enthusiasm for this particular role and company
- Explain why I want to work there, not just why I'm qualified

**Structure (3-4 paragraphs):**
1. **Opening Hook:** Grab attention immediately. State the role, express genuine enthusiasm, and hint at your strongest qualification. No generic "I am writing to apply..."
2. **Value Proposition:** Connect 2-3 of your most relevant achievements/skills directly to their requirements. Use specific examples and results. Show don't tell.
3. **Why This Company:** Demonstrate you've done your homework. What excites you about their mission, product, culture, or recent work? Make it personal and specific.
4. **Strong Close:** Reiterate enthusiasm, express eagerness to discuss further, and include a confident call to action.

**Tone & Style:**
- Professional but personable — let personality show through
- Confident without arrogance
- Specific and concrete, not vague and generic
- Concise — respect their time (under 400 words ideal)
- No clichés ("team player", "hard worker", "passionate")
- No repeating the resume — add new context and narrative

**Format:**
- Standard business letter format
- No fancy fonts or colors
- Clean, readable paragraphs
- Proper greeting (research the hiring manager's name if possible)

The cover letter should make them excited to read my resume and meet me.

---

MY STATE DOCUMENT:
[PASTE YOUR STATE DOCUMENT HERE]

---

JOB DESCRIPTION:
[PASTE THE JOB DESCRIPTION HERE]`;

  useEffect(() => {
    const saved = localStorage.getItem("jobs");
    if (saved) setJobs(JSON.parse(saved));
    const s = localStorage.getItem("mystate");
    if (s) setState(s);
  }, []);
  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);
  useEffect(() => {
    localStorage.setItem("mystate", state);
  }, [state]);
  const add = () => {
    if (form.company && form.position) {
      setJobs([...jobs, { ...form, id: Date.now() }]);
      setForm({
        company: "",
        position: "",
        date: "",
        status: "Applied",
        resume: "",
        coverLetter: "",
        notes: "",
      });
    }
  };
  const del = (id) => setJobs(jobs.filter((j) => j.id !== id));
  const statusColor = {
    Applied: "#3b82f6",
    Interview: "#f59e0b",
    Offer: "#22c55e",
    Rejected: "#ef4444",
  };
  const formatText = (text) =>
    text.split("\n").map((line, i) => {
      const isHeader =
        line === line.toUpperCase() &&
        line.length > 2 &&
        line.trim().length > 0;
      const isBullet =
        line.trim().startsWith("•") ||
        line.trim().startsWith("-") ||
        line.trim().startsWith("*");
      if (isHeader)
        return (
          <div
            key={i}
            style={{
              fontWeight: 700,
              fontSize: 16,
              marginTop: 16,
              marginBottom: 8,
              color: "#1f2937",
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: 4,
            }}
          >
            {line}
          </div>
        );
      if (isBullet)
        return (
          <div
            key={i}
            style={{ paddingLeft: 20, marginBottom: 4, color: "#374151" }}
          >
            {line}
          </div>
        );
      if (line.trim() === "") return <div key={i} style={{ height: 8 }} />;
      return (
        <div key={i} style={{ marginBottom: 4, color: "#374151" }}>
          {line}
        </div>
      );
    });
  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 1500);
  };
  const copyWithState = (prompt, id) => {
    const full = prompt.replace(
      "[PASTE YOUR STATE DOCUMENT HERE]",
      state || "[PASTE YOUR STATE DOCUMENT HERE]"
    );
    copy(full, id);
  };
  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: 20,
        paddingBottom: 80,
      }}
    >
      <h1 style={{ marginBottom: 10 }}>Job Application Tracker</h1>
      <div
        style={{
          background: "#f0f9ff",
          border: "1px solid #bae6fd",
          borderRadius: 8,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <strong
          style={{ color: "#0369a1", display: "block", marginBottom: 12 }}
        >
          Workflow
        </strong>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid #bae6fd",
              borderRadius: 6,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 600, color: "#0369a1", marginBottom: 8 }}>
              Resume
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => copyWithState(resumePrompt, "resume-copy")}
                style={{
                  flex: 1,
                  padding: 10,
                  background: copied === "resume-copy" ? "#22c55e" : "#0ea5e9",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                {copied === "resume-copy" ? "✓ Copied!" : "Copy Prompt + State"}
              </button>
              <button
                onClick={() => setShowPrompt("resume")}
                style={{
                  padding: 10,
                  background: "#fff",
                  color: "#0369a1",
                  border: "1px solid #0369a1",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                View
              </button>
            </div>
          </div>
          <div
            style={{
              background: "#fff",
              border: "1px solid #bae6fd",
              borderRadius: 6,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 600, color: "#0369a1", marginBottom: 8 }}>
              Cover Letter
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => copyWithState(coverLetterPrompt, "cover-copy")}
                style={{
                  flex: 1,
                  padding: 10,
                  background: copied === "cover-copy" ? "#22c55e" : "#0ea5e9",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                {copied === "cover-copy" ? "✓ Copied!" : "Copy Prompt + State"}
              </button>
              <button
                onClick={() => setShowPrompt("cover")}
                style={{
                  padding: 10,
                  background: "#fff",
                  color: "#0369a1",
                  border: "1px solid #0369a1",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                View
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowState(true)}
          style={{
            width: "100%",
            padding: 10,
            background: "#fff",
            color: "#0369a1",
            border: "1px solid #0369a1",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 13,
            marginBottom: 12,
          }}
        >
          {state
            ? "⚙️ View/Edit State Document"
            : "⚙️ Add State Document (Required First)"}
        </button>
        <div
          style={{
            background: "#fff",
            border: "1px solid #bae6fd",
            borderRadius: 4,
            padding: 12,
            fontSize: 14,
            color: "#0c4a6e",
          }}
        >
          <strong>Steps:</strong>
          <ol style={{ margin: "8px 0 0", paddingLeft: 20, lineHeight: 1.8 }}>
            <li>Add your state document above (all your info)</li>
            <li>Click "Copy Prompt + State" for Resume or Cover Letter</li>
            <li>
              Paste into AI and replace{" "}
              <code
                style={{
                  background: "#e0f2fe",
                  padding: "2px 6px",
                  borderRadius: 3,
                }}
              >
                [PASTE THE JOB DESCRIPTION HERE]
              </code>
            </li>
            <li>Get your tailored content and track below</li>
          </ol>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <input
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          style={{ padding: 10, border: "1px solid #ccc", borderRadius: 4 }}
        />
        <input
          placeholder="Position"
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
          style={{ padding: 10, border: "1px solid #ccc", borderRadius: 4 }}
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          style={{ padding: 10, border: "1px solid #ccc", borderRadius: 4 }}
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          style={{ padding: 10, border: "1px solid #ccc", borderRadius: 4 }}
        >
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
      </div>
      <textarea
        placeholder="Resume (paste text)"
        value={form.resume}
        onChange={(e) => setForm({ ...form, resume: e.target.value })}
        style={{
          width: "100%",
          height: 100,
          padding: 10,
          border: "1px solid #ccc",
          borderRadius: 4,
          marginBottom: 10,
          boxSizing: "border-box",
          fontFamily: "inherit",
        }}
      />
      <textarea
        placeholder="Cover Letter (paste text)"
        value={form.coverLetter}
        onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
        style={{
          width: "100%",
          height: 100,
          padding: 10,
          border: "1px solid #ccc",
          borderRadius: 4,
          marginBottom: 10,
          boxSizing: "border-box",
          fontFamily: "inherit",
        }}
      />
      <textarea
        placeholder="Notes"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        style={{
          width: "100%",
          height: 60,
          padding: 10,
          border: "1px solid #ccc",
          borderRadius: 4,
          marginBottom: 10,
          boxSizing: "border-box",
          fontFamily: "inherit",
        }}
      />
      <button
        onClick={add}
        style={{
          padding: "10px 20px",
          background: "#3b82f6",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        Add Application
      </button>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f3f4f6" }}>
            {["Company", "Position", "Date", "Status", "Actions"].map((h) => (
              <th
                key={h}
                style={{
                  padding: 12,
                  textAlign: "left",
                  borderBottom: "2px solid #e5e7eb",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: 12 }}>{j.company}</td>
              <td style={{ padding: 12 }}>{j.position}</td>
              <td style={{ padding: 12 }}>{j.date}</td>
              <td style={{ padding: 12 }}>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: 4,
                    background: statusColor[j.status],
                    color: "#fff",
                    fontSize: 12,
                  }}
                >
                  {j.status}
                </span>
              </td>
              <td style={{ padding: 12 }}>
                <button
                  onClick={() => {
                    setView(j);
                    setTab("resume");
                  }}
                  style={{
                    marginRight: 8,
                    padding: "4px 8px",
                    background: "#6b7280",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  View
                </button>
                <button
                  onClick={() => del(j.id)}
                  style={{
                    padding: "4px 8px",
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          marginTop: 40,
          paddingTop: 20,
          borderTop: "1px solid #e5e7eb",
          textAlign: "center",
        }}
      >
        <a
          href="https://buymeacoffee.com/DavidZeff"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            background: "#FFDD00",
            color: "#000",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          ☕ Buy me a coffee
        </a>
      </div>
      {showPrompt && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setShowPrompt(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              maxWidth: 800,
              width: "100%",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: 20,
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0 }}>
                {showPrompt === "resume" ? "Resume" : "Cover Letter"} Prompt
              </h2>
              <button
                onClick={() =>
                  copy(
                    showPrompt === "resume" ? resumePrompt : coverLetterPrompt,
                    "prompt-view"
                  )
                }
                style={{
                  padding: "8px 16px",
                  background: copied === "prompt-view" ? "#22c55e" : "#0ea5e9",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                {copied === "prompt-view" ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            <div style={{ padding: 20, overflow: "auto", flex: 1 }}>
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  fontFamily: "monospace",
                  fontSize: 13,
                  lineHeight: 1.6,
                  background: "#f9fafb",
                  padding: 16,
                  borderRadius: 4,
                }}
              >
                {showPrompt === "resume" ? resumePrompt : coverLetterPrompt}
              </pre>
            </div>
            <div
              style={{
                padding: 15,
                borderTop: "1px solid #e5e7eb",
                textAlign: "right",
              }}
            >
              <button
                onClick={() => setShowPrompt(null)}
                style={{
                  padding: "10px 20px",
                  background: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showState && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => {
            setShowState(false);
            setEditState(false);
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              maxWidth: 800,
              width: "100%",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: 20,
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0 }}>My State Document</h2>
              <button
                onClick={() => setEditState(!editState)}
                style={{
                  padding: "8px 16px",
                  background: "#6b7280",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                {editState ? "Done" : "Edit"}
              </button>
            </div>
            <div style={{ padding: 20, overflow: "auto", flex: 1 }}>
              {editState ? (
                <textarea
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Paste your state document here (all your experience, skills, projects, education, contact info, etc)..."
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: 400,
                    padding: 12,
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    boxSizing: "border-box",
                    fontFamily: "monospace",
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                />
              ) : state ? (
                <pre
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    fontFamily: "monospace",
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  {state}
                </pre>
              ) : (
                <p style={{ color: "#999" }}>
                  No state document yet. Click Edit to add one.
                </p>
              )}
            </div>
            <div
              style={{
                padding: 15,
                borderTop: "1px solid #e5e7eb",
                textAlign: "right",
              }}
            >
              <button
                onClick={() => {
                  setShowState(false);
                  setEditState(false);
                }}
                style={{
                  padding: "10px 20px",
                  background: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {view && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setView(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              maxWidth: 800,
              width: "100%",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: 20, borderBottom: "1px solid #e5e7eb" }}>
              <h2 style={{ margin: 0 }}>
                {view.company} - {view.position}
              </h2>
              <p style={{ margin: "8px 0 0", color: "#666" }}>
                {view.date} •{" "}
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: statusColor[view.status],
                    color: "#fff",
                    fontSize: 12,
                  }}
                >
                  {view.status}
                </span>
              </p>
            </div>
            <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
              {["resume", "coverLetter", "notes"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1,
                    padding: 12,
                    border: "none",
                    background: tab === t ? "#f3f4f6" : "#fff",
                    cursor: "pointer",
                    fontWeight: tab === t ? 600 : 400,
                    borderBottom:
                      tab === t ? "2px solid #3b82f6" : "2px solid transparent",
                  }}
                >
                  {t === "coverLetter"
                    ? "Cover Letter"
                    : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div
              style={{
                padding: 20,
                overflow: "auto",
                flex: 1,
                lineHeight: 1.6,
              }}
            >
              {view[tab] ? (
                formatText(view[tab])
              ) : (
                <p style={{ color: "#999", fontStyle: "italic" }}>
                  No {tab === "coverLetter" ? "cover letter" : tab} provided
                </p>
              )}
            </div>
            <div
              style={{
                padding: 15,
                borderTop: "1px solid #e5e7eb",
                textAlign: "right",
              }}
            >
              <button
                onClick={() => setView(null)}
                style={{
                  padding: "10px 20px",
                  background: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
