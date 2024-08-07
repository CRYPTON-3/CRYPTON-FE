import FileDetailsPage from "@renderer/pages/FileDetails";
import GroupDetailsPage from "@renderer/pages/GroupDetails";
import LandingPage from "@renderer/pages/Landing";
import MainPage from "@renderer/pages/Main";
import MyPage from "@renderer/pages/MyPage";
import { Route, HashRouter as Router, Routes } from "react-router-dom";

function Routers() {
  return (
    <Router>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/group/:id" element={<GroupDetailsPage />} />
        <Route path="/file/:id" element={<FileDetailsPage />} />
        <Route path="/my-page" element={<MyPage />} />
      </Routes>
    </Router>
  );
}

export default Routers;
