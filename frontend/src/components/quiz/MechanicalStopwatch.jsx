// import { useMemo } from "react";

// export default function MechanicalStopwatch({
//   timeLeft,
//   totalTime
// }) {

//   const seconds = timeLeft % 60;
//   const minutes = Math.floor(timeLeft / 60);

//   // rotation based on seconds
//   const secondRotation = useMemo(() => {
//     return (seconds / 60) * 360;
//   }, [seconds]);

//   const progress = timeLeft / totalTime;

//   const danger =
//     progress <= 0.15;

//   return (
//     <div className="flex flex-col items-center">

//       {/* Stopwatch Body */}
//       <div
//         className="
//         relative
//         w-36 h-36
//         rounded-full

//         bg-gradient-to-br
//         from-slate-200 via-slate-100 to-slate-300

//         border border-slate-400

//         shadow
//         [box-shadow:
//           inset_6px_6px_12px_rgba(0,0,0,0.25),
//           inset_-6px_-6px_12px_rgba(255,255,255,0.9),
//           8px_8px_18px_rgba(0,0,0,0.25)
//         ]
//       "
//       >

//         {/* Inner Dial */}
//         <div
//           className="
//           absolute inset-3
//           rounded-full

//           bg-gradient-to-br
//           from-white to-slate-200

//           shadow
//           [box-shadow:
//             inset_4px_4px_8px_rgba(0,0,0,0.2),
//             inset_-4px_-4px_8px_rgba(255,255,255,0.9)
//           ]
//         "
//         >

//           {/* Tick Marks */}
//           {[...Array(12)].map((_, i) => (
//             <div
//               key={i}
//               className="
//                 absolute
//                 w-[2px]
//                 h-3
//                 bg-slate-500
//                 left-1/2
//                 top-1
//                 origin-bottom
//               "
//               style={{
//                 transform:
//                   `translateX(-50%) rotate(${i * 30}deg)`
//               }}
//             />
//           ))}

//           {/* Second Hand */}
//           <div
//             className="
//               absolute
//               w-[2px]
//               h-[45%]
//               bg-red-600
//               left-1/2
//               bottom-1/2
//               origin-bottom
//               transition-transform
//               duration-1000
//               ease-linear
//             "
//             style={{
//               transform:
//                 `translateX(-50%) rotate(${secondRotation}deg)`
//             }}
//           />

//           {/* Center Pin */}
//           <div
//             className="
//               absolute
//               w-3 h-3
//               rounded-full
//               bg-gradient-to-br
//               from-slate-500 to-slate-700
//               border border-slate-800
//               left-1/2
//               top-1/2
//               -translate-x-1/2
//               -translate-y-1/2
//               shadow
//             "
//           />

//           {/* Digital Time */}
//           <div
//             className="
//               absolute
//               bottom-4
//               left-1/2
//               -translate-x-1/2

//               px-3 py-1
//               rounded-md

//               bg-black
//               text-white
//               text-xs
//               font-mono
//               tracking-wider

//               shadow-inner
//             "
//           >
//             {String(minutes).padStart(2, "0")}:
//             {String(seconds).padStart(2, "0")}
//           </div>

//         </div>

//         {/* Top Button */}
//         <div
//           className="
//             absolute
//             -top-3
//             left-1/2
//             -translate-x-1/2

//             w-6 h-4
//             rounded-md

//             bg-gradient-to-b
//             from-slate-400 to-slate-600

//             border border-slate-700

//             shadow
//           "
//         />

//       </div>

//       {/* Label */}
//       <p
//         className={`
//         mt-3
//         text-xs
//         font-bold
//         tracking-widest

//         ${danger
//           ? "text-red-600 animate-pulse"
//           : "text-slate-600"}
//       `}
//       >
//         TIME REMAINING
//       </p>

//     </div>
//   );
// }




import { useMemo } from "react";

export default function MechanicalStopwatch({
  timeLeft,
  totalTime
}) {

  const seconds = timeLeft % 60;
  const minutes = Math.floor(timeLeft / 60);

  const secondRotation = useMemo(() => {
    return (seconds / 60) * 360;
  }, [seconds]);

  const progress = timeLeft / totalTime;

  const danger = progress <= 0.15;

  return (
    <div className="flex flex-col items-center">

      {/* Stopwatch Body */}
      <div
        className="
        relative
        w-28 h-28
        rounded-full

        bg-gradient-to-br
        from-slate-200 via-slate-100 to-slate-300

        border border-slate-400

        shadow
        [box-shadow:
          inset_5px_5px_10px_rgba(0,0,0,0.25),
          inset_-5px_-5px_10px_rgba(255,255,255,0.9),
          6px_6px_14px_rgba(0,0,0,0.25)
        ]
      "
      >

        {/* Inner Dial */}
        <div
          className="
          absolute inset-2.5
          rounded-full

          bg-gradient-to-br
          from-white to-slate-200

          shadow
          [box-shadow:
            inset_3px_3px_6px_rgba(0,0,0,0.2),
            inset_-3px_-3px_6px_rgba(255,255,255,0.9)
          ]
        "
        >

          {/* Tick Marks */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="
                absolute
                w-[1.5px]
                h-2.5
                bg-slate-500
                left-1/2
                top-1
                origin-bottom
              "
              style={{
                transform:
                  `translateX(-50%) rotate(${i * 30}deg)`
              }}
            />
          ))}

          {/* Second Hand */}
          <div
            className="
              absolute
              w-[1.5px]
              h-[45%]
              bg-red-600
              left-1/2
              bottom-1/2
              origin-bottom
              transition-transform
              duration-1000
              ease-linear
            "
            style={{
              transform:
                `translateX(-50%) rotate(${secondRotation}deg)`
            }}
          />

          {/* Center Pin */}
          <div
            className="
              absolute
              w-2.5 h-2.5
              rounded-full
              bg-gradient-to-br
              from-slate-500 to-slate-700
              border border-slate-800
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
              shadow
            "
          />

          {/* Digital Time */}
          <div
            className="
              absolute
              bottom-3
              left-1/2
              -translate-x-1/2

              px-2.5 py-0.5
              rounded

              bg-black
              text-white
              text-[10px]
              font-mono
              tracking-wider

              shadow-inner
            "
          >
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>

        </div>

        {/* Top Button */}
        <div
          className="
            absolute
            -top-2.5
            left-1/2
            -translate-x-1/2

            w-5 h-3
            rounded

            bg-gradient-to-b
            from-slate-400 to-slate-600

            border border-slate-700

            shadow
          "
        />

      </div>

      {/* Label */}
      <p
        className={`
        mt-2
        text-[10px]
        font-bold
        tracking-widest

        ${danger
          ? "text-red-600 animate-pulse"
          : "text-slate-600"}
      `}
      >
        TIME REMAINING
      </p>

    </div>
  );
}
