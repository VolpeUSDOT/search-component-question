import './style.css'

import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js'
import LayerSearchSource from '@arcgis/core/widgets/Search/LayerSearchSource.js'
import LocatorSearchSource from '@arcgis/core/widgets/Search/LocatorSearchSource.js'
import '@arcgis/map-components/components/arcgis-map'
import '@arcgis/map-components/components/arcgis-search'

const arcgisMap = document.querySelector('arcgis-map')
await arcgisMap.componentOnReady()

let railLayer = new FeatureLayer({
    url: 'https://services.arcgis.com/xOi1kZaI0eWDREZv/arcgis/rest/services/rail_lines_test/FeatureServer/0'
})

arcgisMap.map?.add(railLayer)

const search = document.querySelector('arcgis-search')
await search.componentOnReady()

const myLocatorSearchSource = new LocatorSearchSource({
    placeholder: 'example: MBTA',
    getSuggestions: (params) => {
        let query = railLayer.createQuery()
        query.outFields = ['SUBDIV']
        query.returnGeometry = false
        query.returnDistinctValues = true
        // query.geometry = view.extent
        query.where = `SUBDIV like '%${params.suggestTerm}%'`

        return railLayer.queryFeatures(query).then((featureSet) => {
            return featureSet.features.map((feature) => {
                return {
                    key: 'name',
                    text: feature.attributes['SUBDIV'],
                    sourceIndex: params.sourceIndex
                }
            })
        })
    },
    getResults: (params) => {
        let chosen = params.suggestResult.text.trim()
        console.log(chosen)
    }
})

search.sources = [myLocatorSearchSource]

// const myLayerSearchSoure = new LayerSearchSource({
//     layer: railLayer,
//     searchFields: ['SUBDIV'],
//     displayField: 'SUBDIV',
//     exactMatch: false,
//     minSuggestCharacters: 4,
//     outFields: ['SUBDIV'],
//     name: 'Train Districts',
//     placeholder: 'example: MBTA'
// })

// search.sources = [myLayerSearchSoure]

search.addEventListener('arcgisSelectResult', async () => {
    console.log('selected result: ', search.selectedResult)
})
