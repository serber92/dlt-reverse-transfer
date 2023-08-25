import React from "react";
import { DataTable } from "./DataTable.js";
import { Selectors } from "./Selectors.js";

export const ListPage = () => {
  return (
    <div className="App">
      <div>
        <h2>🔧 Viewing Policy</h2>

        <Selectors />
      </div>
      <br />
      <div>
        <DataTable />
      </div>
    </div>
  );
};
