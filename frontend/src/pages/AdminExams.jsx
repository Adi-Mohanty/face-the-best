import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../services/firebase";

export default function AdminExams() {

  const [examType, setExamType] = useState("");
  const [icon, setIcon] = useState("");
  const [examNames, setExamNames] = useState("");
  const [category, setCategory] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success"
  });

  const showSnackbar = (message, type = "success") => {
    setSnackbar({ open: true, message, type });

    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, open: false }));
    }, 3000);
  };

  const fetchExams = async () => {
    const snap = await getDocs(collection(db, "exams"));
    setExams(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "subjects"));
      setSubjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    load();
  }, []);

  const addExam = async () => {

    const trimmedType = examType.trim();
    const trimmedIcon = icon.trim();
    const trimmedNames = examNames.trim();

    if (!trimmedType || !trimmedIcon || !trimmedNames || !category) {
      showSnackbar("All fields are required", "error");
      return;
    }

    try {
      await addDoc(collection(db, "exams"), {
        type: trimmedType,
        icon: trimmedIcon,
        category,
        exams: trimmedNames.split(",").map(e => e.trim()),
        subjects: selectedSubjects,
        createdAt: serverTimestamp()
      });

      setExamType("");
      setIcon("");
      setExamNames("");
      setCategory("");
      setSelectedSubjects([]);
      setShowModal(false);

      fetchExams();
      showSnackbar("Exam added successfully");

    } catch (err) {
      showSnackbar("Failed to add exam", "error");
    }
  };

  const groupedExams = {
    basic: exams.filter(e => e.category === "basic"),
    "pre-grad": exams.filter(e => e.category === "pre-grad"),
    "post-grad": exams.filter(e => e.category === "post-grad")
  };

  return (
    <div className="exams-page">

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-slate-800">
            Manage Exams
          </h1>

          <button
            onClick={() => setShowModal(true)}
            className="primary-glass-btn flex items-center gap-2"
          >
            <span className="material-symbols-outlined">
              add
            </span>
            Add Exam
          </button>
        </div>


        {/* Category Sections */}
        <div className="space-y-12">

          {Object.entries(groupedExams).map(([cat, list]) => (

            list.length > 0 && (

              <div key={cat}>

                <h2 className="category-heading">

                  {cat === "basic"
                    ? "Basic Exams"
                    : cat === "pre-grad"
                    ? "Pre-Graduate Exams"
                    : "Post-Graduate Exams"}

                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">

                  {list.map(exam => (

                    <div key={exam.id} className="exam-card">

                      <div className="flex items-center gap-3 mb-2">

                        <span className="material-symbols-outlined text-primary text-xl">
                          {exam.icon}
                        </span>

                        <h3 className="font-bold text-lg">
                          {exam.type}
                        </h3>

                      </div>

                      <p className="text-sm text-slate-500">
                        {exam.exams.join(", ")}
                      </p>

                    </div>

                  ))}

                </div>

              </div>

            )

          ))}

        </div>

      </div>


      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">

          <div className="modal-card">

            <h2 className="text-xl font-bold mb-6">
              Add New Exam
            </h2>

            <div className="space-y-4">

              <input
                placeholder="Exam Type"
                value={examType}
                onChange={e => setExamType(e.target.value)}
                className="glass-input"
              />

              <input
                placeholder="Material Icon"
                value={icon}
                onChange={e => setIcon(e.target.value)}
                className="glass-input"
              />

              <input
                placeholder="Exam Names (comma separated)"
                value={examNames}
                onChange={e => setExamNames(e.target.value)}
                className="glass-input"
              />

              {/* Category */}
              <div>
                <p className="modal-section-label">
                  Choose Category
                </p>

                <div className="grid grid-cols-3 gap-3 mt-3">
                  {[
                    { value: "basic", label: "Basic" },
                    { value: "pre-grad", label: "Pre-Grad" },
                    { value: "post-grad", label: "Post-Grad" }
                  ].map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setCategory(c.value)}
                      className={`glass-chip ${category === c.value ? "active" : ""}`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subjects */}
              <div className="grid grid-cols-3 gap-3 pr-2">
                {subjects.map(sub => (
                  <label
                    key={sub.id}
                    className={`subject-pill
                      ${selectedSubjects.includes(sub.id) ? "active" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(sub.id)}
                      onChange={() => {
                        setSelectedSubjects(prev =>
                          prev.includes(sub.id)
                            ? prev.filter(s => s !== sub.id)
                            : [...prev, sub.id]
                        );
                      }}
                    />
                    <span className="material-symbols-outlined text-sm">
                      {sub.icon}
                    </span>
                    <span className="text-sm font-medium">
                      {sub.name}
                    </span>
                  </label>
                ))}
              </div>

            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="secondary-btn"
              >
                Cancel
              </button>

              <button
                onClick={addExam}
                className="primary-glass-btn"
              >
                Add Exam
              </button>
            </div>

          </div>
        </div>
      )}


      {/* ================= SNACKBAR ================= */}
      {snackbar.open && (
        <div className={`snackbar ${snackbar.type}`}>
          <span className="material-symbols-outlined">
            {snackbar.type === "success" ? "check_circle" : "error"}
          </span>
          {snackbar.message}
        </div>
      )}


      {/* ================= STYLES ================= */}
      <style jsx>{`

        .exams-page {
          min-height:100vh;
          background:
            linear-gradient(135deg,#f8fafc,#e2e8f0);
        }

        .exam-card {
          padding:22px;
          border-radius:22px;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(14px);
          box-shadow:
            0 10px 28px rgba(0,0,0,0.08);
          transition: all .2s ease;
        }

        .exam-card:hover {
          transform: translateY(-3px);
        }

        .category-heading {
          font-size:20px;
          font-weight:800;
          color:#1e293b;
        }

        .glass-input {
          width:100%;
          padding:13px 14px;
          border-radius:14px;
          border:1px solid rgba(0,0,0,0.06);
          background: rgba(255,255,255,0.85);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
        }

        .glass-chip {
          padding:10px;
          border-radius:16px;
          border:1px solid rgba(0,0,0,0.06);
          background: rgba(255,255,255,0.7);
          font-weight:600;
        }

        .glass-chip.active {
          background: linear-gradient(135deg,#4f46e5,#6366f1);
          color:white;
        }

        .subject-pill {
          display:flex;
          align-items:center;
          gap:8px;
          padding:10px;
          border-radius:16px;
          border:1px solid rgba(0,0,0,0.06);
          background: rgba(255,255,255,0.7);
        }

        .subject-pill.active {
          border-color:#6366f1;
          background: rgba(99,102,241,0.15);
        }

        .primary-glass-btn {
          padding:12px 24px;
          border-radius:18px;
          border:none;
          background: linear-gradient(135deg,#4f46e5,#6366f1);
          color:white;
          font-weight:700;
          box-shadow: 0 10px 22px rgba(79,70,229,0.35);
        }

        .secondary-btn {
          padding:12px 22px;
          border-radius:18px;
          border:1px solid rgba(0,0,0,0.1);
          background:white;
          font-weight:600;
        }

        .modal-overlay {
          position:fixed;
          inset:0;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(6px);
          display:flex;
          justify-content:center;
          align-items:center;
          z-index:100;
        }

        .modal-card {
          width: 720px;
          max-height: 85vh;
          overflow-y: auto;
          padding: 34px;
          border-radius: 28px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(25px);
          box-shadow:
            0 25px 80px rgba(0,0,0,0.25);
        }

        .modal-card::-webkit-scrollbar {
          width: 6px;
        }

        .modal-card::-webkit-scrollbar-thumb {
          background: rgba(99,102,241,0.4);
          border-radius: 999px;
        }

        .modal-section-label {
          font-size: 13px;
          font-weight: 700;
          color: #334155;
        }

        .snackbar {
          position: fixed;
          bottom: 30px;
          right: 30px;
          padding: 14px 22px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          backdrop-filter: blur(20px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.25);
          z-index: 1000;   /* 🔥 important */
        }

        .snackbar.success {
          background: rgba(220,252,231,0.9);
          color: #15803d;
        }

        .snackbar.error {
          background: rgba(254,226,226,0.9);
          color: #b91c1c;
        }

      `}</style>

    </div>
  );
}
