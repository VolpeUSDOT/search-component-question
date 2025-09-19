import './style.css'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js'
import Search from '@arcgis/core/widgets/Search.js'
import SearchSource from '@arcgis/core/widgets/Search/SearchSource.js'

const theMap = new Map({
    basemap: 'gray-vector'
})

let railLayer = new FeatureLayer({
    url: 'https://services.arcgis.com/xOi1kZaI0eWDREZv/arcgis/rest/services/NTAD_North_American_Rail_Network_Lines/FeatureServer/0'
})

theMap.add(railLayer)

const view = new MapView({
    container: 'viewDiv',
    map: theMap,
    center: [-71.2, 42.36],
    zoom: 10
})


const mySearchSource = new SearchSource({
    placeholder: 'example: MBTA',
    getSuggestions: (params) => {
        let query = railLayer.createQuery()
        query.outFields = ['SUBDIV']
        query.returnGeometry = false
        query.returnDistinctValues = true
        query.geometry = view.extent
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

const searchWidget = new Search({
    view: view,
    sources: [mySearchSource],
    includeDefaultSources: false
})

// Add the search widget to the top left corner of the view
view.ui.add(searchWidget, {
    position: 'top-right'
})
