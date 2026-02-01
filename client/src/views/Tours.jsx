import { useEffect } from "react";
import { setPageTitle } from "./../utils";

function Tours() {
  useEffect(() => {
    setPageTitle("All Tours - TinyTours");
  }, []);
  return <div>Tours</div>;
}

export default Tours;
