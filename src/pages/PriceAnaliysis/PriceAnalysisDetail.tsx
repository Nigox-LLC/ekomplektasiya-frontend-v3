import React from "react";
import PriceAnalysisForm from "./PriceAnalysisForm/PriceAnalysisForm";
import { useParams } from "react-router";

const PriceAnalysisDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-4">
      <PriceAnalysisForm isEditMode={true} priceAnalysisId={id} />
    </div>
  );
};

export default PriceAnalysisDetail;