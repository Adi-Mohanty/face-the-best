import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function GenerationJobModal({ job, onClose }) {
  const navigate = useNavigate();

  // const progress = useMemo(() => {
  //   if (!job?.batchesTotal) return 0;
  //   return Math.round(
  //     (job.batchesCompleted / job.batchesTotal) * 100
  //   );
  // }, [job]);


  const progress = useMemo(() => {
    if (!job?.totalQuestions) return 0;
    return Math.round(
      (job.approved / job.totalQuestions) * 100
    );
  }, [job]);


  const isRunning = job.status === "RUNNING";
  const isCompleted = job.status === "COMPLETED";
  const isFailed = job.status === "FAILED";

  function Meta({ label, value }) {
    return (
      <div className="meta-tile">
        <span>{label}</span>
        <strong>{value || "—"}</strong>
      </div>
    );
  }

  return (
    <div className="modal-overlay">

      <div className="modal-card">

        {/* Close */}
        <button
          disabled={isRunning}
          onClick={onClose}
          className={`close-btn ${isRunning ? "disabled" : ""}`}
        >
          ✕
        </button>

        {/* Header */}
        <div className="modal-header">
          <h3>Question Generation</h3>

          <span className={`status-badge ${job.status.toLowerCase()}`}>
            {job.status}
          </span>
        </div>

        {/* Meta Info */}
        <div className="meta-grid">
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

        {/* ================= WATER PROGRESS ================= */}
        <div className="progress-wrapper">
          <div className="water-circle">
            <div
              className="water"
              style={{ height: `${progress}%` }}
            >
              <div className="wave wave1" />
              <div className="wave wave2" />
            </div>

            <div className="progress-text">
              {progress}%
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div>
            <p>{job.generated}</p>
            <span>Generated</span>
          </div>
          <div>
            <p className="green">{job.approved}</p>
            <span>Approved</span>
          </div>
          <div>
            <p className="red">{job.rejected}</p>
            <span>Rejected</span>
          </div>
        </div>

        {job.status === "PARTIAL" && (
          <div className="mt-4 bg-orange-50 text-orange-700 p-3 rounded-lg text-xs">
            ⚠ Job completed partially due to model constraints
          </div>
        )}

        {/* Failure reason */}
        {isFailed && job.errorReason && (
          <div className="failure-box">
            <span className="material-symbols-outlined">
              error
            </span>
            <p>{job.errorReason}</p>
          </div>
        )}

        {isCompleted && (
          <div className="actions">
            <button
              onClick={() => {
                job.onReview?.(job.id);
                onClose();
              }}
              className="primary-btn"
            >
              Review Questions
            </button>

            <button
              onClick={onClose}
              className="secondary-btn"
            >
              Close
            </button>
          </div>
        )}

        {isRunning && (
          <p className="hint">
            Please keep this window open while generation is running.
          </p>
        )}

      </div>

      {/* ================= STYLES ================= */}
      <style jsx>{`
        /* ================= Overlay ================= */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(8px);
          display:flex;
          justify-content:center;
          align-items:center;
          z-index:1000;
        }

        /* ================= Modal ================= */
        .modal-card {
          width: 540px;
          padding: 36px;
          border-radius: 32px;

          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(30px);

          box-shadow:
            0 30px 80px rgba(0,0,0,0.25),
            inset 0 1px 0 rgba(255,255,255,0.6);

          position: relative;
        }

        /* ================= Close ================= */
        .close-btn {
          position:absolute;
          top:18px;
          right:22px;
          font-size:18px;
          background:none;
          border:none;
          cursor:pointer;
          transition:.2s;
        }

        .close-btn:hover { color:#ef4444; }
        .close-btn.disabled { opacity:.3; cursor:not-allowed; }

        /* ================= Header ================= */
        .modal-header {
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:24px;
        }

        .modal-header h3 {
          font-size:22px;
          font-weight:900;
        }

        /* ================= Status Badges ================= */
        .status-badge {
          padding:6px 14px;
          border-radius:999px;
          font-size:11px;
          font-weight:800;
          letter-spacing:.5px;
        }

        .status-badge.running {
          background:rgba(59,130,246,0.15);
          color:#2563eb;
        }

        .status-badge.completed {
          background:rgba(16,185,129,0.15);
          color:#059669;
        }

        .status-badge.failed {
          background:rgba(239,68,68,0.15);
          color:#dc2626;
        }

        .status-badge.partial {
          background:rgba(234,179,8,0.18);
          color:#b45309;
        }

        /* ================= Meta ================= */
        .meta-grid {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:12px;
          margin-bottom:30px;
        }

        .meta-tile {
          background:rgba(255,255,255,0.6);
          padding:12px 16px;
          border-radius:16px;
          font-size:12px;
          display:flex;
          justify-content:space-between;
          backdrop-filter: blur(10px);

          box-shadow:
            inset 0 2px 6px rgba(0,0,0,0.05),
            0 4px 12px rgba(0,0,0,0.05);
        }

        /* ================= Progress Wrapper ================= */
        .progress-wrapper {
          display:flex;
          justify-content:center;
          margin:35px 0 20px;
        }

        /* ================= Water Circle ================= */
        .water-circle {
          width:170px;
          height:170px;
          border-radius:50%;
          position:relative;
          overflow:hidden;

          background:rgba(255,255,255,0.4);

          box-shadow:
            inset 0 8px 18px rgba(0,0,0,0.12),
            0 12px 28px rgba(0,0,0,0.15);
        }

        /* ================= Water Fill ================= */
        .water {
          position:absolute;
          bottom:0;
          width:100%;
          background:linear-gradient(180deg,#6366f1,#4f46e5);
          transition: height 0.8s ease;
          overflow:hidden;
        }

        /* ================= Waves (Surface Attached) ================= */
        .wave {
          position:absolute;
          top:-18px;
          left:0;
          width:200%;
          height:36px;
          background:rgba(255,255,255,0.35);
          border-radius:40%;
          animation: waveMove 5s linear infinite;
        }

        .wave2 {
          opacity:.4;
          animation-duration:7s;
        }

        @keyframes waveMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* ================= Percentage Text ================= */
        .progress-text {
          position:absolute;
          inset:0;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:28px;
          font-weight:900;
          color:#1e293b;
          text-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }

        /* ================= Batch Text ================= */
        .batch-text {
          text-align:center;
          font-size:13px;
          font-weight:600;
          color:#64748b;
          margin-bottom:15px;
        }

        /* ================= Stats ================= */
        .stats-row {
          display:flex;
          justify-content:space-between;
          text-align:center;
          margin-top:5px;
        }

        .stats-row p {
          font-weight:900;
          font-size:22px;
        }

        .stats-row span {
          font-size:12px;
          color:#64748b;
        }

        .green { color:#16a34a; }
        .red { color:#dc2626; }

        /* ================= Skeuomorphic Buttons ================= */
        .actions {
          margin-top:20px;
          display:flex;
          justify-content: space-between;
          gap:12px;
        }

        .primary-btn,
        .secondary-btn {
          flex: 1;
          padding:12px;
          border-radius:12px;
          border:none;
          font-weight:800;
          transition:all .2s ease;
        }

        .primary-btn {
          flex:1;

          background:linear-gradient(145deg,#4f46e5,#4338ca);
          color:white;

          box-shadow:
            0 12px 30px rgba(79,70,229,0.4),
            inset 0 1px 0 rgba(255,255,255,0.3);
        }

        .secondary-btn {
          flex:1;

          border:1px solid rgba(0,0,0,0.1);
          background:linear-gradient(145deg,#ffffff,#f1f5f9);

          box-shadow:
            6px 6px 14px rgba(0,0,0,0.08),
            -4px -4px 12px rgba(255,255,255,0.8);
        }

        .primary-btn:hover {
          transform:translateY(-2px);
          box-shadow:
            0 16px 36px rgba(79,70,229,0.45);
        }

        .primary-btn:active {
          transform:translateY(0);
          box-shadow:
            inset 0 6px 12px rgba(0,0,0,0.25);
        }

        .secondary-btn:active {
          box-shadow:
            inset 4px 4px 8px rgba(0,0,0,0.1);
        }

        /* ================= Hint ================= */
        .hint {
          text-align:center;
          margin-top:20px;
          font-size:12px;
          color:#64748b;
        }

        /* ================= Failure Box ================= */
        .failure-box {
          margin-top: 24px;
          padding: 14px 18px;
          border-radius: 18px;

          display: flex;
          align-items: flex-start;
          gap: 10px;

          font-size: 13px;
          font-weight: 600;

          background: rgba(239,68,68,0.08);
          color: #dc2626;

          backdrop-filter: blur(10px);

          box-shadow:
            inset 0 2px 6px rgba(220,38,38,0.15),
            0 6px 18px rgba(0,0,0,0.05);
        }

        .failure-box span {
          font-size: 18px;
          margin-top: 1px;
        }
      `}</style>
    </div>
  );
}
