export default function Login() {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display min-h-screen">
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
          {/* Brand Side (Left) */}
          <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden bg-[#3b3ba7]">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 opacity-20 bg-center bg-cover" data-alt="Focused student studying in a modern library environment" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAqohfwhmRtfoHfLaAMenD5PpS-wqL18HkexiZbp1eop-wCQsgpJErzUaFPpUYW3VrAoL7ykkybIOCULtJKMVZz4VEwelGBro-STynGUuUuTG7MxzFRgm79cO5qpnJc80m7P8Vush-3iv43NrhPthZ8uTml-tfFYSQOWa5tBNMzDS5cNqz49AbonriYFKL7YUw75wkieg6t55t8eXIdYcA-dqvN1vMUiPzros-jsnvGiXnwgaZ1a1K5C9SzVNTxVG0wGdSHFVfENf5f")'}}>
            </div>
            
            <div className="relative z-20">
              <div className="flex items-center gap-2 text-white">
                <span className="material-symbols-outlined text-4xl">auto_stories</span>
                <span className="text-2xl font-black tracking-tight">ExamArena</span>
              </div>
            </div>
            
            <div className="relative z-20 max-w-xl">
              <h1 className="text-white text-5xl font-black leading-tight tracking-tight mb-6">
                Achieve Excellence in Indian Competitive Exams.
              </h1>
              <p className="text-white/90 text-lg font-normal leading-relaxed mb-12">
                Join over 100,000+ students preparing for UPSC, SSC, and Banking with our AI-driven personalized learning paths.
              </p>
              <div className="flex gap-8 items-end">
                <div className="flex flex-col">
                  <span className="text-white text-4xl font-black">98%</span>
                  <span className="text-white/60 text-xs uppercase tracking-wider mt-1">Success Rate</span>
                </div>
                <div className="w-px h-14 bg-white/20"></div>
                <div className="flex flex-col">
                  <span className="text-white text-4xl font-black">50k+</span>
                  <span className="text-white/60 text-xs uppercase tracking-wider mt-1">Mock Tests</span>
                </div>
              </div>
            </div>
            
            <div className="relative z-20 text-white/40 text-sm">
              © 2024 ExamArena Professional. All rights reserved.
            </div>
          </div>
  
          {/* Auth Form Side (Right) */}
          <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-20 bg-[#f5f5f7] dark:bg-background-dark">
            <div className="w-full max-w-[480px] flex flex-col gap-8">
              {/* Logo for Mobile */}
              <div className="lg:hidden flex items-center gap-2 text-primary dark:text-white mb-4">
                <span className="material-symbols-outlined text-3xl">auto_stories</span>
                <span className="text-xl font-black">ExamArena</span>
              </div>
  
              {/* Page Heading */}
              <div className="flex flex-col gap-2">
                <h2 className="text-[#0f0f1a] dark:text-white text-3xl font-extrabold leading-tight tracking-tight">Welcome Back</h2>
                <p className="text-[#6b6b80] dark:text-gray-400 text-base">Sign in to your ExamArena account to continue your preparation.</p>
              </div>
  
              {/* Segmented Buttons */}
              <div className="flex h-12 w-full items-center justify-center rounded-xl bg-[#e8e8ec] dark:bg-gray-800 p-1">
                <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-[:checked]:bg-white dark:has-[:checked]:bg-gray-700 has-[:checked]:shadow-sm has-[:checked]:text-[#0f0f1a] dark:has-[:checked]:text-white text-[#6b6b80] dark:text-gray-400 text-sm font-semibold transition-all">
                  <span className="truncate">Login</span>
                  <input checked className="invisible w-0" name="auth-mode" type="radio" value="Login"/>
                </label>
                <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-[:checked]:bg-white dark:has-[:checked]:bg-gray-700 has-[:checked]:shadow-sm has-[:checked]:text-[#0f0f1a] dark:has-[:checked]:text-white text-[#6b6b80] dark:text-gray-400 text-sm font-semibold transition-all">
                  <span className="truncate">Sign Up</span>
                  <input className="invisible w-0" name="auth-mode" type="radio" value="Sign Up"/>
                </label>
              </div>
  
              {/* Form Fields */}
              <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); return false; }}>
                {/* TextField Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#0f0f1a] dark:text-gray-200 text-sm font-semibold leading-normal">Email Address</label>
                  <div className="relative">
                    <input className="form-input flex w-full rounded-xl text-[#0f0f1a] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#d8d8dd] dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-primary h-14 placeholder:text-[#a0a0b8] px-4 text-base font-normal" placeholder="rahul@example.com" type="email"/>
                  </div>
                </div>
  
                {/* TextField Password */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[#0f0f1a] dark:text-gray-200 text-sm font-semibold leading-normal">Password</label>
                    <a className="text-[#3b3ba7] dark:text-blue-400 text-xs font-bold hover:underline" href="#">Forgot Password?</a>
                  </div>
                  <div className="flex w-full items-stretch rounded-xl border border-[#d8d8dd] dark:border-gray-700 bg-white dark:bg-gray-900 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary overflow-hidden">
                    <input className="form-input flex w-full border-none bg-transparent h-14 text-[#0f0f1a] dark:text-white placeholder:text-[#a0a0b8] px-4 text-base font-normal focus:ring-0" placeholder="••••••••" type="password"/>
                    <button className="text-[#6b6b80] flex items-center justify-center pr-4" type="button">
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                  </div>
                </div>
  
                {/* Options */}
                <div className="flex items-center gap-2 py-1">
                  <input className="w-4 h-4 rounded border-[#d8d8dd] text-primary focus:ring-primary" id="remember" type="checkbox"/>
                  <label className="text-sm text-[#6b6b80] dark:text-gray-400 font-medium" htmlFor="remember">Keep me logged in</label>
                </div>
  
                {/* Primary Button */}
                <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-[#3b3ba7] text-white text-base font-bold leading-normal tracking-normal hover:bg-[#32329a] transition-all active:scale-[0.98]">
                  <span className="truncate">Sign In to Dashboard</span>
                </button>
              </form>
  
              {/* Divider */}
              <div className="flex items-center gap-4 py-2">
                <div className="h-px bg-[#d8d8dd] dark:bg-gray-800 grow"></div>
                <span className="text-[#6b6b80] text-xs font-bold uppercase tracking-widest">Or continue with</span>
                <div className="h-px bg-[#d8d8dd] dark:bg-gray-800 grow"></div>
              </div>
  
              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 h-12 rounded-xl border border-[#d8d8dd] dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <img alt="Google Logo" className="w-5 h-5" data-alt="Google company icon" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzDc_PQ0p5-HCPY0N8UmQiT3O-GXGLc3h_lPRoLNVs1FN9C7bxlSegBVjTx0snueHqyYo-gEoFu4Dyy2MvpPZrcOwfZnHsFxbGiZBouKkDPVqEn3HJTAwDVDJ-Cy_qqmND1C2uv4tl6gdbrT1UpP1VJS_IjZRdBU5pc58AAJEg_RwQYI7dZEaSoWXjzYeRz41QcP0HsEUgauAffFqGfIDZCN0-LAPvASweJ85aALEeMeiEimsszyXi9gIQpydS6AqXuvEfXY_gr8cr"/>
                  <span className="text-[#0f0f1a] dark:text-white text-sm font-semibold">Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 h-12 rounded-xl border border-[#d8d8dd] dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <img alt="LinkedIn Logo" className="w-5 h-5" data-alt="LinkedIn company icon" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDg8H6LvjDbFHilbfhoxHFL2gTnCclgOaPOy92eEIalBTm6Oc_cN6anY-CPL_924YkeSVsvBbkZXPBq-_Q7G0ONhMrTorlpbRTz1TeGONUwH6oD3p3qAOq7TQlqyR2c5EWdW_mzpNzholcC4S_OWk4KAxUTlNnp91A9Al61AhYU9KpAVCChu2HkqarUaX0V0hQ54Lc2UWtiBRQkcByyCeRsneYulKD_dDD0LhfPz8FNYosIvFVvPI9GIvI7YSTBnzuDY_6EcPu8i634"/>
                  <span className="text-[#0f0f1a] dark:text-white text-sm font-semibold">LinkedIn</span>
                </button>
              </div>
  
              {/* Footer Link */}
              <p className="text-center text-[#6b6b80] dark:text-gray-400 text-sm font-medium pt-4">
                New to ExamArena? 
                <a className="text-[#3b3ba7] dark:text-blue-400 font-bold hover:underline ml-1" href="#">Create an account</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  