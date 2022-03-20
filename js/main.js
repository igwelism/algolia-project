let app = Vue.createApp({
    data() {
        return {
            keyUp:'',
            helper:'',
            filters: [],
            price:0
        }
    },
    mounted() {
        //Config
        var applicationID = 'HWYFBI1EXW';
        var apiKey = '02f6b33f0ef77f25edccbd77ae2ca079';
        var indexName = 'restaurant_relevance';
        var client = algoliasearch(applicationID, apiKey);
        this.helper = algoliasearchHelper(client, indexName, {
            disjunctiveFacets: ['food_type'], 
            hitsPerPage: 5000,
            maxValuesPerFacet: 5000
        });
        this.helper.on('result', function(content) {
            facetsValues = []
            this.restaurants = content.results.hits.length > 0 ? content.results.hits : 0
            this.totalResult = content.results.nbHits
            content.results.disjunctiveFacets.map(filter => {
                for (const [key, value] of Object.entries(filter.data)) {
                    facetsValues.push(key)
                  }
            })
            this.facetsValues = facetsValues
        });
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                this.helper.setQueryParameter('aroundLatLng', `${position.coords.latitude}, ${position.coords.longitude}`).search()
            }, 
            () => {
                this.helper.search();
            });
        } else { 
            console.log("Geolocation is not supported by this browser.")
            this.helper.search();
        }
    },
    watch: {
        filters(newFilter, oldFilter) {
            this.helper.on('result', function(content) {
                facetsValues = []
                this.restaurants = content.results.hits
                this.totalResult = content.results.nbHits
                content.results.disjunctiveFacets.map(filter => {
                    for (const [key, value] of Object.entries(filter.data)) {
                        facetsValues.push(key)
                      }
                })
                this.facetsValues = facetsValues
            });
            if(newFilter.length > 0) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        position => {
                        this.helper.setQueryParameter('aroundLatLng', `${position.coords.latitude}, ${position.coords.longitude}`)
                            .toggleRefine('food_type', newFilter[newFilter.length - 1]).search()
                    }, 
                    () => {
                        this.helper.toggleRefine('food_type', newFilter[newFilter.length - 1]).search()  
                    });
                } else { 
                    console.log("Geolocation is not supported by this browser.")
                    this.helper.toggleRefine('food_type', newFilter[newFilter.length - 1]).search()  
                }          
            } else {
                this.helper.clearRefinements().search()
            }
        },
        keyUp(newKeyUp, oldKeyUp) {
            this.helper.on('result', function(content) {
                facetsValues = []
                this.restaurants = content.results.hits
                this.totalResult = content.results.nbHits
                content.results.disjunctiveFacets.map(filter => {
                    for (const [key, value] of Object.entries(filter.data)) {
                        facetsValues.push(key)
                      }
                })
                this.facetsValues = facetsValues
            });
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                    this.helper.setQueryParameter('aroundLatLng', `${position.coords.latitude}, ${position.coords.longitude}`)
                        .setQuery(newKeyUp).search()
                }, 
                () => {
                    this.helper.setQuery(newKeyUp).search() 
                });
            } else { 
                console.log("Geolocation is not supported by this browser.")
                this.helper.setQuery(newKeyUp).search()  
            }          
        },
        price(newPrice, oldPrice) {
            this.helper.on('result', function(content) {
                facetsValues = []
                this.restaurants = content.results.hits
                this.totalResult = content.results.nbHits
                content.results.disjunctiveFacets.map(filter => {
                    for (const [key, value] of Object.entries(filter.data)) {
                        facetsValues.push(key)
                      }
                })
                this.facetsValues = facetsValues
            });

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                    this.helper.setQueryParameter('aroundLatLng', `${position.coords.latitude}, ${position.coords.longitude}`)
                        .setQueryParameter('filters', `price:0 TO ${newPrice}`).search()
                }, 
                () => {
                    this.helper.setQueryParameter('filters', `price:0 TO ${newPrice}`).search()
                });
            } else { 
                console.log("Geolocation is not supported by this browser.")
                this.helper.setQueryParameter('filters', `price:0 TO ${newPrice}`).search()
            }          
        }
    },
})
app.component('searchbar', {
    props: ['modelValue'],
    computed: {
        inputValue: {
            get() {
                return this.modelValue
            },
            set(value) {
                this.$emit('update:modelValue', value)
            }
        }
    },
    template: `
    <div class="searchbar">
    <form>
      <div class="inner-form">
        <div class="input-field first-wrap">
          <div class="svg-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
            </svg>
          </div>
          <input id="search" type="text" v-model="inputValue" placeholder="What are you searching for today?" />
        </div>
      </div>
    </form>
  </div>
    `
})
app.component('restaurant', {
    props: ['results'],
    template: `
        <div class="d-flex justify-content-between">
            <p class="card-title"><em>Total Hits: {{results.totalResult}}</em></p>
        </div>
        <hr />
        <div class="row row-cols-1 row-cols-md-2 g-4 scrollbar">
            <div v-if="results.restaurants == 0" class="col">
                <div class="card">
                    <p>No results found</p>
                </div>
            </div>
            <div v-if="results.restaurants != 0" v-for="(item, index) in results.restaurants" :key="index" class="col">
                <div class="card">
                    <div class="card-header">
                        <div class="d-flex flex-row">
                        <div class="mx-2"><h6 class="card-title">{{ item.name }}</h6></div>
                        <div class="mx-1"> | </div>
                        <div class="mx-2"><h6 class="cart-title"><i class="bi bi-geo-alt-fill"></i> {{ item.city }}</h6></div>
                        </div>
                    </div>
                    <img :src="item.image_url" class="card-img-top" alt="...">
                    <div class="card-body">
                        <div class="d-flex flex-row ">
                            <div class="mx-1"><p class="card-text"><i class="bi bi-cash"></i> {{ item.price_range }}</p></div>
                            <div class="mx-1"> | </div>
                            <div class="mx-1"><p class="card-text"><i class="bi bi-cup-fill"></i> {{item.dining_style}}</p></div>
                            <div class="mx-1"> | </div>
                            <div class="mx-1"><p class="card-text"><i class="bi bi-star-fill icon-green "></i> {{item.stars_count}}</p></div>
                        </div>
                            <div class="d-flex flex-row mt-2">
                            <div class="mx-1"><p class="card-text"><i class="bi bi-house-fill"></i> {{item.address}}</p></div>
                            <div class="mx-1"> | </div>
                            <div class="mx-1"><p class="card-text"><i class="bi bi-telephone-inbound-fill"></i> {{ item.phone_number }}</p></div>
                        </div>
                        <a type="button" class="btn btn-success mt-2" href="https://www.google.com/maps/" target="_blank">Get Directions</a>
                    </div>
                </div>
            </div>
        </div>
    `
})
app.component('food-type', {
    props: ['results','modelValue'],
    computed: {
        checkedNames: {
            get() {
                return this.modelValue
            },
            set(value) {
                this.$emit('update:modelValue', value)
            }
        }
    },
    template: `
        <div class="card scrollbar-side">
            <div class="card-body">
                <h5 class="card-title">Cuisine</h5>
                <p class="card-text">
                    <div v-for="(item, index) in results.facetsValues" :key="index" class="form-check">
                        <input class="form-check-input" type="checkbox" :value=item :id="item" v-model="checkedNames">
                        <label class="form-check-label" for="item">{{item}}</label>
                    </div>
                </p>
            </div>
        </div>
    `
})
app.component('price', {
    props: ['modelValue'],
    computed: {
        price: {
            get() {
                return this.modelValue
            },
            set(value) {
                this.$emit('update:modelValue', value)
            }
        }
    },
    template: `
        <div class="card mt-3">
            <div class="card-body">
                <h5 class="card-title">Price Range</h5>
                <p class="card-text">
                    <div class="d-flex flex-row">
                    <div class="mx-2"><p class="card-text">$0</p></div>
                    <div class="mx-1">  -  </div>
                    <div class="mx-2"><p class="cart-text">\${{price}}</p></div>
                    </div>
                    <input type="range" class="form-range" min="0" max="5" step="1" v-model="price">
                </p>
            </div>
        </div>
    `
})
app.mount('#app')