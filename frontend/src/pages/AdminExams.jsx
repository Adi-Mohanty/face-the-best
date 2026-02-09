import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";

export default function AdminExams() {
  const [examType, setExamType] = useState("");
  const [icon, setIcon] = useState("");
  const [examNames, setExamNames] = useState("");
  const [exams, setExams] = useState([]);
  const [category, setCategory] = useState("");

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
    if (!examType || !icon || !examNames || !category) return;
  
    await addDoc(collection(db, "exams"), {
      type: examType,
      icon,
      category,
      exams: examNames.split(",").map(e => e.trim()),
      subjects: selectedSubjects,
      createdAt: serverTimestamp()
    });
  
    setExamType("");
    setIcon("");
    setExamNames("");
    setCategory("");
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

        {/* Exam Category */}
        <div>
          <label className="block mb-2 font-semibold">
            Exam Category
          </label>

          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "basic", label: "Basic" },
              { value: "pre-grad", label: "Pre-Graduate" },
              { value: "post-grad", label: "Post-Graduate" }
            ].map(c => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                className={`py-3 rounded-lg text-sm font-semibold transition
                  ${
                    category === c.value
                      ? "bg-primary/10 border-2 border-primary text-primary"
                      : "border border-gray-200 hover:border-primary/50"
                  }
                `}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

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

              <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase
                ${
                  exam.category === "basic"
                    ? "bg-gray-100 text-gray-700"
                    : exam.category === "pre-grad"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {exam.category}
              </span>
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
