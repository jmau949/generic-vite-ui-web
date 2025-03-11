import React from "react";
import { useNavigate } from "react-router-dom";

const TestPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <button onClick={() => navigate("/")}>testpage</button>
      <h1 className="text-2xl font-bold text-gray-900">Test Page</h1>
    </div>
  );
};

export default TestPage;
