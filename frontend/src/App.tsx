import { DepotProvider } from "./components/context/DepotContext";
import { Layout } from "./layout/Layout";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <DepotProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </DepotProvider>
  );
}

export default App;
