import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  const [state, setState] = useState<any>([]);

  useEffect(() => {
    window.electron.ipcRenderer.on("file-opened", (path) => {
      console.log("Opened file path:", path);
      setState((prev) => [...prev, path]);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners("file-opened");
    };
  }, []);

  const t = () => {
    setState([1, 2, 3]);
  };

  return (
    <div>
      랜딩페이지
      <div>{JSON.stringify(state)}</div>
      <button type="button" onClick={t}>
        123
      </button>
      <Link to="/main">메인 페이지로</Link>
    </div>
  );
}

export default LandingPage;
