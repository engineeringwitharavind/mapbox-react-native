import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import { StyleSheet, View } from 'react-native';

const MAPBOX_TOKEN =
  'pk.eyJ1IjoiYXJhdmluZC1reXJvIiwiYSI6ImNsZDhobXBnOTAwNXUzbm53cjBrNG9hcmsifQ.UqTaW425cc4HhwpV_fQ82g';

MapboxGL.setAccessToken(MAPBOX_TOKEN);

function App(): JSX.Element {
  const [coordinates] = React.useState([78.9629, 20.5937]);

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView
          style={{ flex: 1 }}
          styleURL={'mapbox://styles/mapbox/streets-v12'}
          zoomEnabled
        >
          <MapboxGL.Camera zoomLevel={8} centerCoordinate={coordinates} />
          <MapboxGL.UserLocation />
        </MapboxGL.MapView>
      </View>
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'blue',
  },
  map: {
    flex: 1,
  },
});
