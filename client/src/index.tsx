import ReactDOM from "react-dom/client";
import "./styles/global.scss";
import App from "./App";
import "./helpers/axios/interceptors.helper";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
