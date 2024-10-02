import { useEffect } from "react";

const EmbedForm: React.FC = () => {
  useEffect(() => {
    const existingScript = document.getElementById("activecampaign-script");

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://urbangatecapital.activehosted.com/f/embed.php?id=1";
      script.type = "text/javascript";
      script.charset = "utf-8";
      script.id = "activecampaign-script"; // Set an ID to prevent duplicates
      script.async = true; // Load asynchronously
      document.body.appendChild(script);
    }

    // Clean up script on unmount
    return () => {
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return <div className="_form_1"></div>;
};

export default EmbedForm;
