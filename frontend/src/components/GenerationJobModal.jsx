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

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 w-[440px] rounded-2xl p-6 relative">

        {/* Close */}
        <button
          disabled={isRunning}
          onClick={onClose}
          className={`absolute top-4 right-4 text-xl ${
            isRunning
              ? "opacity-30 cursor-not-allowed"
              : "hover:text-red-500"
          }`}
        >
          ✕
        </button>

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