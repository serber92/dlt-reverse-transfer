import React from "react";
import logo from "../logo.svg";

export const HomePage = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Welcome to Reverse Transfer.</p>
        <a className="App-link" href="/auth-search">
          Student Search
        </a>
      </header>
    </div>
  );
};
