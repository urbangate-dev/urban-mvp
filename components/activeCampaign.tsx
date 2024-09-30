import { useEffect, useRef } from "react";

const ActiveCampaignForm = () => {
  // Explicitly type the ref as an HTMLDivElement or null
  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (formRef.current) {
      // Dynamically create the script element
      const script = document.createElement("script");
      script.src = "https://urbangatecapital.activehosted.com/f/embed.php?id=1";
      script.type = "text/javascript";
      script.charset = "utf-8";
      script.async = true;

      // Append the script to the form container ref
      formRef.current.appendChild(script);
    }
  }, []);

  return <div ref={formRef} className="_form_1"></div>;
};

export default ActiveCampaignForm;
