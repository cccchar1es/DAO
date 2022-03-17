import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { useWallet, UseWalletProvider } from "use-wallet";
import Home from "./pages/Home.js";
import Create from "./pages/Create";
import Dao from "./pages/Dao";
import Voting from "./pages/Voting";
import Roadmap from "./pages/Roadmap";
import Intro from "./pages/Intro";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/create" element={<Create />} />
      <Route path="/dao/:addr" element={<Dao />} />
    </Routes>
  );
}

export default App;
