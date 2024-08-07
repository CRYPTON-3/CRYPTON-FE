import { useEffect } from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  useEffect(() => {
    window.electron.ipcRenderer.on("file-opened", (path) => {
      console.log("Opened file path:", path);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners("file-opened");
    };
  }, []);

  return (
    <>
      <div>랜딩페이지</div>
      <Link to="/main">메인 페이지로</Link>
    </>
  );
}

export default LandingPage;
