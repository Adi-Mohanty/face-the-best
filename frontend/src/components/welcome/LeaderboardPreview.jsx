import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "../../utils/animations";

export default function LeaderboardPreview() {

  const players = [
    { name: "Aditya", rank: 1, score: 982, accuracy: 96, league: "Diamond II" },
    { name: "Rahul", rank: 2, score: 970, accuracy: 94, league: "Platinum IV" },
    { name: "Priya", rank: 3, score: 955, accuracy: 92, league: "Gold I" },
    { name: "Amit", rank: 4, score: 940, accuracy: 91, league: "Gold II" },
    { name: "Neha", rank: 5, score: 930, accuracy: 89, league: "Silver V" }
  ];

  return (
    <section className="py-20">

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-[1000px] mx-auto px-6"
      >

        <motion.h2
          variants={fadeUp}
          className="text-2xl font-bold mb-8 text-center"
        >
          Top Competitors
        </motion.h2>


        <div className="space-y-4">

          {players.map(player => (
            <motion.div
              key={player.rank}
              variants={fadeUp}
              whileHover={{
                scale: 1.02,
                boxShadow: "0px 12px 30px rgba(0,0,0,0.15)"
              }}
              className="
                p-4 rounded-xl
                bg-gradient-to-b from-white to-slate-200
                border border-slate-300
              "
            >
              #{player.rank} • {player.name} • {player.score}
            </motion.div>
          ))}

        </div>

      </motion.div>

    </section>
  );
}
