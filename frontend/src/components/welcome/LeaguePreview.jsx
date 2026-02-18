const leagues = [
    "Iron",
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Master",
    "Legend"
  ];
  
  export default function LeaguePreview() {
  
    return (
      <section className="max-w-[1180px] mx-auto px-6 py-16">
  
        <h2 className="text-2xl font-bold mb-6">
          Competitive Leagues
        </h2>
  
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
  
          {leagues.map(league => (
  
            <div
              key={league}
              className="
              rounded-xl p-4 text-center
  
              bg-gradient-to-b from-white to-slate-200
              border border-slate-300
  
              shadow-[8px_8px_16px_rgba(0,0,0,0.1)]
              "
            >
              {league}
            </div>
  
          ))}
  
        </div>
  
      </section>
    );
  }
  