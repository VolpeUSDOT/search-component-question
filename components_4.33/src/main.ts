import './style.css'

import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js'
import '@arcgis/map-components/components/arcgis-map'
import '@arcgis/map-components/components/arcgis-search'

const arcgisMap = document.querySelector('arcgis-map')
await arcgisMap.componentOnReady()


let railLayer = new FeatureLayer({
    url: 'https://services.arcgis.com/xOi1kZaI0eWDREZv/arcgis/rest/services/NTAD_North_American_Rail_Network_Lines/FeatureServer/0'
})

arcgisMap.map?.add(railLayer)
    

const search = document.querySelector('arcgis-search')
await search.componentOnReady()
    
    
search.sources = [
    {
        layer: railLayer,
        searchFields: ['SUBDIV'],
        displayField: 'SUBDIV',
        exactMatch: false,
        minSuggestCharacters: 4,
        outFields: ['SUBDIV'],
        name: 'Train Districts',
        placeholder: 'example: MBTA'
    }
]

search.addEventListener('arcgisSelectResult', async () => {
    console.log('selected result: ', search.selectedResult)
})
