const HeroSection = () => {
  return (
    <div className="relative h-screen flex items-center justify-center flex-col text-center">
      <div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight flex flex-col">
          <span className="m-0">
            Welcome to{" "}
            <span className="text-gradient m-0">Phenix Accounting</span>
          </span>
          <span className="m-0">Warehouse, and Management Systems</span>
        </h1>
      </div>

      <div>
        <p className="text-gray-400 text-lg md:text-2xl mb-4" style={{fontFamily:"livvic"}}>
          Phenix System : The easiest and most integrated accounting solution for
          managing sales, inventory, and payroll.
        </p>
        <p className="text-gray-400 text-lg md:text-2xl" style={{fontFamily:"livvic"}}>
          Simple to use, accurate reporting, and complete flexibility to suit
          your company's needs
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
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
