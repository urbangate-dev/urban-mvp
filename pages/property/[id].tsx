import React, { useEffect, useState } from "react";
import { ChildPageProps } from "@/utils/props";
import { Property as Prop } from "@/utils/props";
import axios from "axios";

const Property: React.FC<ChildPageProps> = ({
  isConnected,
  address,
  user,
  router,
}) => {
  const { id } = router.query;
  const defaultDate = new Date().toISOString().split("T")[0];
  const [property, setProperty] = useState<Prop>({
    id: "",
    address: "",
    dealDescription: "",
    propertyDescription: "",
    city: "",
    state: "",
    zip: "",
    propertyType: "",
    bathroom: 0,
    bedroom: 0,
    sqft: 0,
    loanAsIsValue: 0,
    loanARVValue: 0,
    loanToCostValue: 0,
    loanAmount: 0,
    yieldPercent: 0,
    maturityDate: defaultDate,
    borrower: "",
    rehabBudget: 0,
    exitStrategy: "",
    borrowerExperience: "",
    borrowerNumberOfDeals: 0,
    borrowerDescription: "",
    investorPresentationLink: "",
    draft: true,
  });
  const [exists, setExists] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    if (id)
      try {
        const response = await axios.get(`/api/property/${id}`);
        if (response.data.exists) {
          setExists(true);
          setProperty(response.data.property);
        }
      } catch (error) {
        console.error("Error fetching property: ", error);
      }
  };

  return (
    <div>
      {exists ? (
        <div>
          <p>Property page {id}</p>
          <p>{property.address}</p>
        </div>
      ) : (
        <p>Property does not exist.</p>
      )}
    </div>
  );
};

export default Property;
