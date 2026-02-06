import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";

export default function AdminExams() {
  const [examType, setExamType] = useState("");
  const [icon, setIcon] = useState("");
  const [examNames, setExamNames] = useState("");
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const fetchExams = async () => {
    const snap = await getDocs(collection(db, "exams"));
    setExams(
      snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    );
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
    if (!examType || !icon || !examNames) return;

    await addDoc(collection(db, "exams"), {
      type: examType,
      icon,
      exams: examNames.split(",").map(e => e.trim()),
      subjects: selectedSubjects,
      createdAt: serverTimestamp()
    });

    setExamType("");
    setIcon("");
    setExamNames("");
    setSelectedSubjects([]);
    fetchExams();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">

      <h1 className="text-3xl font-black mb-6">Manage Exams</h1>

      {/* Add Exam */}
      <div className="bg-white p-6 rounded-xl border mb-8 space-y-4">
        <input
          placeholder="Exam Type (e.g. Banking)"
          value={examType}
          onChange={e => setExamType(e.target.value)}
          className="w-full border p-3 rounded"
        />
        <input
          placeholder="Material Icon (e.g. account_balance)"
          value={icon}
          onChange={e => setIcon(e.target.value)}
          className="w-full border p-3 rounded"
        />
        <input
          placeholder="Exam Names (comma separated)"
          value={examNames}
          onChange={e => setExamNames(e.target.value)}
          className="w-full border p-3 rounded"
        />
        <div>
            <label className="block mb-2 font-semibold">Subjects</label>

            <div className="grid grid-cols-2 gap-3">
                {subjects.map(sub => (
                <label
                    key={sub.id}
                    className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer
                    ${
                        selectedSubjects.includes(sub.id)
                        ? "border-primary bg-primary/5"
                        : "border-gray-200"
                    }
                    `}
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
                    <span className="text-sm font-medium">{sub.name}</span>
                </label>
                ))}
            </div>
        </div>


        <button
          onClick={addExam}
          className="bg-primary text-white px-6 py-3 rounded font-bold"
        >
          Add Exam
        </button>
      </div>

      {/* List Exams */}
      <div className="space-y-4">
        {exams.map(exam => (
          <div key={exam.id} className="border rounded-xl p-5">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined">
                {exam.icon}
              </span>
              {exam.type}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {exam.exams.join(", ")}
            </p>

            {/* Subject management comes next */}
          </div>
        ))}
      </div>
    </div>
  );
}
