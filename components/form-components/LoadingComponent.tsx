import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const LoadingComponent: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <FontAwesomeIcon
        icon={faSpinner}
        spin
        size="3x"
        className="text-primary-600"
      />
    </div>
  );
};

export default LoadingComponent;
