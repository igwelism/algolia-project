const algoliasearch = require('algoliasearch')
const client = algoliasearch("HWYFBI1EXW", "02f6b33f0ef77f25edccbd77ae2ca079")
const index = client.initIndex("restaurant_relevance")

index.getSettings().then(result => console.log(result))
// index.setSettings( {
//     searchableAttributes: ["address,area", "food_type", "name", "_geoloc", "price"]
// })
// index.setSettings( {
//     attributesForFaceting: ["food_type"]
// })
// index.search("john").then(result => {
//     console.log(result.nbHits)

//     for(const hit of result.hits) {
//         console.log(hit)
//     }
// })