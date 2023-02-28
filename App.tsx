import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import { Platform, StyleSheet, View } from 'react-native';
import { UserTrackingMode } from '@rnmapbox/maps/javascript/components/Camera';

export const MAPBOX_TOKEN =
  'pk.eyJ1IjoiYXJhdmluZC1reXJvIiwiYSI6ImNsZDhobXBnOTAwNXUzbm53cjBrNG9hcmsifQ.UqTaW425cc4HhwpV_fQ82g';

MapboxGL.setAccessToken(MAPBOX_TOKEN);

function MapView(): JSX.Element {
  const hasLocationPermission = async () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      return true;
    }
    const isGranted = await MapboxGL.requestAndroidLocationPermissions();
    return isGranted;
  };

  React.useEffect(() => {
    const task = async () => {
      await hasLocationPermission();
    };
    task();
  }, [false]);

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView
          style={styles.map}
          compassEnabled={true}
          logoEnabled={false}
        >
          <MapboxGL.UserLocation
            androidRenderMode={'compass'}
            visible={true}
            onUpdate={(location) => {
              console.log('[LocationView.coordinates]', location);
            }}
            showsUserHeadingIndicator={false}
          />
          <MapboxGL.Camera
            zoomLevel={5}
            followUserMode={UserTrackingMode.FollowWithHeading}
            followUserLocation
          />
        </MapboxGL.MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'tomato',
  },
  map: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
});

export default MapView;
