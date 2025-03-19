import Lottie from "lottie-react";
import loaderAnimation from "../animations/loader.json";

export default function Loader() {
  return (
    <div className="loader-animation">
      <Lottie className="lottie" animationData={loaderAnimation} loop={true} />
    </div>
  );
}
