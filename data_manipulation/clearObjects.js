const algoliasearch = require('algoliasearch')
const client = algoliasearch("HWYFBI1EXW", "02f6b33f0ef77f25edccbd77ae2ca079")
const index = client.initIndex("restaurant_relevance")

index.clearObjects()