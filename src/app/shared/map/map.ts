import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  AfterViewInit,
  SimpleChanges,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';

export interface MapPin {
  id: string;
  label: string;
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './map.html',
})
export class MapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() pins: MapPin[] = [];

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  private map: any;
  private markers: any[] = [];

  searchQuery = '';

  get filteredPins(): MapPin[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return [];
    return this.pins.filter(p => p.label.toLowerCase().includes(q));
  }

  async ngAfterViewInit(): Promise<void> {
    await this.initMap();

    // Force Leaflet to re-calculate its size once the surrounding
    // grid/flex container has finished laying out. Without this,
    // Leaflet measures the container too early and renders a
    // half-sized / split map.
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pins'] && this.map) {
      this.renderPinMarkers();
    }
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }

  private async initMap(): Promise<void> {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    this.map = L.map(this.mapContainer.nativeElement, {
      center: [4.0, 109.0],
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(this.map);

    this.renderPinMarkers();
  }

  private renderPinMarkers(): void {
    this.markers.forEach((m) => m.remove());
    this.markers = [];

    if (!this.pins?.length) return;

    this.pins.forEach((pin) => {
      const marker = L.marker([pin.lat, pin.lng], {
        title: pin.label,
      }).addTo(this.map);

      marker.bindTooltip(
        `<div class="map-tooltip">
          <strong>${pin.label}</strong>
          <span>${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)}</span>
        </div>`,
        { permanent: false, direction: 'top', offset: [0, -10] }
      );

      marker.bindPopup(
        `<div style="font-family:sans-serif;min-width:140px;padding:2px 0">
          <div style="font-weight:600;color:#0f172a;margin-bottom:4px">${pin.label}</div>
          <div style="font-size:11px;color:#64748b">
            <div>Lat: ${pin.lat.toFixed(6)}</div>
            <div>Lng: ${pin.lng.toFixed(6)}</div>
          </div>
        </div>`,
        { closeButton: false, maxWidth: 200 }
      );

      this.markers.push(marker);
    });

    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.3));
    }
  }

  selectPin(pin: MapPin): void {
    this.map.setView([pin.lat, pin.lng], 13, { animate: true });
    const idx = this.pins.findIndex(p => p.id === pin.id);
    if (idx !== -1) this.markers[idx]?.openPopup();
    this.searchQuery = pin.label;
  }

  clearSearch(): void {
    this.searchQuery = '';
  }
}