<template>
  <div class="py-8 pl-8">
    <div
      id="map"
      class="w-full h-full rounded-xl overflow-hidden transform"
    ></div>

    <template v-show="false">
      <MapPopup :item="currentPopupItem" ref="popupEl" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import mapboxgl, { LngLatLike, Map, Marker, Popup } from "mapbox-gl";
import { SearchResults } from "algoliasearch-helper";
import { getAlgoliaHelper } from "../services/algolia";
import MapStore from "../store/MapStore";
import MapPopup from "./MapPopup.vue";

export default defineComponent({
  name: "RefinementList",

  components: {
    MapPopup,
  },
  provide() {
    mapboxgl.accessToken = this.$config.MAPBOX_SECRET;
  },
  setup() {
    const algoliaHelper = getAlgoliaHelper();

    const popupEl = ref<typeof MapPopup>();
    const currentPopupItem = ref({});

    let hits: any = [];
    let map: Map;
    let lastClickedMarker: Element;

    const markers: Marker[] = [];
    console.log(hits, 444);
    const popup: Popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 12,
      maxWidth: "200px",
    });

    watch(
      () => MapStore.getState().currentObjectID,
      (currentObjectID) => {
        const hit = hits.find((hit: any) => hit.objectID === currentObjectID);
        onMarkerClick(hit.marker, hit);
      }
    );

    const flyToMarker = (marker: Marker) => {
      map.flyTo({
        center: marker.getLngLat(),
        zoom: 15,
        offset: [0, -100],
      });
    };

    const updatePopup = (marker: Marker) => {
      if (popupEl.value) {
        popup
          .setLngLat(marker.getLngLat())
          .setDOMContent(popupEl.value.$el)
          .addTo(map);
      }
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
        const hitCoords: LngLatLike = [hit._geoloc.lng, hit._geoloc.lat];

        const el = document.createElement("div");
        el.classList.add("marker");

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
      currentPopupItem.value = hit;
      MapStore.updateObjectID(hit.objectID);
      updateMarkerState(marker);
      flyToMarker(marker);
      updatePopup(marker);
    };

    const onResult = ({ results }: { results: SearchResults }) => {
      removePopup();
      removeMarkers();
      addMarkers(results);
    };

    onMounted(() => {
      map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11?optimize=true",
        zoom: -5,
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

    return { popupEl, currentPopupItem };
  },
});
</script>

<style lang="css">
.mapboxgl-popup-content {
  border-radius: 0.75rem;
  padding: 1rem;
}

.mapboxgl-ctrl-group:not(:empty) {
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color),
    0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  border-radius: 0.75rem;
  padding: 0.5rem;
}

.mapboxgl-ctrl-group button {
  transition-property: background-color, border-color, color, fill, stroke;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
}

.mapboxgl-ctrl-group button:focus:first-child,
.mapboxgl-ctrl-group button:focus:last-child,
.mapboxgl-ctrl-group button:focus:only-child {
  border-radius: 0.375rem;
}

.mapboxgl-ctrl button.mapboxgl-ctrl-zoom-out .mapboxgl-ctrl-icon {
  background-image: url("../assets/images/icons/minus.svg");
}

.mapboxgl-ctrl button.mapboxgl-ctrl-zoom-in .mapboxgl-ctrl-icon {
  background-image: url("../assets/images/icons/plus.svg");
}

.mapboxgl-ctrl button.mapboxgl-ctrl-geolocate .mapboxgl-ctrl-icon {
  background-image: url("../assets/images/icons/location.svg");
}

.mapboxgl-ctrl button.mapboxgl-ctrl-fullscreen .mapboxgl-ctrl-icon {
  background-image: url("../assets/images/icons/arrows-expand.svg");
}

.mapboxgl-ctrl button.mapboxgl-ctrl-shrink .mapboxgl-ctrl-icon {
  background-image: url("../assets/images/icons/arrows-shrink.svg");
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
}

.mapboxgl-ctrl-attrib {
  display: none;
}

.marker {
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
}

.marker .marker-active:after {
  background: rgb(12, 16, 60);
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
  --tw-translate-x: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y))
    rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y))
    scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  --tw-translate-y: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y))
    rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y))
    scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  border-radius: 9999px;
}

.marker:before {
  background-color: #6b7280;
  opacity: 0.1;
  width: 3rem;
  height: 3rem;
}
.marker .marker-active:before {
  background-color: #6b7280;
  opacity: 0.1;
  width: 3rem;
  height: 3rem;
}

.marker:after {
  background-color: #111827;
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  width: 1.25rem;
  height: 1.25rem;
  border-color: #ffffff;
}
</style>