<template>
  <div>
    <AisInstantSearch v-bind:search-client="searchClient" index-name="spendify">
      <AisSearchBox />
      <AisHits>
        <template slot="item" slot-scope="{ item }">
          <h1><AisHighlight :hit="item" attribute="name" /></h1>
          <p><AisHighlight :hit="item" attribute="description" /></p>
        </template>
      </AisHits>
    </AisInstantSearch>
  </div>
</template>

<script lang="js">
import algoliasearch from "algoliasearch/lite";
import { AisInstantSearch, AisSearchBox, AisHits, AisHighlight } from 'vue-instantsearch';
import "instantsearch.css/themes/satellite-min.css";

export default {
    components: {
        AisInstantSearch,
        AisSearchBox, AisHits, AisHighlight
    },
    data() {
        return {
            searchClient: algoliasearch(
                this.$config.APPLICATION_SECRET,
                this.$config.ADMIN_SECRET
            ),
        };
    },
};
</script>

<style>
body {
  font-family: sans-serif;
  padding: 1em;
}
</style>
