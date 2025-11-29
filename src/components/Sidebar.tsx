import React from 'react';

export default function Sidebar() {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-2">Layers & Tools</h2>
      <div className="space-y-3">
        <div>
          <label className="flex items-center gap-2">
            <input id="toggle-wms" type="checkbox" defaultChecked />
            <span className="text-sm">WMS Layer</span>
          </label>
        </div>
        <div>
          <button
            id="clear-aoi"
            className="px-3 py-1 bg-red-50 text-red-600 border rounded text-sm"
          >
            Clear all AOIs
          </button>
        </div>
      </div>
      <div className="pt-4 text-xs text-gray-600">
        Draw tools are on the map left of the map on desktop. Use them to create AOIs:
        polygons, rectangles, markers. AOIs persist in localStorage.
      </div>
    </div>
  );
}
