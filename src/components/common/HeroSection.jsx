const HeroSection = () => {
  return (
    <div className="relative h-screen flex items-center justify-center flex-col text-center">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-15">
        <h1
          style={{ fontFamily: "Inter", fontWeight: "800" }}
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl
          dark:text-white text-gray-900 dark:font-bold mb-8 leading-tight flex flex-col"
        >
          <span className="m-0">
            Welcome to{" "}
            <span className="text-gradient m-0">Phenix Accounting</span>
          </span>
          <span className="m-0">Warehouse, and Management Systems</span>
        </h1>
      </div>

      <div>
        <p
          className="dark:text-gray-400 max-w-5xl  text-gray-600 text-lg md:text-2xl mb-4"
          style={{ fontFamily: "livvic" }}
        >
          Phenix System : The easiest and most integrated accounting solution
          for managing sales, inventory, and payroll.
        </p>
        <p
          className="dark:text-gray-400 max-w-5xl  text-gray-600  text-lg md:text-2xl"
          style={{ fontFamily: "livvic" }}
        >
          Simple to use, accurate reporting, and complete flexibility to suit
          your company's needs
        </p>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce dark:text-gray-400 text-gray-600 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
