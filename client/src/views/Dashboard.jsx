import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import TourCard from "../components/TourCard";
import { getUserJwtToken } from "../utils";
import imgNewTour from "./../assets/new-tour.png";

function Dashboard() {
  const [tours, setTours] = useState([]);

  const loadTours = async () => {
    const userJWT = getUserJwtToken();

    const response = await axios.get("http://localhost:8080/tours", {
      headers: {
        Authorization: `Bearer ${userJWT}`,
      },
    });

    if (response.data.success) {
      toast.success(response.data.message);
      setTours(response.data.data);
    } else {
      toast.error(response.data.message);
    }
  };

  useEffect(() => {
    loadTours();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="w-2/3 block mx-auto mt-10">
        <Link to="/tours/new">
          <img
            src={imgNewTour}
            alt="New Tour"
            className="fixed bottom-10 right-10 h-10 cursor-pointer"
          />
        </Link>

        {tours.map((tourItem, index) => {
          return <TourCard key={index} {...tourItem} />;
        })}
      </div>

      <Toaster />
    </div>
  );
}

export default Dashboard;
