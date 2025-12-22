import React, { createContext, useState } from "react";

export const DoctorFilterContext = createContext();

export const DoctorFilterProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);

  const clearFilters = () => {
    setSearchTerm("");
    setSpecialtyFilter("");
    setRatingFilter(0);
  };

  return (
    <DoctorFilterContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        specialtyFilter,
        setSpecialtyFilter,
        ratingFilter,
        setRatingFilter,
        clearFilters,
      }}
    >
      {children}
    </DoctorFilterContext.Provider>
  );
};