/* ============================================================
   MODERN WEBGIS – Peta Sebaran Tempat Ibadah Buddha
   Kota Pekanbaru | Leaflet.js
   ============================================================ */

/* ── COLORS ── */
var COLORS = {
  Vihara:    { fill: '#1a6b45', border: '#0d4a2e' },
  Kelenteng: { fill: '#c0392b', border: '#7b241c' },
  Cetiya:    { fill: '#d4ac0d', border: '#9a7d09' },
  default:   { fill: '#3b82f6', border: '#1e40af' }
};

function getTypeKey(jenis) {
  if (!jenis) return 'default';
  var j = jenis.trim().toLowerCase();
  if (j === 'vihara') return 'Vihara';
  if (j === 'kelenteng' || j === 'klenteng') return 'Kelenteng';
  if (j === 'cetiya' || j === 'ceitya' || j === 'citaya') return 'Cetiya';
  return 'default';
}

function getColor(jenis) {
  return COLORS[getTypeKey(jenis)] || COLORS.default;
}

/* ── SVG PIN ICONS (like reference image) ── */
var ICON_PATHS = {
  /* Buddhist stupa silhouette */
  Vihara: [
    '<line x1="15" y1="7" x2="15" y2="9.5" stroke="white" stroke-width="1.4" stroke-linecap="round"/>',
    '<circle cx="15" cy="6.5" r="1.2" fill="white"/>',
    '<ellipse cx="15" cy="10.2" rx="1.8" ry="0.7" fill="white"/>',
    '<path d="M10,18 Q10,11.5 15,11.5 Q20,11.5 20,18 Z" fill="white"/>',
    '<rect x="9" y="18" width="12" height="1.8" rx="0.4" fill="white"/>',
    '<rect x="7.5" y="19.8" width="15" height="1.8" rx="0.4" fill="white"/>',
    '<rect x="6" y="21.6" width="18" height="2.2" rx="0.4" fill="white"/>'
  ].join(''),

  /* Chinese pagoda silhouette */
  Kelenteng: [
    '<path d="M13,11.5 L15,9 L17,11.5 L19.5,13 L10.5,13 Z" fill="white"/>',
    '<rect x="13" y="13" width="4" height="1.5" fill="white"/>',
    '<path d="M10,14.5 L15,13 L20,14.5 L22,16.5 L8,16.5 Z" fill="white"/>',
    '<rect x="11" y="16.5" width="8" height="1.5" fill="white"/>',
    '<path d="M7.5,18 L15,16.5 L22.5,18 L24,20 L6,20 Z" fill="white"/>',
    '<rect x="10.5" y="20" width="9" height="5" rx="0.5" fill="white"/>',
    '<rect x="13" y="21.5" width="4" height="3.5" rx="0.5" fill="COLORFILL"/>'
  ],

  /* Hindu/Buddhist temple stepped pyramid */
  Cetiya: [
    '<polygon points="15,7 12.5,10.5 17.5,10.5" fill="white"/>',
    '<rect x="12.5" y="10.5" width="5" height="1.8" rx="0.4" fill="white"/>',
    '<rect x="10.5" y="12.3" width="9" height="1.8" rx="0.4" fill="white"/>',
    '<rect x="8.5" y="14.1" width="13" height="1.8" rx="0.4" fill="white"/>',
    '<rect x="7" y="15.9" width="16" height="2" rx="0.4" fill="white"/>',
    '<rect x="9" y="17.9" width="12" height="6" rx="0.5" fill="white"/>',
    '<path d="M13,23.9 L13,21 Q13,19.4 15,19.4 Q17,19.4 17,21 L17,23.9 Z" fill="COLORFILL"/>'
  ]
};

function createPinIcon(jenis) {
  var c = getColor(jenis);
  var typeKey = getTypeKey(jenis);
  var uid = typeKey + Math.random().toString(36).substr(2,5);

  var paths = '';
  if (typeKey === 'Vihara') {
    paths = ICON_PATHS.Vihara;
  } else if (typeKey === 'Kelenteng') {
    paths = ICON_PATHS.Kelenteng.join('').replace(/COLORFILL/g, c.fill);
  } else {
    paths = ICON_PATHS.Cetiya.join('').replace(/COLORFILL/g, c.fill);
  }

  var svg = '<div class="pin-wrapper"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 42" width="36" height="50">'
    + '<defs><filter id="sh' + uid + '" x="-30%" y="-20%" width="160%" height="160%">'
    + '<feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="rgba(0,0,0,0.35)"/>'
    + '</filter></defs>'
    /* White outline/border of pin */
    + '<path d="M15 1C7.3 1 1 7.3 1 15c0 11.5 14 26 14 26S29 26.5 29 15C29 7.3 22.7 1 15 1z"'
    + ' fill="white" filter="url(#sh' + uid + ')"/>'
    /* Colored fill */
    + '<path d="M15 3C8.4 3 3 8.4 3 15c0 10.5 12 24 12 24S27 25.5 27 15C27 8.4 21.6 3 15 3z"'
    + ' fill="' + c.fill + '"/>'
    /* Building icon */
    + paths
    + '</svg></div>';

  return L.divIcon({
    html: svg,
    className: 'custom-pin-marker type-' + typeKey.toLowerCase(),
    iconSize: [36, 50],
    iconAnchor: [18, 50],
    popupAnchor: [0, -52]
  });
}

