const features = [
    {
      title: "Real Exam Battles",
      desc: "Compete in real exam conditions"
    },
    {
      title: "Live Rankings",
      desc: "Track your rank globally"
    },
    {
      title: "League Progression",
      desc: "Advance through elite leagues"
    },
    {
      title: "Achievement System",
      desc: "Unlock prestige rewards"
    }
  ];
  
  export default function FeaturesSection() {
  
    return (
      <section className="max-w-[1180px] mx-auto px-6 py-16">
  
        <div className="grid md:grid-cols-4 gap-6">
  
          {features.map(feature => (
  
            <div
              key={feature.title}
              className="
              rounded-xl p-6
  
              bg-gradient-to-b from-white to-slate-200
              border border-slate-300
  
              shadow-[8px_8px_16px_rgba(0,0,0,0.1)]
              "
            >
  
              <h3 className="font-bold">
                {feature.title}
              </h3>
  
              <p className="text-sm text-slate-500 mt-2">
                {feature.desc}
              </p>
  
            </div>
  
          ))}
  
        </div>
  
      </section>
    );
  }
  