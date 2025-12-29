import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    api.get("/auth/me/").then((res) => setMe(res.data));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Dashboard</h2>
      {me ? <pre>{JSON.stringify(me, null, 2)}</pre> : "Loading..."}
    </div>
  );
}
