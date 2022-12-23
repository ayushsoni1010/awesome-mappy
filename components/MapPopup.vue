<template>
  <div
    class="w-56 h-auto px-2 py-3 rounded-xl overflow-hidden shadow-md bg-gray-100"
    :class="{ 'animate-pulse': !loaded }"
  >
    <div class="flex gap-4 items-center">
      <div>
        <img
          :src="item.image_url"
          :alt="item.name"
          class="object-cover rounded-full opacity-0 transition-opacity"
          :class="{ 'opacity-100': loaded }"
          @load="loaded = true"
        />
      </div>
      <div class="text-sm font-medium mt-4">
        <p>{{ item.name }}</p>
        <p class="text-xs text-gray-400 mt-2">
          {{ item.city }}, {{ item.skills }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { IResultItem } from "./ResultItem.vue";

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IResultItem>,
      required: true,
    },
  },

  setup() {
    const loaded = ref(false);
    return {
      loaded,
    };
  },
});
</script>
