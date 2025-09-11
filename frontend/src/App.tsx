import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/context/AuthContext";
import { DepotProvider } from "./components/context/DepotContext";

import Dashboard from "./pages/Dashboard";
import Layout from "./layout/Layout";
import LoginModal from "./components/ui/LoginModal";
import DepotSelectorModal from "./components/ui/DepotSelectorModal";

function AppContent() {
  const { user } = useAuth();

  // ✅ If no user logged in → show login modal
  if (!user) {
    return <LoginModal />;
  }

  return (
    <DepotProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>

        {/* ✅ Show Depot Selector after login (if no depot chosen) */}
        <DepotSelectorModal />
      </Layout>
    </DepotProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
