import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import { Provider } from "react-redux";
import { store } from "./store";

createRoot(document.getElementById("root")!).render(
  <>
    <Provider store={store}>
      <App />
    </Provider>
  </>,
);
