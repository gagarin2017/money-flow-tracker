import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";

const el = document.getElementById("root") as HTMLElement;

const root = ReactDOM.createRoot(el);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
