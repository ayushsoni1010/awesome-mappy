import algoliaSearch from "algoliasearch/lite";
import algoliaSearchHelper from "algoliasearch-helper";

const applicationId: any = process.env.applicationId;
const adminKey: any = process.env.adminApiKey;

const algoliaClient = algoliaSearch(applicationId, adminKey);

const algoliaHelper = algoliaSearchHelper(algoliaClient, "people", {
  disjunctiveFacets: ["city", "username", "skills"],
  hitsPerPage: 7,
  maxValuesPerFacet: 20,
  attributesToRetrieve: [
    "id",
    "name",
    "username",
    "city",
    "email",
    "designation",
    "gender",
    "image_url",
    "skills",
    "color",
    "date",
    "_geoloc",
  ],
});

export const getAlgoliaClient = () => algoliaClient;
export const getAlgoliaHelper = () => algoliaHelper;
