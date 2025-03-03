import { HashLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <HashLoader color="#3498db" size={50} />
      <span className="text-[#3498db] mt-2">Loading...</span>
    </div>
  );
};

export default Spinner;
