import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Button from "../components/Button";
import MultiSelect from "../components/MultiSelect";
import Input from "./../components/Input";
import Navbar from "./../components/Navbar";
import PhotoViewer from "./../components/PhotoViewer";
import { getUserJwtToken, setPageTitle } from "./../utils";

function NewTour() {
  const [newTour, setNewTour] = useState({
    title: "",
    description: "",
    cities: [],
    startDate: "",
    endDate: "",
    photos: [],
  });
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef();

  const authenticator = async () => {
    try {
      // Perform the request to the upload authentication endpoint.
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth`);
      if (!response.ok) {
        // If the server response is not successful, extract the error text for debugging.
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`,
        );
      }

      // Parse and destructure the response JSON for upload credentials.
      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      // Log the original error for debugging before rethrowing a new error.
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  const handleUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert("Please select a file to upload");
      return;
    }

    // Extract the first file from the file input
    const file = fileInput.files[0];

    // Retrieve authentication parameters for the upload.
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      return;
    }
    const { signature, expire, token, publicKey } = authParams;

    // Call the ImageKit SDK upload function with the required parameters and callbacks.
    try {
      const uploadResponse = await upload({
        // Authentication parameters
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name, // Opt file,ionally set a custom file name
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
      });

      setNewTour({
        ...newTour,
        photos: [...newTour.photos, uploadResponse.url],
      });

      setProgress(0);
      fileInput.value = "";
    } catch (error) {
      console.log(error);

      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        // Handle any other errors that may occur.
        console.error("Upload error:", error);
      }
    }
  };

  const addTour = async () => {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/tours`, newTour, {
      headers: {
        Authorization: `Bearer ${getUserJwtToken()}`,
      },
    });
    console.log(response.data);
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  useEffect(() => {
    setPageTitle("Add Tour - TinyTours");
  }, []);
  return (
    <div>
      <Navbar />

      <h1>Add New Tour</h1>

      <div className="w-80 block mx-auto mt-10">
        <Input
          type={"text"}
          placeholder={"Enter Title"}
          value={newTour.title}
          onChange={(e) => {
            setNewTour({
              ...newTour,
              title: e.target.value,
            });
          }}
        />
        <Input
          type={"text"}
          placeholder={"Enter Description"}
          value={newTour.description}
          onChange={(e) => {
            setNewTour({
              ...newTour,
              description: e.target.value,
            });
          }}
        />
        <MultiSelect
          selectedItems={newTour.cities}
          placeholder={"Enter City"}
          onAddItem={(val) => {
            setNewTour({
              ...newTour,
              cities: [...newTour.cities, val],
            });
          }}
          onRemoveItem={(val) => {
            setNewTour({
              ...newTour,
              cities: newTour.cities.filter((city) => city !== val),
            });
          }}
        />
        <Input
          type={"date"}
          placeholder={"Enter Start Date"}
          value={newTour.startDate}
          onChange={(e) => {
            setNewTour({
              ...newTour,
              startDate: e.target.value,
            });
          }}
        />
        <Input
          type={"date"}
          placeholder={"Enter End Date"}
          value={newTour.endDate}
          onChange={(e) => {
            setNewTour({
              ...newTour,
              endDate: e.target.value,
            });
          }}
        />
        <div className="flex gap-x-2">
          {newTour.photos?.map((photo, index) => (
            <PhotoViewer
              key={index}
              imgUrl={photo}
              index={index}
              onDelete={(url) => {
                setNewTour({
                  ...newTour,
                  photos: newTour.photos.filter((p) => p !== url),
                });
              }}
              showDelete
            />
          ))}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            console.log("File selected:");
            console.log(e.target.files);
            if (e.target.files.length > 0) {
              handleUpload();
            }
          }}
        />
        {progress > 0 ? `Uploading... ${progress}%` : null}
      </div>

      <div className="w-80 block mx-auto mt-10">
        <Button title="Add Tour" onClick={addTour} />
      </div>
      <Toaster />
    </div>
  );
}

export default NewTour;
