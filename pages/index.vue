<template>
  <div
    class="w-screen h-screen bg-gray-100 bg-background bg-cover bg-no-repeat bg-top"
  >
    <div
      class="w-full h-full overflow-hidden rounded-4xl bg-white bg-opacity-30 border border-white border-opacity-60"
    >
      <div
        class="w-full h-full bg-white rounded-4xl shadow-container flex flex-col overflow-hidden transform"
      >
        <SearchBar />
        <Map />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SearchBar from "@/components/SearchBar.vue";
import Map from "@/components/Map.vue";

export default Vue.extend({
  name: "IndexPage",
  components: {
    SearchBar,
    Map,
  },
});
</script>
