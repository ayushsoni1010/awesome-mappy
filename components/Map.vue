<template>
  <div class="py-8 px-8">
    <div
      style="height: 85vh !important"
      id="map"
      class="w-full rounded-xl overflow-hidden transform"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import mapboxgl, { LngLatLike, Map, Marker, Popup } from "mapbox-gl";
import { SearchResults } from "algoliasearch-helper";
import { getAlgoliaHelper } from "@/services/algolia";
import MapStore from "@/store/MapStore";

export default defineComponent({
  name: "MapBox",
  provide() {
    mapboxgl.accessToken = this.$config.MAPBOX_SECRET;
  },

  setup() {
    const algoliaHelper = getAlgoliaHelper();

    let hits: any = [];
    let map: Map;
    let lastClickedMarker: Element;

    const markers: Marker[] = [];
    const popup: Popup = new mapboxgl.Popup({
      closeOnClick: false,
      closeButton: false,
    });

    watch(
      () => MapStore.getState().currentObjectID,
      (currentObjectID) => {
        const hit = hits.find((hit: any) => hit.id === currentObjectID);
        onMarkerClick(hit.marker, hit);
      }
    );

    const flyToMarker = (marker: Marker) => {
      map.flyTo({
        center: marker.getLngLat(),
        zoom: 5,
        offset: [0, -600],
      });
    };

    const removePopup = () => {
      popup.remove();
    };

    const removeMarkers = () => {
      markers.forEach((marker) => marker.remove());
    };

    const addMarkers = async (results: SearchResults) => {
      const markersBounds = new mapboxgl.LngLatBounds();

      hits = results.hits;

      if (!hits.length) return;

      hits.forEach((hit: any) => {
        const hitCoords: LngLatLike = [hit.lng, hit.lat];

        const el = document.createElement("div");
        el.classList.add("marker");
        el.innerHTML = `<div
    class="w-44 h-auto p-2 pl-3 rounded-xl overflow-hidden shadow-md bg-gray-100"
  >
    <div class="text-sm font-medium">
      <p>${hit?.name}</p>
      <p class="text-xs text-gray-400 mt-1">
        ${hit?.designation}
      </p>
    </div>
  </div>`;

        // Custom marker element
        const marker = new mapboxgl.Marker(el).setLngLat(hitCoords).addTo(map);
        hit.marker = marker;

        el.addEventListener("click", () => onMarkerClick(marker, hit));

        markers.push(marker);
        markersBounds.extend(hitCoords);
      });

      map.fitBounds(markersBounds, { padding: 80, maxZoom: 15, linear: true });
    };

    const updateMarkerState = (marker: Marker) => {
      if (lastClickedMarker) {
        lastClickedMarker.classList.remove("marker-active");
      }

      const markerEl = marker.getElement();
      markerEl.classList.add("marker-active");

      lastClickedMarker = markerEl;
    };

    const onMarkerClick = (marker: Marker, hit: any) => {
      MapStore.updateObjectID(hit.id);

      updateMarkerState(marker);
      flyToMarker(marker);
    };

    const onResult = ({ results }: { results: SearchResults }) => {
      removePopup();
      removeMarkers();
      addMarkers(results);
    };

    onMounted(() => {
      map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        zoom: 15,
        scrollZoom: true,
      });

      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
        }),
        "bottom-left"
      );
      map.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        "bottom-left"
      );
      map.addControl(new mapboxgl.FullscreenControl(), "top-right");

      algoliaHelper.on("result", onResult);
    });
  },
});
</script>

<style lang="css">
.mapboxgl-canvas:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.mapboxgl-popup-content {
  border-radius: 0.75rem;
  padding: 1rem;
}

/* .mapboxgl-ctrl-group:not(:empty) {
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color),
    0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  border-radius: 0.75rem;
  padding: 0.5rem;
} */

/* .mapboxgl-ctrl-group button {
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
} */

/* .mapboxgl-ctrl-group button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
} */

/* .mapboxgl-ctrl-group button:focus:first-child,
.mapboxgl-ctrl-group button:focus:last-child,
.mapboxgl-ctrl-group button:focus:only-child {
  border-radius: 0.375rem;
}

.mapboxgl-ctrl button.mapboxgl-ctrl-zoom-out .mapboxgl-ctrl-icon {
  background-image: url("@/assets/images/icons/minus.svg");
}

.mapboxgl-ctrl button.mapboxgl-ctrl-zoom-in .mapboxgl-ctrl-icon {
  background-image: url("@/assets/images/icons/plus.svg");
}

.mapboxgl-ctrl button.mapboxgl-ctrl-geolocate .mapboxgl-ctrl-icon {
  background-image: url("@/assets/images/icons/location.svg");
}

.mapboxgl-ctrl button.mapboxgl-ctrl-fullscreen .mapboxgl-ctrl-icon {
  background-image: url("@/assets/images/icons/arrows-expand.svg");
}

.mapboxgl-ctrl button.mapboxgl-ctrl-shrink .mapboxgl-ctrl-icon {
  background-image: url("@/assets/images/icons/arrows-shrink.svg");
}

.mapboxgl-ctrl-group button + button {
  border-style: none;
}

.mapboxgl-ctrl-bottom-left .mapboxgl-ctrl {
  margin-bottom: 0.75rem;
  margin-left: 1.5rem;
}

.mapboxgl-ctrl-top-right .mapboxgl-ctrl {
  margin-top: 1.5rem;
  margin-right: 1.5rem;
} */

.mapboxgl-ctrl-attrib {
  display: none;
}

.marker {
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
}

.marker.marker-active:after {
  background: rgba(41, 199, 185, 1);
}

.marker:hover:before {
  opacity: 0.4;
}

.marker:before,
.marker:after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  border-radius: 9999px;
}

/* .marker:before {
  background-color: rgba(107, 114, 128, 1);
  opacity: 0.1;
  width: 3rem;
  height: 3rem;
}

.marker:after {
  background-color: rgba(17, 24, 39, 1);
  border-width: 3px;
  border-color: rgba(255, 255, 255, 1);
  width: 1.25rem;
  height: 1.25rem;
  border-color: #ffffff;
} */
</style>
