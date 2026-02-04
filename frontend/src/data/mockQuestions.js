export const mockQuestions = [
  /* ---------------- MCQ ---------------- */
  {
    id: 1,
    type: "MCQ",
    question: "What is the capital of India?",
    options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
    correctOption: 1,
    explanation: "Delhi is the capital of India.",
    difficulty: "Easy",
    subject: "Geography"
  },

  {
    id: 2,
    type: "MCQ",
    question: "2 + 2 = ?",
    options: ["3", "4", "5", "6"],
    correctOption: 1,
    explanation: "2 + 2 equals 4.",
    difficulty: "Easy",
    subject: "Quantitative Aptitude"
  },

  {
    id: 3,
    type: "MCQ",
    question:
      "How many Fundamental Rights are guaranteed by the Indian Constitution?",
    options: ["5", "6", "7", "8"],
    correctOption: 1,
    explanation:
      "There are 6 Fundamental Rights currently guaranteed.",
    difficulty: "Easy",
    subject: "Indian Polity"
  },  

  /* ---------------- STATEMENT TYPE ---------------- */
  {
    id: 4,
    type: "STATEMENT",
    question:
      "With reference to the Constitution of India, consider the following statements regarding the 'Doctrine of Pleasure':",
    statements: [
      "In India, the 'Doctrine of Pleasure' is subject to constitutional limitations.",
      "Article 311 of the Constitution provides safeguards to civil servants against arbitrary dismissal.",
      "The doctrine applies only to the civil services of the Union and not to the States."
    ],
    options: [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only",
      "1, 2 and 3"
    ],
    correctOption: 0,
    explanation:
      "Statements 1 and 2 are correct. Statement 3 is incorrect because the doctrine applies to both Union and States.",
    difficulty: "Medium",
    subject: "Indian Polity"
  },

  /* ---------------- ASSERTION–REASON ---------------- */
  {
    id: 5,
    type: "ASSERTION_REASON",
    assertion: "The President of India can be removed from office before the expiry of his term.",
    reason: "The Constitution of India provides for impeachment of the President.",
    options: [
      "Both A and R are true and R is the correct explanation of A",
      "Both A and R are true but R is not the correct explanation of A",
      "A is true but R is false",
      "A is false but R is true"
    ],
    correctOption: 0,
    explanation:
      "Both statements are true and the reason correctly explains the assertion.",
    difficulty: "Medium",
    subject: "Indian Polity"
  },

  /* ---------------- PASSAGE BASED (FUTURE READY) ---------------- */
  {
    id: 6,
    type: "PASSAGE",
    passage:
      "The Reserve Bank of India (RBI) is India's central bank, responsible for regulating the issue and supply of the Indian rupee and controlling monetary policy.",
    question:
      "Which of the following functions is performed by the Reserve Bank of India?",
    options: [
      "Formulation of fiscal policy",
      "Regulation of monetary policy",
      "Collection of direct taxes",
      "Preparation of Union Budget"
    ],
    correctOption: 1,
    explanation:
      "RBI is responsible for monetary policy, not fiscal policy or taxation.",
    difficulty: "Easy",
    subject: "Indian Economy"
  }
];
