<template>
  <button
    class="w-fit hover:bg-gray-100 transition-colors rounded-xl p-2 focus:outline-none"
    @click="onClick"
  >
    <div
      class="w-56 h-auto px-2 py-2 rounded-xl overflow-hidden shadow-md bg-gray-100"
      :class="{ 'animate-pulse': !loaded }"
    >
      <div class="flex gap-2">
        <div>
          <img
            :src="item.image_url"
            :alt="item.name"
            class="object-cover rounded-full opacity-0 transition-opacity"
            :class="{ 'opacity-100': loaded }"
            @load="loaded = true"
          />
        </div>
        <div class="text-sm font-medium text-left">
          <p>{{ item.name }}</p>
          <p class="text-xs text-gray-400">
            {{ item.city }}
          </p>
        </div>
      </div>
    </div>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import StarIcon from "@/components/icons/StarIcon.vue";
import MapStore from "@/store/MapStore";

export interface IResultItem {
  id: string;
  name: string;
  username: string;
  city: string;
  email: string;
  designation: string;
  company: string;
  gender: string;
  image_url: string;
  lng: string;
  lat: string;
}

export default defineComponent({
  name: "ResultItem",

  components: {
    StarIcon,
  },

  props: {
    item: {
      type: Object as PropType<IResultItem>,
      required: true,
    },
  },

  setup(props) {
    const loaded = ref(false);

    const onClick = () => {
      MapStore.updateObjectID(props.item.id);
    };

    return { loaded, onClick };
  },
});
</script>

<style>
::-webkit-scrollbar {
  width: 7px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
