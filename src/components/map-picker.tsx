"use client";
import { useEffect, useRef } from "react";
import type { Map as LMap, Marker } from "leaflet";

export type LatLng = { lat: number; lng: number };

const pinHtml = `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:#5b3cc4;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>`;

/**
 * Mapa do OpenStreetMap (grátis, sem chave). Com `onPick`, tocar no mapa ou arrastar o marcador escolhe o ponto.
 * Sem `onPick`, só mostra o local.
 */
export function MapPicker({ value, onPick, height = 260, zoom = 16 }: { value: LatLng | null; onPick?: (p: LatLng) => void; height?: number; zoom?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<LMap | null>(null);
  const marker = useRef<Marker | null>(null);
  const pickRef = useRef(onPick);
  pickRef.current = onPick;

  useEffect(() => {
    let cancelled = false;
    void import("leaflet").then((L) => {
      if (cancelled || !box.current || map.current) return;
      const start = value ?? { lat: -15.78, lng: -47.93 }; // centro do Brasil quando ainda não há ponto
      const m = L.map(box.current, { zoomControl: true, attributionControl: true }).setView([start.lat, start.lng], value ? zoom : 4);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "&copy; OpenStreetMap" }).addTo(m);
      const icon = L.divIcon({ html: pinHtml, className: "", iconSize: [28, 28], iconAnchor: [14, 28] });
      const mk = L.marker([start.lat, start.lng], { icon, draggable: !!pickRef.current, opacity: value ? 1 : 0 }).addTo(m);
      mk.on("dragend", () => {
        const p = mk.getLatLng();
        pickRef.current?.({ lat: p.lat, lng: p.lng });
      });
      m.on("click", (e) => {
        if (!pickRef.current) return;
        mk.setLatLng(e.latlng).setOpacity(1);
        pickRef.current({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
      map.current = m;
      marker.current = mk;
    });
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // quando o ponto muda por fora (localização, CEP), move o mapa
  useEffect(() => {
    if (!value || !map.current || !marker.current) return;
    marker.current.setLatLng([value.lat, value.lng]).setOpacity(1);
    map.current.setView([value.lat, value.lng], Math.max(map.current.getZoom(), zoom));
  }, [value?.lat, value?.lng]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={box} style={{ height }} className="w-full overflow-hidden rounded-xl border border-border" role="application" aria-label="Mapa do endereço" />;
}
