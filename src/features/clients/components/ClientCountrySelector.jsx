import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLazyGetClientCreationDataQuery } from "../clientsApiSlice"; // Use RTK Query

const ClientCountrySelector = () => {
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { lang } = useSelector((state) => state.ui);

  // Use RTK Query instead of direct axios
  const [getClientData] = useLazyGetClientCreationDataQuery();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getClientData({ lang }).unwrap();
        setCountries(result.countries || []);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
        setError(err.data?.message || "Failed to load countries");
        setCountries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, [lang, getClientData]);

  return (
    <>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <select disabled={isLoading}>
        <option value="">{isLoading ? "Loading..." : "Select Country"}</option>
        {countries.map((country) => (
          <option key={country.id} value={country.id}>
            {country.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default ClientCountrySelector;
