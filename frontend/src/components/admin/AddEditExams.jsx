import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../../services/firebase";

export default function AddEditExams({
  open,
  onClose,
  subjects,
  editData,
  onSuccess
}) {

  const isEdit = !!editData;

  const [examType, setExamType] = useState("");
  const [icon, setIcon] = useState("");
  const [examNames, setExamNames] = useState("");
  const [category, setCategory] = useState("");
  const [subjectConfig, setSubjectConfig] = useState({});
  const [openAccordions, setOpenAccordions] = useState({});

  const resetForm = () => {
    setExamType("");
    setIcon("");
    setExamNames("");
    setCategory("");
    setSubjectConfig({});
  };

  // Pre-fill when editing
  useEffect(() => {
    if (!open) return;

    setOpenAccordions({});
  
    if (editData) {
      setExamType(editData.type);
      setIcon(editData.icon);
      setExamNames(editData.exams.join(", "));
      setCategory(editData.category);
  
      if (editData.subjectConfig) {
        setSubjectConfig(editData.subjectConfig);
      } else if (editData.subjects) {
        const converted = {};
        editData.subjects.forEach(id => {
          converted[id] = {
            easy: 30,
            medium: 40,
            hard: 30
          };
        });
        setSubjectConfig(converted);
      } else {
        setSubjectConfig({});
      }
  
    } else {
      // 🔥 Add Mode
      resetForm();
    }
  }, [editData, open]);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  if (!open) return null;

  const handleSave = async () => {
    if (!examType || !icon || !examNames || !category) return;

    for (let subjectId in subjectConfig) {
        const { easy, medium, hard } = subjectConfig[subjectId];
        if (easy + medium + hard !== 100) {
          alert("Difficulty percentages must total 100%");
          return;
        }
    }

    const payload = {
      type: examType.trim(),
      icon: icon.trim(),
      category,
      exams: examNames.split(",").map(e => e.trim()),
      subjectConfig,
      updatedAt: serverTimestamp()
    };

    try {
      if (isEdit) {
        await updateDoc(doc(db, "exams", editData.id), payload);
      } else {
        await addDoc(collection(db, "exams"), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }

      onSuccess();
      onClose();

    } catch (err) {
      console.error(err);
    }
  };

  const toggleSubject = (id) => {
    setSubjectConfig(prev => {
      if (prev[id]) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return {
        ...prev,
        [id]: {
          easy: 30,
          medium: 40,
          hard: 30
        }
      };
    });
  };

  const toggleAccordion = (id) => {
    setOpenAccordions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const updateDifficulty = (id, level, value) => {
    setSubjectConfig(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [level]: Number(value)
      }
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        <h2 className="text-xl font-bold mb-6">
          {isEdit ? "Edit Exam" : "Add New Exam"}
        </h2>

        <div className="modal-scroll-content space-y-4">

          <input
            value={examType}
            onChange={e => setExamType(e.target.value)}
            placeholder="Exam Type"
            className="glass-input"
          />

          <input
            value={icon}
            onChange={e => setIcon(e.target.value)}
            placeholder="Material Icon"
            className="glass-input"
          />

          <input
            value={examNames}
            onChange={e => setExamNames(e.target.value)}
            placeholder="Exam Names (comma separated)"
            className="glass-input"
          />

          {/* CATEGORY */}
          <div>
            <p className="modal-section-label">Choose Category</p>

            <div className="grid grid-cols-3 gap-3 mt-3">
              {["basic","pre-grad","post-grad"].map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`glass-chip ${category === c ? "active" : ""}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* SUBJECT CONFIGURATION */}
          {/* <div>
            <p className="modal-section-label mb-3">
              Subjects & Difficulty Distribution
            </p>

            <div className="space-y-4">

              {subjects.map(sub => {

                const active = subjectConfig[sub.id];

                return (
                  <div key={sub.id} className="subject-config-card">

                    <div
                      onClick={() => toggleSubject(sub.id)}
                      className={`subject-header ${active ? "active" : ""}`}
                    >
                      <span>{sub.name}</span>
                    </div>

                    {active && (
                      <div className="difficulty-grid">

                        {["easy","medium","hard"].map(level => (
                          <div key={level} className="difficulty-row">
                            <label>
                              {level.charAt(0).toUpperCase() + level.slice(1)} %
                            </label>
                            <input
                              type="number"
                              value={active[level]}
                              onChange={e =>
                                updateDifficulty(sub.id, level, e.target.value)
                              }
                            />
                          </div>
                        ))}

                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          </div> */}


          {/* SUBJECT CONFIGURATION */}
            <div>
                <p className="modal-section-label mb-3">
                    Subjects & Difficulty Distribution
                </p>

                <div className="grid grid-cols-3 gap-3 pr-2">
                    {subjects.map(sub => {
                        const active = subjectConfig[sub.id];

                        return (
                            <div key={sub.id} className="subject-wrapper">

                            {/* SUBJECT PILL */}
                            <div className={`subject-pill ${active ? "active" : ""}`}>
                          
                              {/* LEFT SIDE — Selection */}
                              <div
                                className="subject-left"
                                onClick={() => toggleSubject(sub.id)}
                              >
                                <span className="material-symbols-outlined text-sm">
                                  {sub.icon}
                                </span>
                          
                                <span className="text-sm font-medium">
                                  {sub.name}
                                </span>
                              </div>
                          
                              {/* RIGHT SIDE — Dropdown Button */}
                              {active && (
                                <button
                                  type="button"
                                  className="accordion-toggle"
                                  onClick={() => toggleAccordion(sub.id)}
                                >
                                  <span className="material-symbols-outlined">
                                    {openAccordions[sub.id] ? "expand_less" : "expand_more"}
                                  </span>
                                </button>
                              )}
                          
                            </div>
                          
                            {/* ACCORDION */}
                            <div className={`subject-accordion ${openAccordions[sub.id] ? "open" : ""}`}>
                          
                              {active && openAccordions[sub.id] && (
                                <div className="difficulty-grid">
                                  {["easy","medium","hard"].map(level => (
                                    <div key={level} className="difficulty-row">
                                      <label>
                                        {level.charAt(0).toUpperCase() + level.slice(1)} %
                                      </label>
                          
                                      <input
                                        type="number"
                                        value={active[level]}
                                        onChange={e =>
                                          updateDifficulty(sub.id, level, e.target.value)
                                        }
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                          
                            </div>
                          
                          </div> 
                        );
                    })}

                </div>
            </div>

        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button onClick={onClose} className="secondary-btn">
            Cancel
          </button>

          <button onClick={handleSave} className="primary-glass-btn">
            {isEdit ? "Update Exam" : "Add Exam"}
          </button>
        </div>

      </div>
    </div>
  );
}