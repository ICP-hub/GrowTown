import { useEffect, useState } from "react";
import { RiFolder6Line, RiDeleteBinLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { BeGod_assethandler } from "../../../../declarations/BeGod_assethandler";
import { IoIosAdd } from "react-icons/io";

function ImageUploader(props) {
  const [files, setFiles] = useState();
  const [previews, setPreviews] = useState();
  const [hideUpload, setHideUpload] = useState(false);
  const [fileType, setFileType] = useState("file");
  const {
    // captureUploadedNftImage,
    captureUploadedNftImageFile,
    imageurlchange,
  } = props;

  useEffect(() => {
    if (!files || files.length === 0) return;
    // Create preview URLs for each file
    const objectUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews(objectUrls);
    captureUploadedNftImageFile(files);
    imageurlchange(objectUrls);
    console.log(files);
    console.log(objectUrls);

    // UploadedNftImage(objectUrls);
    // Cleanup function to revoke object URLs and free memory
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFileType("file");
    }, 1000);

    return () => clearTimeout(timer);
  }, [fileType]);

  const toggleInputHide = () => {
    setHideUpload(!hideUpload);
    setPreviews();
  };

  const onClickDeleteImage = () => {
    setFileType("none");
    setHideUpload(!hideUpload);
    setPreviews();
    setFiles();
  };

  // const UploadedNftImage = async (captureImage) => {
  //   if (BeGod_assethandler) {
  //     try {
  //       console.log(captureImage);

  //       const id = Date.now().toString();
  //       const response = await fetch(captureImage);
  //       const blob = await response.blob();

  //       const arrayBuffer = await blob.arrayBuffer();

  //       const result1 = await BeGod_assethandler?.uploadImg(id, [
  //         ...new Uint8Array(arrayBuffer),
  //       ]);
  //       console.log(result1);

  //       // //return the url
  //       const acd = process.env.DFX_NETWORK;
  //       console.log(acd);
  //       if (acd == "local") {
  //         const url = `http://127.0.0.1:4943/?canisterId=${process.env.CANISTER_ID_BEGOD_ASSETHANDLER}&imgid=${id}`;
  //         console.log("nft url", url);
  //         imageurlchange(url);
  //       } else if (acd === "ic") {
  //         const url = `https://${process.env.CANISTER_ID_BEGOD_ASSETHANDLER}.raw.icp0.io/?imgid=${id}`;
  //         console.log("nft url", url);
  //         imageurlchange(url);
  //       }
  //       // const url = `http://127.0.0.1:4943/?canisterId=${process.env.CANISTER_ID_BEGOD_ASSETHANDLER}&imgid=${id}`;
  //       // //return the url
  //       // console.log("nft url", url);
  //       // imageurlchange(url);
  //     } catch (error) {
  //       console.error("Error fetching uploading:", error);
  //     }
  //   }
  // };

  return (
    <div className="mt-2">
        <div className="flex justify-center border items-center pr-2  border-dashed h-[100px] md:h-[150px] -mt-1 m-0 rounded-md">
      {!hideUpload && (
        <input
          type={fileType}
          accept="image/jpg, image/jpeg, image/png"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFiles(e.target.files);
              toggleInputHide();
            }
          }}
          style={{ display: "none" }}
          className="w-0 h-0"
        />
      )}
      {!hideUpload && (
        <div className="flex justify-center border  center ] items-center border-dashed rounded-full bg-transparent w-10 h-10  m-0 ">
          <IoIosAdd className="cursor-pointer" />
        </div>
      )}
      {previews &&
        previews.map((pic, index) => {
          // captureUploadedNftImage(pic);
          return (
            <div
              key={index}
              className="relative w-[50px] h-[50px] md:w-[70px] md:h-[70px] m-0"
            >
              <img
                src={pic}
                alt="Selected"
                className="object-cover w-full h-full rounded-full"
              />
              <button
                onClick={onClickDeleteImage}
                className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full"
              >
                <RxCross2 className="text-black" size={15} />
              </button>
            </div>
          );
        })}
    </div>
    </div>
  );
}

export default ImageUploader;
