import React from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";

export default function App() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="w-80 border-r p-4 hidden md:block">
          <Sidebar />
        </aside>
        <main className="flex-1">
          <MapView />
        </main>
      </div>
    </div>
  );
}
