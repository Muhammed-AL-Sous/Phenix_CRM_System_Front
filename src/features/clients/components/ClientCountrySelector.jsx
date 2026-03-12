import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const ClientCountrySelector = () => {
  const [countries, setCountries] = useState([]);
  const { lang } = useSelector((state) => state.ui);

  useEffect(() => {
    // جلب الدول بناءً على اللغة الحالية في i18next
    axios
      .get(`/api/countries?lang=${lang}`)
      .then((res) => setCountries(res.data));
  }, [lang]); // سيعاد التنفيذ تلقائياً عند تغيير اللغة

  return (
    <select>
      {countries.map((country) => (
        <option key={country.id} value={country.alpha2}>
          {country.name}
        </option>
      ))}
    </select>
  );
};

export default ClientCountrySelector;