/* ── DATA ── */
var allFeatures = json_Sebaran_Tridharma_4.features;

/* ── MAP INIT ── */
var map = L.map('map', {
  zoomControl: false,
  minZoom: 1, maxZoom: 20,
  attributionControl: false
}).fitBounds([[0.3818, 101.2356], [0.6960, 101.7727]]);

L.control.attribution({
  position: 'bottomright',
  prefix: '<a href="https://leafletjs.com" target="_blank">Leaflet</a>'
}).addTo(map);

/* ── BASE LAYERS ── */
var baseLayers = {
  carto_light: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    maxZoom: 20, subdomains: 'abcd',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
  }),
  osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
  })
};

baseLayers.carto_light.addTo(map);

/* ── PANES ── */
map.createPane('pane_admin_ar'); map.getPane('pane_admin_ar').style.zIndex = 401;
map.createPane('pane_admin_ln'); map.getPane('pane_admin_ln').style.zIndex = 402;
map.createPane('pane_markers'); map.getPane('pane_markers').style.zIndex = 403;

/* ── ADMIN LAYERS ── */
var layer_admin_ar = L.geoJson(json_ADMINISTRASIKECAMATAN_AR_50K_1, {
  pane: 'pane_admin_ar',
  interactive: false,
  style: function() {
    return { color: '#3b82f6', weight: 1.2, fillColor: '#3b82f6', fillOpacity: 0.07, opacity: 0.55 };
  }
}).addTo(map);

var layer_admin_ln = L.geoJson(json_ADMINISTRASI_LN_3, {
  pane: 'pane_admin_ln',
  interactive: false,
  style: function() {
    return { color: '#f97316', weight: 2.5, dashArray: '5,4', fillOpacity: 0, opacity: 0.85 };
  }
}).addTo(map);

/* ── MARKER LAYERS ── */
var markerLayer  = L.featureGroup([]);
var layerVihara    = L.featureGroup([]);
var layerKelenteng = L.featureGroup([]);
var layerCetiya    = L.featureGroup([]);

var statsTotal = 0, statsVihara = 0, statsKelenteng = 0, statsCetiya = 0;

allFeatures.forEach(function(f) {
  var p = f.properties;
  var lat = f.geometry.coordinates[1];
  var lng = f.geometry.coordinates[0];
  var typeKey = getTypeKey(p.jenis);
  var c = COLORS[typeKey] || COLORS.default;

  var marker = L.marker([lat, lng], {
    icon: createPinIcon(p.jenis),
    pane: 'pane_markers'
  });

  /* Modern popup */
  var gmapsUrl = 'https://www.google.com/maps?q=' + lat + ',' + lng;
  var popupHtml = '<div class="modern-popup">'
    + '<div class="popup-header">'
    + '<div class="popup-type-badge" style="background:' + c.fill + '18;color:' + c.fill + ';border:1px solid ' + c.fill + '44">'
    + '<span style="width:7px;height:7px;border-radius:50%;background:' + c.fill + ';display:inline-block;margin-right:4px"></span>'
    + typeKey
    + '</div>'
    + '<p class="popup-name">' + (p.nama || '-') + '</p>'
    + '</div>'
    + '<div class="popup-body">'
    + '<div class="popup-row">'
    + '<span class="popup-row-icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18"/><path d="M9 21V9"/></svg></span>'
    + '<span class="popup-row-text">' + (p.jenis || '-') + '</span>'
    + '</div>'
    + '<div class="popup-row">'
    + '<span class="popup-row-icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>'
    + '<span class="popup-row-text">' + (p.alamat || 'Alamat tidak tersedia') + '</span>'
    + '</div>'
    + '</div>'
    + '<div class="popup-footer">'
    + '<a class="gmaps-btn" href="' + gmapsUrl + '" target="_blank">'
    + '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
    + ' Lihat di Google Maps</a>'
    + '</div></div>';

  marker.bindPopup(popupHtml, { maxWidth: 300, className: 'modern-leaflet-popup' });

  /* Hover tooltip */
  marker.bindTooltip(p.nama || 'Tempat Ibadah', {
    direction: 'top', offset: [0, -52], sticky: false
  });

  marker._featureData = p;
  markerLayer.addLayer(marker);

  if (typeKey === 'Vihara')    { layerVihara.addLayer(marker); statsVihara++; }
  else if (typeKey === 'Kelenteng') { layerKelenteng.addLayer(marker); statsKelenteng++; }
  else                          { layerCetiya.addLayer(marker); statsCetiya++; }

  statsTotal++;
});

