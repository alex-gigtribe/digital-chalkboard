// src/App.tsx
import { DepotProvider } from "./components/context/DepotContext";
import { Layout } from "./layout/Layout";
import { Dashboard } from "./pages/Dashboard";

export default function App() {
  return (
    <DepotProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </DepotProvider>
  );
}
