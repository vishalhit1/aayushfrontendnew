import React from "react";
import "../styles/steps.css";

const StepIndicator = ({ currentStep }) => {
  const steps = ["Category","Preferences","Patient", "Slot", "Address", "Checkout"];

  return (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <div key={index} className={`step ${currentStep === index + 1 ? "active" : currentStep > index + 1 ? "completed" : ""}`}>
          <div className="step-number">{index + 1}</div>
          <div className="step-label">{step}</div>
          {index < steps.length - 1 && <div className="step-line"></div>}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
