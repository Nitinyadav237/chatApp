import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastMessage = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  );
};
export default ToastMessage;
