import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import { StyleSheet, View } from 'react-native';

const CustomCompassControl = ({ onPress }) => (
  <View style={styles.container}>
    <MapboxGL.PointAnnotation
      id='compass'
      coordinate={[0, 0]}
      anchor={{ x: 0.5, y: 0.5 }}
      onPress={onPress}
    >
      <MapboxGL.SymbolLayer
        id='compass-icon'
        style={{
          iconImage: 'compass',
          iconSize: 0.5,
          iconRotationAlignment: 'map',
          iconAllowOverlap: true,
        }}
      />
    </MapboxGL.PointAnnotation>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomCompassControl;
