const csv = require('csvtojson')
const manipulateCSV = require('./manipulate')
const algoliasearch = require('algoliasearch')
const client = algoliasearch("HWYFBI1EXW", "02f6b33f0ef77f25edccbd77ae2ca079")
const index = client.initIndex("restaurant_relevance")

// Upload Restaurant Json to Aloglia
// const restaurantList = require("./restaurants_list.json")
// index.saveObjects(restaurantList)

// // Process Additional csv and upload to Algolia
// manipulateCSV('restaurants_info.csv', 'new_restaurants_info.csv')
const restaurantInfo = 'new_restaurants_info.csv' 

 csv().fromFile(restaurantInfo).then(jsonObj => {
    for (const obj of jsonObj) {
        if(obj.objectID == '63718') {
            index.partialUpdateObject(obj).then(({ objectID }) => {
                console.log(objectID);
            }).catch(err => {
                // log error if any
                console.log(err)
            })
        }
        // index.partialUpdateObject(obj).then(({ objectID }) => {
        //     console.log(objectID);
        // }).catch(err => {
        //     // log error if any
        //     console.log(err)
        // })
    }
 }).catch(err => {
     // log error if any
     console.log(err)
 })

