import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw"; // plugin side-effect import
// images for leaflet markers (fixes missing icon issue with many bundlers)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const WMS_URL = "https://www.wms.nrw.de/geobasis/wms_nw_dop";

declare global {
  interface Window {
    L: any;
  }
}

export default function MapView() {
  const [mapObj, setMapObj] = useState<L.Map | null>(null);
  const wmsLayerRef = useRef<L.TileLayer.WMS | null>(null);

  // fix leaflet default icon paths
  useEffect(() => {
    (L.Icon.Default as any).mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow
    });
  }, []);

  useEffect(() => {
    if (!mapObj) return;

    // Add WMS as a TileLayer WMS
    const wms = (L.tileLayer as any).wms(WMS_URL, {
      layers: "nw_dop", // server-specific; if tiles don't appear, try removing this option
      format: "image/png",
      transparent: false,
      attribution: "© WMS NRW"
    }) as L.TileLayer.WMS;

    wms.addTo(mapObj);
    wmsLayerRef.current = wms;

    // Drawing: featureGroup to hold drawn items
    const drawnItems = new L.FeatureGroup();
    mapObj.addLayer(drawnItems);

    // @ts-ignore - Leaflet.Draw types not present for plugin: use any for control
    const drawControl = new (L.Control as any).Draw({
      draw: {
        polygon: true,
        polyline: false,
        rectangle: true,
        circle: false,
        marker: true
      },
      edit: {
        featureGroup: drawnItems
      }
    });
    mapObj.addControl(drawControl);

    // Load saved AOIs from localStorage
    const saved = localStorage.getItem("aois");
    if (saved) {
      try {
        const geo = JSON.parse(saved);
        L.geoJSON(geo).eachLayer((layer) => drawnItems.addLayer(layer));
      } catch (e) {
        console.warn("Failed to load saved AOIs", e);
      }
    }

    // On create, save
    mapObj.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;
      drawnItems.addLayer(layer);
      const geo = drawnItems.toGeoJSON();
      localStorage.setItem("aois", JSON.stringify(geo));
    });

    // On edit or delete, save
    mapObj.on("draw:edited draw:deleted", () => {
      const geo = drawnItems.toGeoJSON();
      localStorage.setItem("aois", JSON.stringify(geo));
    });

    // Wire sidebar controls (toggle WMS / clear AOIs)
    const toggle = document.getElementById("toggle-wms") as HTMLInputElement | null;
    if (toggle) {
      toggle.onchange = () => {
        if (toggle.checked) {
          if (wmsLayerRef.current && !mapObj.hasLayer(wmsLayerRef.current)) {
            wmsLayerRef.current.addTo(mapObj);
          }
        } else {
          if (wmsLayerRef.current && mapObj.hasLayer(wmsLayerRef.current)) {
            mapObj.removeLayer(wmsLayerRef.current);
          }
        }
      };
    }

    const clearBtn = document.getElementById("clear-aoi") as HTMLButtonElement | null;
    if (clearBtn) {
      clearBtn.onclick = () => {
        drawnItems.clearLayers();
        localStorage.removeItem("aois");
      };
    }

    return () => {
      mapObj.removeControl(drawControl);
      mapObj.off();
      if (mapObj.hasLayer(wms)) mapObj.removeLayer(wms);
    };
  }, [mapObj]);

  return (
    <MapContainer
      center={[51.1657, 10.4515]}
      zoom={6}
      style={{ height: "100vh", width: "100%" }}
      whenCreated={(m) => setMapObj(m)}
    >
      {/* OSM base layer */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
      {/* WMS is added dynamically in effect */}
    </MapContainer>
  );
}
