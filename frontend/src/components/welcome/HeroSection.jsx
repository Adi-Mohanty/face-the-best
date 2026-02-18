  import { motion } from "framer-motion";
  import { fadeUp, staggerContainer } from "../../utils/animations";
  import { useNavigate } from "react-router-dom";
  import { onAuthStateChanged, getAuth } from "firebase/auth";
  import { useEffect, useState } from "react";

  export default function HeroSection() {

    const navigate = useNavigate();
    // const [checking, setChecking] = useState(true);

    const handleStart = () => {
      const auth = getAuth();
    
      if (auth.currentUser) {
        navigate("/exams");
      } else {
        navigate("/login");
      }
    };

    // useEffect(() => {
    //   const unsubscribe = onAuthStateChanged(getAuth(), () => {
    //     setChecking(false);
    //   });

    //   return unsubscribe;
    // }, []);


    return (
      <section className="relative overflow-hidden">

        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-[1200px] mx-auto px-6 py-24 text-center"
        >

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-6xl font-black tracking-tight"
          >
            Face The Best.
            <br />
            <span className="text-primary">
              Rise Above The Rest.
            </span>
          </motion.h1>


          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-slate-600 max-w-xl mx-auto"
          >
            Compete in real exam battles.
            <br />
            Climb rankings. Become elite.
          </motion.p>


          {/* Buttons */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex justify-center gap-4"
          >

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              // disabled={checking} 
              onClick={handleStart}
              className="
                px-6 py-3 rounded-xl font-bold text-white
                bg-gradient-to-b from-primary to-blue-600
                shadow-[0_10px_20px_rgba(79,70,229,0.4)]
              "
            >
              Enter Arena
            </motion.button>


            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="
                px-6 py-3 rounded-xl font-bold
                bg-gradient-to-b from-white to-slate-200
                border border-slate-300
              "
            >
              View Leaderboard
            </motion.button>

          </motion.div>

        </motion.div>

      </section>
    );
  }