layerVihara.addTo(map);
layerKelenteng.addTo(map);
layerCetiya.addTo(map);

/* ── CONTROLS ── */
L.control.zoom({ position: 'topleft' }).addTo(map);
L.control.scale({ position: 'bottomleft', metric: true, imperial: false }).addTo(map);

/* Compass */
var CompassControl = L.Control.extend({
  options: { position: 'topright' },
  onAdd: function() {
    var div = L.DomUtil.create('div', 'compass-control leaflet-control');
    div.innerHTML = '<svg width="34" height="34" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">'
      + '<circle cx="25" cy="25" r="23" fill="none" stroke="#e2e8f0" stroke-width="1.5"/>'
      + '<polygon points="25,5 20,25 25,21 30,25" fill="#ef4444"/>'
      + '<polygon points="25,45 20,25 25,29 30,25" fill="#94a3b8"/>'
      + '<text x="25" y="13" text-anchor="middle" fill="#ef4444" font-size="8" font-weight="bold" font-family="Inter,sans-serif">U</text>'
      + '<text x="25" y="43" text-anchor="middle" fill="#64748b" font-size="7" font-family="Inter,sans-serif">S</text>'
      + '<text x="10" y="28" text-anchor="middle" fill="#64748b" font-size="7" font-family="Inter,sans-serif">B</text>'
      + '<text x="40" y="28" text-anchor="middle" fill="#64748b" font-size="7" font-family="Inter,sans-serif">T</text>'
      + '</svg>';
    L.DomEvent.disableClickPropagation(div);
    return div;
  }
});
new CompassControl().addTo(map);

/* Legend */
var LegendControl = L.Control.extend({
  options: { position: 'bottomright' },
  onAdd: function() {
    var div = L.DomUtil.create('div', 'legend-control leaflet-control');
    var mapIcon = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1e293b" stroke-width="2.2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>';
    div.innerHTML = '<div class="legend-title">' + mapIcon + ' Legenda</div>'
      + '<div class="legend-item"><span class="legend-dot" style="background:#1a6b45"></span> Vihara</div>'
      + '<div class="legend-item"><span class="legend-dot" style="background:#c0392b"></span> Kelenteng</div>'
      + '<div class="legend-item"><span class="legend-dot" style="background:#d4ac0d"></span> Citaya / Cetiya</div>'
      + '<div class="legend-item"><span class="legend-line" style="border-top:2px solid rgba(59,130,246,0.7);margin-top:5px"></span> Batas Kecamatan</div>'
      + '<div class="legend-item"><span class="legend-line" style="border-top:2.5px dashed #f97316;margin-top:5px"></span> Batas Administrasi</div>';
    L.DomEvent.disableClickPropagation(div);
    return div;
  }
});
new LegendControl().addTo(map);

/* Reset button */
var ResetBtn = L.Control.extend({
  options: { position: 'topleft' },
  onAdd: function() {
    var div = L.DomUtil.create('div', 'map-btn-control leaflet-control');
    div.title = 'Reset Tampilan';
    div.style.marginTop = '6px';
    div.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>';
    L.DomEvent.on(div, 'click', function(e) {
      L.DomEvent.stopPropagation(e);
      map.fitBounds([[0.3818, 101.2356], [0.6960, 101.7727]]);
    });
    L.DomEvent.disableClickPropagation(div);
    return div;
  }
});
new ResetBtn().addTo(map);

/* Fit data button */
var FitBtn = L.Control.extend({
  options: { position: 'topleft' },
  onAdd: function() {
    var div = L.DomUtil.create('div', 'map-btn-control leaflet-control');
    div.title = 'Zoom ke Semua Data';
    div.style.marginTop = '4px';
    div.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';
    L.DomEvent.on(div, 'click', function(e) {
      L.DomEvent.stopPropagation(e);
      if (markerLayer.getBounds().isValid()) map.fitBounds(markerLayer.getBounds(), { padding: [40,40] });
    });
    L.DomEvent.disableClickPropagation(div);
    return div;
  }
});
new FitBtn().addTo(map);

