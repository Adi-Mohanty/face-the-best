import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebase";

export default function QuestionsDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    ai: 0,
    manual: 0,
    approval: 0,
    running: 0,
    bySubject: {},
    byExam: {},
    byType: {},
    byDifficulty: {}
  });

  useEffect(() => {

    const unsubQuestions = onSnapshot(
      collection(db, "questions"),
      snap => {

        const now = new Date();

        let total = snap.size;
        let today = 0;
        let ai = 0;
        let manual = 0;

        const bySubject = {};
        const byExam = {};
        const byType = {};
        const byDifficulty = {};

        snap.docs.forEach(doc => {
          const d = doc.data();

          if (d.pipelineVersion < 4) ai++;
          else manual++;

          if (d.createdAt?.toDate) {
            const created = d.createdAt.toDate();
            if (
              created.getDate() === now.getDate() &&
              created.getMonth() === now.getMonth() &&
              created.getFullYear() === now.getFullYear()
            ) today++;
          }

          bySubject[d.subject] = (bySubject[d.subject] || 0) + 1;
          byExam[d.exam] = (byExam[d.exam] || 0) + 1;
          byType[d.type] = (byType[d.type] || 0) + 1;
          byDifficulty[d.difficulty] = (byDifficulty[d.difficulty] || 0) + 1;
        });

        setStats(prev => ({
          ...prev,
          total,
          today,
          ai,
          manual,
          bySubject,
          byExam,
          byType,
          byDifficulty
        }));
      }
    );

    const unsubJobs = onSnapshot(
      collection(db, "generationJobs"),
      snap => {

        let running = 0;
        let approved = 0;
        let generated = 0;

        snap.docs.forEach(doc => {
          const d = doc.data();
          if (d.status === "RUNNING") running++;
          approved += d.approved || 0;
          generated += d.generated || 0;
        });

        const approval =
          generated > 0
            ? Math.round((approved / generated) * 100)
            : 0;

        setStats(prev => ({
          ...prev,
          running,
          approval
        }));
      }
    );

    return () => {
      unsubQuestions();
      unsubJobs();
    };

  }, []);

  const manualPercent =
    stats.total > 0
      ? Math.round((stats.manual / stats.total) * 100)
      : 0;

  return (
    <div className="min-h-screen admin-bg font-display">
      <main className="max-w-[1500px] mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="dashboard-header">
          <h1>Questions Dashboard</h1>

          <div className="header-actions">
            <button
              onClick={() => navigate("/admin/questions/generate")}
              className="primary-btn"
            >
              + Generate
            </button>

            <button
              onClick={() => navigate("/admin/questions/manual")}
              className="secondary-btn"
            >
              + Manual
            </button>

            <button
              onClick={() => navigate("/admin/questions/bank")}
              className="bank-btn"
            >
              Question Bank
            </button>
          </div>
        </div>

        {/* KPI STRIP */}
        <div className="kpi-strip">
          <KPI label="Total" value={stats.total} />
          <KPI label="Today" value={stats.today} />
          <KPI label="Manual %" value={`${manualPercent}%`} />
          <KPI label="Approval" value={`${stats.approval}%`} />
          <KPI label="Running AI Jobs" value={stats.running} />
        </div>

        {/* ENTERPRISE ANALYTICS GRID */}
        <div className="enterprise-grid">

          <AnalyticsBlock
            title="Subject Distribution"
            data={stats.bySubject}
            total={stats.total}
          />

          <AnalyticsBlock
            title="Exam Distribution"
            data={stats.byExam}
            total={stats.total}
          />

          {/* <AnalyticsBlock
            title="Question Types"
            data={stats.byType}
            total={stats.total}
          />

          <AnalyticsBlock
            title="Difficulty Breakdown"
            data={stats.byDifficulty}
            total={stats.total}
          /> */}

          <DonutBlock
            title="Question Types"
            data={stats.byType}
            total={stats.total}
          />

          <DonutBlock
            title="Difficulty Breakdown"
            data={stats.byDifficulty}
            total={stats.total}
          />

        </div>

      </main>

      <style jsx>{`

        .admin-bg {
          background: linear-gradient(145deg,#eef2f7,#e2e8f0);
        }

        .dashboard-header {
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:25px;
        }

        .dashboard-header h1 {
          font-size:20px;
          font-weight:800;
        }

        .header-actions {
          display:flex;
          gap:10px;
        }

        .kpi-strip {
          display:grid;
          grid-template-columns: repeat(auto-fit,minmax(120px,1fr));
          gap:12px;
          margin-bottom:30px;
        }

        .enterprise-grid {
          display:grid;
          grid-template-columns: repeat(auto-fit,minmax(320px,1fr));
          gap:20px;
        }

        /* Buttons */

        .primary-btn,
        .secondary-btn,
        .bank-btn {
          padding:8px 14px;
          border-radius:12px;
          font-size:12px;
          font-weight:700;
          transition:.15s;
        }

        .primary-btn {
          background: linear-gradient(to bottom,#6366f1,#4f46e5);
          color:white;
          box-shadow:0 5px 12px rgba(79,70,229,0.35);
        }

        .secondary-btn {
          background: linear-gradient(145deg,#ffffff,#e8edf5);
          box-shadow:
            5px 5px 12px rgba(0,0,0,0.08),
            -3px -3px 8px rgba(255,255,255,0.9);
        }

        .bank-btn {
          background: linear-gradient(145deg,#ffffff,#e8edf5);
          box-shadow:
            5px 5px 12px rgba(0,0,0,0.08),
            -3px -3px 8px rgba(255,255,255,0.9);
        }

        .primary-btn:active,
        .secondary-btn:active,
        .bank-btn:active {
          transform: translateY(2px);
          box-shadow:
            inset 3px 3px 8px rgba(0,0,0,0.2);
        }

      `}</style>
    </div>
  );
}

