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

  const fetchSubjects = async () => {
    const snap = await getDocs(collection(db, "subjects"));
    setSubjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const addSubject = async () => {
    if (!name || !description || !icon) return;

    await addDoc(collection(db, "subjects"), {
      name,
      description,
      icon,
      isActive: true,
      createdAt: serverTimestamp()
    });

    setName("");
    setDescription("");
    setIcon("");
    fetchSubjects();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-black mb-6">Manage Subjects</h1>

      {/* Add Subject */}
      <div className="bg-white p-6 rounded-xl border mb-8 space-y-4">
        <input
          placeholder="Subject Name (e.g. Reasoning)"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border p-3 rounded"
        />
        <input
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full border p-3 rounded"
        />
        <input
          placeholder="Material Icon (e.g. psychology)"
          value={icon}
          onChange={e => setIcon(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <button
          onClick={addSubject}
          className="bg-primary text-white px-6 py-3 rounded font-bold"
        >
          Add Subject
        </button>
      </div>

      {/* Subject List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map(sub => (
          <div
            key={sub.id}
            className="border rounded-xl p-4 flex gap-3 items-start"
          >
            <span className="material-symbols-outlined text-primary">
              {sub.icon}
            </span>
            <div>
              <h3 className="font-bold">{sub.name}</h3>
              <p className="text-sm text-gray-500">{sub.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}