/* ── STATS ── */
function updateStats() {
  document.getElementById('stat-total').textContent = statsTotal;
  document.getElementById('stat-vihara').textContent = statsVihara;
  document.getElementById('stat-kelenteng').textContent = statsKelenteng;
  document.getElementById('stat-cetiya').textContent = statsCetiya;
}

/* ── LAYER TOGGLES ── */
function wireToggle(id, layer) {
  var cb = document.getElementById(id);
  if (!cb) return;
  cb.addEventListener('change', function() {
    if (this.checked) map.addLayer(layer); else map.removeLayer(layer);
  });
}

wireToggle('toggle-admin-ar', layer_admin_ar);
wireToggle('toggle-admin-ln', layer_admin_ln);
wireToggle('toggle-vihara',    layerVihara);
wireToggle('toggle-kelenteng', layerKelenteng);
wireToggle('toggle-cetiya',    layerCetiya);

/* ── BASEMAP SWITCH ── */
function switchBasemap(key) {
  Object.values(baseLayers).forEach(function(bl) { map.removeLayer(bl); });
  baseLayers[key].addTo(map);
  document.querySelectorAll('.basemap-item').forEach(function(el) {
    el.classList.toggle('active', el.dataset.bm === key);
  });
}

document.querySelectorAll('.basemap-item').forEach(function(el) {
  el.addEventListener('click', function() { switchBasemap(el.dataset.bm); });
});

/* ── SEARCH ── */
var searchInput  = document.getElementById('search-input');
var searchRes    = document.getElementById('search-results');
var searchClear  = document.getElementById('search-clear');

searchInput.addEventListener('input', function() {
  var q = this.value.trim().toLowerCase();
  searchClear.classList.toggle('visible', q.length > 0);
  if (q.length < 2) { searchRes.classList.remove('visible'); searchRes.innerHTML = ''; return; }

  var matches = allFeatures.filter(function(f) {
    var p = f.properties;
    return (p.nama  && p.nama.toLowerCase().includes(q))
        || (p.jenis && p.jenis.toLowerCase().includes(q))
        || (p.alamat && p.alamat.toLowerCase().includes(q));
  });

  if (!matches.length) {
    searchRes.innerHTML = '<div class="no-results">Tidak ada hasil ditemukan</div>';
  } else {
    searchRes.innerHTML = matches.slice(0, 8).map(function(f) {
      var p = f.properties;
      var c = getColor(p.jenis);
      var lat = f.geometry.coordinates[1], lng = f.geometry.coordinates[0];
      return '<div class="search-result-item" data-lat="' + lat + '" data-lng="' + lng + '">'
        + '<span class="sri-dot" style="background:' + c.fill + '"></span>'
        + '<div class="sri-info">'
        + '<div class="sri-name">' + p.nama + '</div>'
        + '<div class="sri-sub">' + p.jenis + ' · ' + (p.alamat || '').substring(0, 38) + '</div>'
        + '</div></div>';
    }).join('');
  }

  searchRes.classList.add('visible');
  searchRes.querySelectorAll('.search-result-item').forEach(function(item) {
    item.addEventListener('click', function() {
      map.setView([parseFloat(item.dataset.lat), parseFloat(item.dataset.lng)], 17, { animate: true });
      searchRes.classList.remove('visible');
      searchInput.value = '';
      searchClear.classList.remove('visible');
    });
  });
});

searchClear.addEventListener('click', function() {
  searchInput.value = '';
  searchRes.classList.remove('visible');
  searchClear.classList.remove('visible');
});

/* ── ACTION BUTTONS ── */
document.getElementById('btn-fit').addEventListener('click', function() {
  if (markerLayer.getBounds().isValid()) map.fitBounds(markerLayer.getBounds(), { padding: [40,40] });
});

document.getElementById('btn-reset').addEventListener('click', function() {
  map.fitBounds([[0.3818, 101.2356], [0.6960, 101.7727]]);
});

/* ── SIDEBAR TOGGLE ── */
var sidebar       = document.getElementById('sidebar');
var sidebarToggle = document.getElementById('sidebar-toggle');
var mapDiv        = document.getElementById('map');

sidebarToggle.addEventListener('click', function() {
  sidebar.classList.toggle('collapsed');
  sidebarToggle.classList.toggle('collapsed');
  mapDiv.classList.toggle('sidebar-collapsed');
  setTimeout(function() { map.invalidateSize(); }, 360);
  sidebarToggle.innerHTML = sidebar.classList.contains('collapsed')
    ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"><polyline points="9 18 15 12 9 6"/></svg>'
    : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"><polyline points="15 18 9 12 15 6"/></svg>';
});

/* ── INIT ── */
updateStats();
