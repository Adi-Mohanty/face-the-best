import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { db } from "./firebase";

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function calculateDistribution(count, config) {
  const raw = {
    easy: (config.easy / 100) * count,
    medium: (config.medium / 100) * count,
    hard: (config.hard / 100) * count
  };

  const result = {
    easy: Math.floor(raw.easy),
    medium: Math.floor(raw.medium),
    hard: Math.floor(raw.hard)
  };

  let allocated =
    result.easy + result.medium + result.hard;

  let remainder = count - allocated;

  const order = ["easy", "medium", "hard"].sort(
    (a, b) => config[b] - config[a]
  );

  let i = 0;
  while (remainder > 0) {
    result[order[i % 3]]++;
    remainder--;
    i++;
  }

  return result;
}

export async function fetchQuestions(
  exam,
  subject,
  subjectId,
  subjectConfig,
  count = 10
) {
  const q = query(
    collection(db, "questions"),
    where("exam", "==", exam),
    where("subject", "==", subject),
    where("isActive", "==", true)
  );

  const snap = await getDocs(q);
  const all = snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));

  if (all.length < count) {
    return [];
  }

  const config =
    subjectConfig?.[subjectId] || {
      easy: 30,
      medium: 40,
      hard: 30
    };

  const required = calculateDistribution(count, config);

  const easyPool = shuffle(
    all.filter(q => q.difficulty === "Easy")
  );

  const mediumPool = shuffle(
    all.filter(q => q.difficulty === "Medium")
  );

  const hardPool = shuffle(
    all.filter(q => q.difficulty === "Hard")
  );

  let selected = [];

  const take = (pool, n) => {
    const taken = pool.slice(0, n);
    pool.splice(0, n);
    return taken;
  };

  selected = [
    ...take(easyPool, required.easy),
    ...take(mediumPool, required.medium),
    ...take(hardPool, required.hard)
  ];

  if (selected.length < count) {
    const remainingPools = shuffle([
      ...easyPool,
      ...mediumPool,
      ...hardPool
    ]);

    const needed = count - selected.length;

    selected = [
      ...selected,
      ...remainingPools.slice(0, needed)
    ];
  }

  if (selected.length < count) {
    return [];
  }

  return shuffle(selected);
}