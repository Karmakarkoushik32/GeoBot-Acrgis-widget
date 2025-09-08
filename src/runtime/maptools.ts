import MapView from '@arcgis/core/views/MapView'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Basemap from '@arcgis/core/Basemap'
import Extent from '@arcgis/core/geometry/Extent'

export type Status = 'success' | 'fail'

/**
 * MapTools: Utility for ArcGIS MapView (zoom, pan, layers, basemaps)
 */
export class MapTools {
  private view: MapView

  constructor(view: MapView) {
    this.view = view
  }

  async zoomToLevel(zoom: number): Promise<Status> {
    if (zoom < 0 || zoom > 20) return 'fail'
    try { await this.view.goTo({ zoom }); return 'success' }
    catch { return 'fail' }
  }

  async zoomToScale(scale: number): Promise<Status> {
    try { await this.view.goTo({ scale }); return 'success' }
    catch { return 'fail' }
  }

  async zoomToExtent(extentArray: [number, number, number, number]): Promise<Status> {
    if (extentArray.length !== 4) return 'fail'
    try {
      const extent = new Extent({
        xmin: extentArray[0], ymin: extentArray[1],
        xmax: extentArray[2], ymax: extentArray[3],
        spatialReference: this.view.spatialReference
      })
      await this.view.goTo(extent)
      return 'success'
    } catch { return 'fail' }
  }

  async panToLayer(layer: FeatureLayer): Promise<Status> {
    try {
      const extent = await layer.queryExtent()
      await this.view.goTo(extent.extent, { animate: true })
      return 'success'
    } catch { return 'fail' }
  }

  listLayers(): Array<{ id: string; title: string }> {
    return this.view.map.layers.map(layer => ({ id: layer.id, title: layer.title || layer.id }))
  }

  toggleLayer(layerIdOrName: string): Status {
    const layer = this.view.map.layers.find(l => l.id === layerIdOrName || l.title === layerIdOrName)
    if (layer) { layer.visible = !layer.visible; return 'success' }
    return 'fail'
  }

  listBasemaps(): Array<{ id: string; title: string }> {
    return (this.view.map.allLayers.filter(l => l.type === "basemap") || [])
      .map(bm => ({ id: bm.id, title: bm.title || bm.id }))
  }

  switchBasemap(basemap: string | Basemap): Status {
    try {
      this.view.map.basemap = typeof basemap === 'string' ? Basemap.fromId(basemap) : basemap
      return 'success'
    } catch { return 'fail' }
  }

  toggleBasemap(basemapId: string): Status {
    const bmLayer = this.view.map.allLayers.find(l => l.id === basemapId)
    if (bmLayer) { bmLayer.visible = !bmLayer.visible; return 'success' }
    return 'fail'
  }
}
