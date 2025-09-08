/** @jsx jsx */
import { React, AllWidgetProps, jsx } from 'jimu-core'
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'

export default function MyWidget(props: AllWidgetProps<any>) {
  const [jimuMapView, setJimuMapView] = React.useState<JimuMapView>(null)

  const addLayer = () => {
    if (!jimuMapView) return

    const layer = new FeatureLayer({
      url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3",
      outFields: ["*"]
    })

    jimuMapView.view.map.add(layer)
    console.log("✅ Layer added")
  }

  return (
    <div style={{ padding: 10 }}>
      <h3>My Custom Widget</h3>
      <button onClick={addLayer}>Add Census Layer</button>

      <JimuMapViewComponent
        useMapWidgetId={props.useMapWidgetIds?.[0]}
        onActiveViewChange={jmv => setJimuMapView(jmv)}
      />
    </div>
  )
}
