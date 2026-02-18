import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import SubjectActionModal from "../components/SubjectActionModal";

export default function SubjectSelection() {
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [activeSubject, setActiveSubject] = useState(null);

  /* Load selected exam */
  useEffect(() => {
    const stored = localStorage.getItem("selectedExam");
    if (!stored) {
      navigate("/exams");
      return;
    }
    setExam(JSON.parse(stored));
  }, [navigate]);

  /* Load subjects for exam */
  useEffect(() => {
    if (!exam) return;

    const loadSubjects = async () => {
      const snap = await getDocs(collection(db, "subjects"));
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // exam.subjects contains subject IDs
      const filtered = all.filter(s => exam.subjects.includes(s.id));
      setSubjects(filtered);
    };

    loadSubjects();
  }, [exam]);

  const totalSubjects = subjects.length;
  const practicedCount = 0; // TODO: replace with user progress data


  if (!exam) return null;
    
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-[#0f0f1a] dark:text-white">
  
      <main className="max-w-[1100px] mx-auto px-6 py-6">
  
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-8">
  
          <div className="max-w-xl">
  
            <h2 className="
              text-2xl md:text-3xl
              font-bold
              tracking-tight
            ">
              {exam.type}
            </h2>
  
            <p className="
              text-xs
              text-[#6a6a9a]
              dark:text-gray-400
              mt-1
            ">
              Choose a subject to begin practice
            </p>
  
          </div>
  
  
          {/* Skeuomorphic Progress Indicator */}
          <div className="
            px-4 py-2 rounded-lg
  
            bg-gradient-to-b from-white to-slate-200
            dark:from-[#1f2235] dark:to-[#161827]
  
            border border-slate-300 dark:border-white/10
  
            shadow-[6px_6px_12px_rgba(0,0,0,0.15),_-4px_-4px_8px_rgba(255,255,255,0.9)]
            dark:shadow-[6px_6px_12px_rgba(0,0,0,0.6),_-4px_-4px_8px_rgba(255,255,255,0.05)]
  
            flex items-center gap-2
          ">
  
            <span className="material-symbols-outlined text-primary text-[18px]">
              insights
            </span>
  
            <p className="text-xs font-semibold">
              <span className="text-primary font-bold">
                {practicedCount}
              </span>{" "}
              / {totalSubjects} practiced
            </p>
  
          </div>
  
        </div>
  
  
  
        {/* Subject Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
  
          {subjects.map(subject => (
            <div
              key={subject.id}
              onClick={() => setActiveSubject(subject)}
              className="subject-card cursor-pointer rounded-xl overflow-hidden transition-all duration-150"
            >
  
  
              {/* Image */}
              <div className="subject-image-wrapper">
  
                <img
                  src={`https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(subject.name)}`}
                  alt={subject.name}
                  className="subject-image"
                />
  
              </div>
  
  
  
              {/* Content */}
              <div className="p-4">
  
                {/* Title */}
                <div className="flex items-center gap-2 mb-2">
  
                  <div className="subject-icon-shell">
  
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      {subject.icon}
                    </span>
  
                  </div>
  
                  <h3 className="font-semibold text-sm">
                    {subject.name}
                  </h3>
  
                </div>
  
  
                {/* Meta */}
                <div className="space-y-1">
  
                  <p className="subject-meta">
                    <span className="material-symbols-outlined text-[14px]">
                      format_list_numbered
                    </span>
                    10 Questions
                  </p>
  
                  <p className="subject-meta">
                    <span className="material-symbols-outlined text-[14px]">
                      timer
                    </span>
                    10 Minutes
                  </p>
  
                </div>
  
  
                {/* Description */}
                <p className="subject-description">
                  {subject.description}
                </p>
  
              </div>
  
            </div>
          ))}
  
        </div>
  
      </main>
  
  
      {/* Modal */}
      {activeSubject && (
        <SubjectActionModal
          exam={exam}
          subject={activeSubject}
          onClose={() => setActiveSubject(null)}
          onStartQuiz={() => {
            navigate("/quiz", {
              state: { exam, subject: activeSubject }
            });
          }}
        />
      )}
  
  
  
      {/* Skeuomorphic CSS */}
      <style jsx>{`
  
        /* Main card shell */
        .subject-card {
  
          background: linear-gradient(145deg, #ffffff, #e6e9ef);
  
          border: 1px solid rgba(0,0,0,0.06);
  
          box-shadow:
            8px 8px 16px rgba(0,0,0,0.15),
            -6px -6px 12px rgba(255,255,255,0.9),
            inset 0 1px 0 rgba(255,255,255,0.8);
        }
  
  
        .dark .subject-card {
  
          background: linear-gradient(145deg, #1f2235, #161827);
  
          border: 1px solid rgba(255,255,255,0.05);
  
          box-shadow:
            8px 8px 16px rgba(0,0,0,0.6),
            -4px -4px 8px rgba(255,255,255,0.05),
            inset 0 1px 0 rgba(255,255,255,0.05);
        }
  
  
  
        /* Hover */
        .subject-card:hover {
  
          transform: translateY(-3px);
  
          box-shadow:
            12px 12px 20px rgba(0,0,0,0.18),
            -8px -8px 14px rgba(255,255,255,0.95);
        }
  
  
  
        /* Pressed */
        .subject-card:active {
  
          transform: scale(0.97);
  
          box-shadow:
            inset 4px 4px 8px rgba(0,0,0,0.2),
            inset -4px -4px 8px rgba(255,255,255,0.8);
        }
  
  
  
        /* Image shell */
        .subject-image-wrapper {
  
          padding: 10px;
  
          background: linear-gradient(145deg, #f8fafc, #dde3ea);
  
          border-bottom: 1px solid rgba(0,0,0,0.05);
  
          box-shadow:
            inset 2px 2px 6px rgba(0,0,0,0.1),
            inset -2px -2px 6px rgba(255,255,255,0.8);
        }
  
  
        .dark .subject-image-wrapper {
  
          background: linear-gradient(145deg, #161827, #1f2235);
        }
  
  
  
        .subject-image {
  
          height: 90px;
          width: 100%;
  
          object-fit: cover;
        }
  
  
  
        /* Icon shell */
        .subject-icon-shell {
  
          width: 28px;
          height: 28px;
  
          display: flex;
          align-items: center;
          justify-content: center;
  
          border-radius: 6px;
  
          background: linear-gradient(145deg, #ffffff, #e6e9ef);
  
          box-shadow:
            3px 3px 6px rgba(0,0,0,0.2),
            -2px -2px 4px rgba(255,255,255,0.9);
        }
  
  
  
        /* Meta text */
        .subject-meta {
  
          font-size: 11px;
  
          color: #6a6a9a;
  
          display: flex;
          align-items: center;
          gap: 6px;
        }
  
  
  
        /* Description */
        .subject-description {
  
          font-size: 11px;
  
          margin-top: 8px;
  
          padding-top: 8px;
  
          border-top: 1px solid rgba(0,0,0,0.06);
  
          color: #6a6a9a;
  
          font-style: italic;
        }
  
      `}</style>
  
    </div>
  );
  
}