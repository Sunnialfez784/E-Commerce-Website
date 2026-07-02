import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Chart as ChartJS, registerables } from "chart.js";
import "./assets/css/tailwind.css";
import App from "./App";
import { SidebarProvider } from "./context/SidebarContext.jsx";
import ThemedSuspense from "./components/ThemedSuspense";
import { Windmill } from "@windmill/react-ui";
import windmillTheme from "./windmillTheme";

ChartJS.register(...registerables);

createRoot(document.getElementById("root")).render(
  <SidebarProvider>
    <Suspense fallback={<ThemedSuspense />}>
      <Windmill usePreferences theme={windmillTheme}>
        <App />
      </Windmill>
    </Suspense>
  </SidebarProvider>,
);
