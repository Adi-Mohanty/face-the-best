import { useNavigate } from "react-router-dom";

export default function FinalCTA() {

  const navigate = useNavigate();

  return (
    <section className="max-w-[1180px] mx-auto px-6 py-20 text-center">

      <h2 className="text-3xl font-black mb-6">
        Your rank awaits.
      </h2>

      <button
        onClick={() => navigate("/login")}
        className="
        px-8 py-4 text-lg font-bold text-white rounded-xl

        bg-gradient-to-b from-primary to-blue-600

        shadow-[10px_10px_20px_rgba(0,0,0,0.25)]

        active:translate-y-[2px]
        active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.35)]
        "
      >
        Enter Arena
      </button>

    </section>
  );
}
