const FeaturesSection = () => {
  const stats = [
    { value: "50+", label: "Projects Completed" },
    { value: "23+", label: "Years Experience" },
    { value: "99%", label: "Client Satisfaction" },
    { value: "24/10", label: "Support Available" },
  ];

  const features = [
    { id: 1, label: "Easy to Use" },
    { id: 2, label: "Accurate Reports" },
    { id: 3, label: "For all Sectors" },
    { id: 4, label: "Mobility Solution" },
  ];

  return (
    <div className="relative py-4 max-w-7xl mx-auto">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ed1c24]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ed1c24]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-[#ed1c24]/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-center md:justify-between gap-12">
            {/* Left Content */}
            <div className="lg:w-1/2 space-y-8">
              <div>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  Build The Future With
                  <span className="text-gradient"> Modern Tech</span>
                </h2>

                <p className="text-lg text-gray-400 max-w-xl" style={{fontFamily:"livvic"}}>
                  We create exceptional digital experiences that combine
                  cutting-edge technology with stunning design. Let's build
                  something amazing together.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="cursor-pointer bg-linear-to-r from-[#ed1c24] to-[#ed1c29] text-white font-medium px-8 py-4 rounded-lg hover:shadow-xl hover:shadow-[#ff6b6b]/30 transition-all duration-300 transform hover:-translate-y-1">
                  Start Project
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    className="size-5 ml-2 inline"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </button>
                <button className="cursor-pointer border border-white/20 px-8 py-4 rounded-lg hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1">
                  View Our Work
                </button>
              </div>
            </div>
            {/* ==== Left Content ==== */}

            {/* Right Content */}
            <div className="lg:w-1/2 relative">
              <div className="relative bg-linear-to-br from-white/5 to-white/0 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#ff6b6b]/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#ed1c24]/20 rounded-full blur-xl"></div>

                <div className="grid grid-cols-2 gap-6">
                  {stats.map((s, i) => (
                    <div
                      key={i}
                      className="bg-black/30 rounded-xl p-6 border border-white/5 hover:border-[#ff6b6b]/30 transition-all duration-300"
                    >
                      <div className="text-2xl md:text-3xl font-bold text-gradient mb-2">
                        {s.value}
                      </div>
                      <p className="text-sm text-gray-400" style={{fontFamily:"livvic"}}>{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-md text-gray-400 mb-4">
                    The Best Integrated Accounting System
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {features.map((val) => (
                      <span
                        key={val.id}
                        className="px-4 py-2 bg-white/5 rounded-lg text-sm"
                        style={{fontFamily:"livvic"}}
                      >
                        {val.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* ==== Right Content ==== */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
