import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function GenerationJobModal({ job, onClose }) {
  const navigate = useNavigate();

  const progress = useMemo(() => {
    if (!job?.batchesTotal) return 0;
    return Math.round(
      (job.batchesCompleted / job.batchesTotal) * 100
    );
  }, [job]);

  const isRunning = job.status === "RUNNING";
  const isCompleted = job.status === "COMPLETED";
  const isFailed = job.status === "FAILED";

  function Meta({ label, value }) {
    return (
      <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {value || "—"}
        </span>
      </div>
    );
  }  

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 w-[440px] rounded-2xl p-6 relative">

        {/* Close */}
        {/* <button
          disabled={isRunning}
          onClick={onClose}
          className={`absolute top-1 right-2 text-xl ${
            isRunning
              ? "opacity-30 cursor-not-allowed"
              : "hover:text-red-500"
          }`}
        >
          ✕
        </button> */}

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Question Generation</h3>
          <span
            className={`px-3 py-1 text-xs rounded-full font-bold
            ${
              isRunning
                ? "bg-blue-100 text-blue-700"
                : isCompleted
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {job.status}
          </span>
        </div>

        {/* Job meta */}
        <div className="mt-3 mb-4 grid grid-cols-2 gap-2 text-xs">
          <Meta label="Exam" value={job.exam} />
          <Meta label="Subject" value={job.subject} />
          <Meta label="Type" value={job.type} />
          <Meta label="Difficulty" value={job.difficulty} />
          <Meta label="Requested" value={`${job.totalQuestions} Qs`} />
          <Meta
            label="Started"
            value={job.createdAt?.toDate().toLocaleTimeString()}
          />
        </div>

        {job.difficultyDowngraded && (
          <div className="mb-4 text-xs bg-yellow-50 text-yellow-700 px-3 py-2 rounded-lg">
            ⚠ Difficulty auto-adjusted to ensure completion
          </div>
        )}

        {/* Circular Progress */}
        <div className="flex justify-center my-6">
          <div className="relative w-32 h-32 rounded-full border-4 border-primary/30 overflow-hidden">
            <div
              className="absolute bottom-0 w-full bg-primary transition-all duration-700"
              style={{ height: `${progress}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center font-black text-xl">
              {progress}%
            </div>
          </div>
        </div>

        {/* Batch info */}
        <div className="text-center text-xs text-gray-500 mb-4">
          Batch {job.batchesCompleted} of {job.batchesTotal}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 text-center gap-4 text-sm">
          <div>
            <p className="font-bold">{job.generated}</p>
            <p className="text-gray-500">Generated</p>
          </div>
          <div>
            <p className="font-bold text-green-600">{job.approved}</p>
            <p className="text-gray-500">Approved</p>
          </div>
          <div>
            <p className="font-bold text-red-600">{job.rejected}</p>
            <p className="text-gray-500">Rejected</p>
          </div>
        </div>

        {job.status === "PARTIAL" && (
          <div className="mt-4 bg-orange-50 text-orange-700 p-3 rounded-lg text-xs">
            ⚠ Job completed partially due to model constraints
          </div>
        )}

        {/* Failure reason */}
        {isFailed && job.errorReason && (
          <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-lg text-xs">
            ❌ {job.errorReason}
          </div>
        )}

        {/* Completion actions */}
        {isCompleted && (
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => navigate("/admin/questions")}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold"
            >
              Review Generated Questions
            </button>

            <button
              onClick={onClose}
              className="w-full border py-2 rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        )}

        {/* Running hint */}
        {isRunning && (
          <p className="mt-6 text-xs text-center text-gray-500">
            Please keep this window open while generation is running.
          </p>
        )}
      </div>
    </div>
  );
}