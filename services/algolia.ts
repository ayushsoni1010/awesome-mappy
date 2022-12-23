import algoliaSearch from "algoliasearch/lite";
import algoliaSearchHelper from "algoliasearch-helper";

const applicationId: any = process.env.applicationId;
const adminKey: any = process.env.adminApiKey;

const algoliaClient = algoliaSearch(applicationId, adminKey);

const algoliaHelper = algoliaSearchHelper(algoliaClient, "dummy", {
  disjunctiveFacets: [
    "food_type",
    "dining_style",
    "price_range",
    "stars_count",
  ],
  hitsPerPage: 9,
  maxValuesPerFacet: 20,
  attributesToRetrieve: [
    "image_url",
    "name",
    "stars_count",
    "price_range",
    "reviews_count",
    "reserve_url",
    "food_type",
    "address",
    "city",
    "_geoloc",
  ],
});

export const getAlgoliaClient = () => algoliaClient;
export const getAlgoliaHelper = () => algoliaHelper;
