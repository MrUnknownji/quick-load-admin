import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faMicrophone } from "@fortawesome/free-solid-svg-icons";

const SearchBar: React.FC = () => {
  return (
    <div className="relative w-full md:w-64">
      <input
        type="text"
        placeholder="Search..."
        className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
      </div>
      <button className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <FontAwesomeIcon
          icon={faMicrophone}
          className="text-gray-400 hover:text-primary-600"
        />
      </button>
    </div>
  );
};

export default SearchBar;
