import './style.css'

import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js'
import LayerSearchSource from '@arcgis/core/widgets/Search/LayerSearchSource.js'
import '@arcgis/map-components/components/arcgis-map'
import '@arcgis/map-components/components/arcgis-search'

const arcgisMap = document.querySelector('arcgis-map')

arcgisMap.addEventListener('arcgisViewReadyChange', (event) => {
    let MapComponent = event.target

    // ADD THE LAYER
    let railLayer = new FeatureLayer({
        url: 'https://services.arcgis.com/xOi1kZaI0eWDREZv/arcgis/rest/services/NTAD_North_American_Rail_Network_Lines/FeatureServer/0'
    })
    MapComponent.map?.add(railLayer)

    const search = document.querySelector('arcgis-search')
    //await search.componentOnReady();

    search.sources.add({
        layer: railLayer,
        placeholder: 'MBTA',
        searchFields: ['SUBDIV'],
        displayField: 'SUBDIV',
        name: 'Subdiv',
        minSuggestCharacters: 4,
        getSuggestions: (params) => {
            let query = railLayer.createQuery()
            query.outFields = ['SUBDIV']
            query.returnGeometry = false
            query.returnDistinctValues = true
            query.where = `SUBDIV like '%${params.suggestTerm}%'`
            return railLayer.queryFeatures(query).then((featureSet) => {
                let myresult = featureSet.features.map((feature) => {
                    return {
                        key: 'name',
                        text: feature.attributes['SUBDIV'],
                        sourceIndex: params.sourceIndex
                    }
                })
                return myresult
            })
        },
        getResults: (params) => {
            // ****** if you look in the console you will see it always returns the first item
            console.log(`Did you really choose: ${params.suggestResult.text}?`)
        }
    })


    search.addEventListener('arcgisSelectResult', async () => {
      console.log('arcgisSelectResult')
    })


})
