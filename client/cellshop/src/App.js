import React, { useState, useEffect, useContext } from "react";
import Login from "./components/login";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  /*
  useEffect(() => {
    setUser(null);
  },[]);
  */

  return <>{!user ? <Login /> : <></>}</>;
}

export default App;
