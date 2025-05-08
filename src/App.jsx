import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import jsPDF from "jspdf";

const downloadPDF = () => {
  const doc = new jsPDF();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(summary, 10, 10);
  doc.save("lecture-summary.pdf");
};


export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [step, setStep] = useState(0);
  const [summary, setSummary] = useState(null);
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const steps = ["Compressing", "Transcribing", "Summarizing", "Extracting Frames", "Generating PDF"];

  const handleUpload = async () => {
    if (!file) return;
    setStep(1);
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("http://localhost:5000/api/summarize", { method: "POST", body: formData });
      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  
    setStep(steps.length);
  };
  
  const downloadPDF = () => {
    if (!summary) return;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;
    const lineHeight = 20;
    const maxWidth = 500;
    let y = margin;

    doc.setFontSize(12);
    const lines = doc.splitTextToSize(summary, maxWidth);
    lines.forEach((line) => {
      if (y > 800) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });

    doc.save("lecture-summary.pdf");
};

  return (
    <div className="min-h-screen p-6">      
      <div className="max-w-2xl mx-auto space-y-8 rounded-xl shadow-xl bg-white dark:bg-orange-200 text-black dark:text-white p-8">
        <header className="flex justify-between items-center border-b pb-4">
          <h1 className="text-3xl font-bold text-orange-500 flex items-center gap-2 animate-fade-in">
             <span>Lecture Summarizer</span>
          </h1>
          <div className="flex items-center gap-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-md border border-gray-300 px-2 py-1 text-sm bg-white dark:bg-zinc-100 text-black dark:text-black"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              
            </select>
            <div className="flex items-center gap-2">
              <span role="img" aria-label="sun">🌞</span>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              <span role="img" aria-label="moon">🌙</span>
            </div>
          </div>
        </header>

        {!summary ? (
          <div className="space-y-4">
            <div className="w-full border-2 border-dashed border-orange-300 p-6 rounded-lg text-center hover:bg-orange-50 dark:hover:bg-zinc-200 transition">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full file:px-4 file:py-2 file:rounded-md file:border-none file:bg-orange-500 file:text-white hover:file:bg-orange-600 cursor-pointer"
              />
              <p className="text-sm text-white-600 dark:text-gray-100 mt-2">Upload your lecture video file here!</p>
            </div>
            <Button onClick={handleUpload} disabled={!file} className="w-full animate-in zoom-in">
               Start Summarizing!
            </Button>
            {step > 0 && (
              <div className="space-y-2 animate-fade-in">
                <p className="text-sm">⏳ Processing: {steps[step - 1]}</p>
                <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all duration-300"
                    style={{ width: `${(step / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold text-orange-500">📝 Summary Preview</h2>
            <div className="rounded-md border p-4 bg-zinc-100 dark:bg-zinc-100 text-black dark:black">
              <pre className="whitespace-pre-wrap text-sm">{summary}</pre>
            </div>
            <Button className="w-full" onClick={downloadPDF}>⬇️ Download PDF</Button>
            <Button
              className="w-full border text-orange-500 border-orange-500 bg-orange-500 dark:orange-500 hover:bg-orange-50 dark:text-white"
              onClick={() => {
                setSummary(null);
                setStep(0);
              }}
            >
              🔄 Process Another Video
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