/* KPI Component */
function KPI({ label, value }) {
  return (
    <div className="kpi">
      <p>{label}</p>
      <p>{value}</p>

      <style jsx>{`
        .kpi {
          padding:16px;
          border-radius:16px;
          text-align:center;
          background: linear-gradient(145deg,#ffffff,#e8edf5);
          box-shadow:
            6px 6px 12px rgba(0,0,0,0.08),
            -4px -4px 10px rgba(255,255,255,0.9);
        }
        p:first-child { font-size:10px; color:#64748b; }
        p:last-child { font-size:18px; font-weight:800; }
      `}</style>
    </div>
  );
}

/* Analytics Block */
function AnalyticsBlock({ title, data, total }) {
  return (
    <div className="block">
      <h3>{title}</h3>

      {Object.entries(data).map(([key, value]) => {
        const percent =
          total > 0 ? Math.round((value / total) * 100) : 0;

        return (
          <div key={key} className="row">
            <div className="label">
              {key} ({value})
            </div>
            <div className="bar-bg">
              <div
                className="bar-fill"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}

      <style jsx>{`
        .block {
          padding:20px;
          border-radius:20px;
          background: linear-gradient(145deg,#ffffff,#e8edf5);
          box-shadow:
            8px 8px 18px rgba(0,0,0,0.08),
            -6px -6px 14px rgba(255,255,255,0.9);
        }

        h3 {
          font-size:13px;
          font-weight:700;
          margin-bottom:15px;
        }

        .row {
          margin-bottom:10px;
        }

        .label {
          font-size:11px;
          margin-bottom:4px;
        }

        .bar-bg {
          height:8px;
          border-radius:999px;
          background:#cbd5e1;
          overflow:hidden;
        }

        .bar-fill {
          height:100%;
          background:#4f46e5;
        }
      `}</style>
    </div>
  );
}


function DonutBlock({ title, data, total }) {

  const entries = Object.entries(data);

  const radius = 70;
  const stroke = 18;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  let cumulativePercent = 0;

  return (
    <div className="donut-block">

      <h3>{title}</h3>

      <div className="donut-wrapper">

        <svg height={radius * 2} width={radius * 2}>
          {entries.map(([key, value], index) => {
            const percent = total > 0 ? value / total : 0;
            const strokeDasharray = `${percent * circumference} ${circumference}`;
            const strokeDashoffset = -cumulativePercent * circumference;

            cumulativePercent += percent;

            return (
              <circle
                key={key}
                stroke={getColor(index)}
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        <div className="donut-center">
          {total}
        </div>

      </div>

      <div className="donut-legend">
        {entries.map(([key, value], index) => (
          <div key={key} className="legend-item">
            <span
              className="legend-dot"
              style={{ background: getColor(index) }}
            />
            {key} ({value})
          </div>
        ))}
      </div>

      <style jsx>{`
        .donut-block {
          padding:22px;
          border-radius:20px;
          background: linear-gradient(145deg,#ffffff,#e8edf5);
          box-shadow:
            8px 8px 18px rgba(0,0,0,0.08),
            -6px -6px 14px rgba(255,255,255,0.9);
        }

        h3 {
          font-size:13px;
          font-weight:700;
          margin-bottom:18px;
        }

        .donut-wrapper {
          position:relative;
          display:flex;
          justify-content:center;
          align-items:center;
          margin-bottom:15px;
        }

        svg {
          transform: rotate(-90deg);
        }

        .donut-center {
          position:absolute;
          font-size:18px;
          font-weight:800;
        }

        .donut-legend {
          display:flex;
          flex-direction:column;
          gap:6px;
          font-size:11px;
        }

        .legend-item {
          display:flex;
          align-items:center;
          gap:6px;
        }

        .legend-dot {
          width:10px;
          height:10px;
          border-radius:50%;
        }
      `}</style>
    </div>
  );
}


function getColor(index) {
  const colors = [
    "#4f46e5",
    "#6366f1",
    "#818cf8",
    "#a5b4fc",
    "#c7d2fe",
    "#64748b"
  ];
  return colors[index % colors.length];
}