import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../services/firebase";

export default function AdminSubjects() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success" // success | error
  });

  const showSnackbar = (message, type = "success") => {
    setSnackbar({ open: true, message, type });
  
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, open: false }));
    }, 3000);
  };  

  const fetchSubjects = async () => {
    const snap = await getDocs(collection(db, "subjects"));
    setSubjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }; 

  useEffect(() => {
    fetchSubjects();
  }, []);

  const addSubject = async () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const trimmedIcon = icon.trim();
  
    // Basic empty validation
    if (!trimmedName || !trimmedDescription || !trimmedIcon) {
      showSnackbar("Fields cannot contain only empty spaces", "error");
      return;
    }
  
    // Minimum length validation
    if (trimmedName.length < 3) {
      showSnackbar("Subject name must be at least 3 characters", "error");
      return;
    }
  
    if (trimmedDescription.length < 5) {
      showSnackbar("Description must be at least 5 characters", "error");
      return;
    }
  
    // Optional: prevent numeric-only names
    if (/^\d+$/.test(trimmedName)) {
      showSnackbar("Subject name cannot be only numbers", "error");
      return;
    }
  
    try {
      await addDoc(collection(db, "subjects"), {
        name: trimmedName,
        description: trimmedDescription,
        icon: trimmedIcon,
        isActive: true,
        createdAt: serverTimestamp()
      });
  
      setName("");
      setDescription("");
      setIcon("");
      setShowModal(false);
  
      showSnackbar("Subject added successfully");
  
      fetchSubjects();
  
    } catch (err) {
      showSnackbar("Failed to add subject", "error");
    }
  };
  

  return (
    <div className="subjects-page">

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-slate-800">
            Manage Subjects
          </h1>

          <button
            onClick={() => setShowModal(true)}
            className="primary-glass-btn flex items-center gap-2"
          >
            <span className="material-symbols-outlined">
              add
            </span>
            Add Subject
          </button>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {subjects.map(sub => (
            <div key={sub.id} className="subject-card">

              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-primary text-2xl">
                  {sub.icon}
                </span>

                <h3 className="font-bold text-lg">
                  {sub.name}
                </h3>
              </div>

              <p className="text-sm text-slate-500">
                {sub.description}
              </p>

            </div>
          ))}

        </div>

      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">

          <div className="modal-card">

            <h2 className="text-xl font-bold mb-6">
              Add New Subject
            </h2>

            <div className="space-y-4">

              <input
                placeholder="Subject Name"
                value={name}
                onChange={e => setName(e.target.value.replace(/^\s+/, ""))}
                className="glass-input"
              />

              <input
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value.replace(/^\s+/, ""))}
                className="glass-input"
              />

              <input
                placeholder="Material Icon"
                value={icon}
                onChange={e => setIcon(e.target.value.replace(/^\s+/, ""))}
                className="glass-input"
              />

            </div>

            <div className="flex justify-end gap-4 mt-8">

              <button
                onClick={() => setShowModal(false)}
                className="secondary-btn"
              >
                Cancel
              </button>

              <button
                onClick={addSubject}
                className="primary-glass-btn"
              >
                Add Subject
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
        /* PAGE BACKGROUND */
        .subjects-page {
          min-height:100vh;
          background:
            linear-gradient(135deg,#f8fafc,#e2e8f0);
        }

        /* SUBJECT CARD */
        .subject-card {
          padding:22px;
          border-radius:22px;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(14px);
          box-shadow:
            0 10px 28px rgba(0,0,0,0.08);
          transition: all .2s ease;
        }

        .subject-card:hover {
          transform: translateY(-3px);
        }

        /* GLASS INPUT */
        .glass-input {
          width:100%;
          padding:13px 14px;
          border-radius:14px;
          border:1px solid rgba(0,0,0,0.06);
          background: rgba(255,255,255,0.85);
          box-shadow:
            inset 0 2px 4px rgba(0,0,0,0.05);
          transition: all .2s ease;
        }

        .glass-input:focus {
          outline:none;
          border-color:#6366f1;
          box-shadow:
            0 0 0 3px rgba(99,102,241,0.15);
        }

        /* PRIMARY BUTTON */
        .primary-glass-btn {
          padding:12px 24px;
          border-radius:18px;
          border:none;
          background: linear-gradient(135deg,#4f46e5,#6366f1);
          color:white;
          font-weight:700;
          box-shadow: 0 10px 22px rgba(79,70,229,0.35);
          transition: all .2s ease;
        }

        .primary-glass-btn:hover {
          transform: translateY(-2px);
        }

        /* SECONDARY BUTTON */
        .secondary-btn {
          padding:12px 22px;
          border-radius:18px;
          border:1px solid rgba(0,0,0,0.1);
          background:white;
          font-weight:600;
        }

        /* MODAL */
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
          width:420px;
          padding:30px;
          border-radius:28px;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(25px);
          box-shadow:
            0 20px 60px rgba(0,0,0,0.25);
        }

        /* SNACKBAR */
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
          font-size: 14px;
          backdrop-filter: blur(20px);
          animation: slideIn 0.3s ease;
          z-index: 200;
          box-shadow: 0 15px 40px rgba(0,0,0,0.25);
        }

        .snackbar.success {
          background: rgba(220,252,231,0.9);
          color: #15803d;
        }

        .snackbar.error {
          background: rgba(254,226,226,0.9);
          color: #b91c1c;
        }

        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

    </div>
  );
}
