import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { setupStore } from "./store";

const el = document.getElementById("root") as HTMLElement;

const root = ReactDOM.createRoot(el);

root.render(
  <Provider store={setupStore()}>
    <App />
  </Provider>
);
