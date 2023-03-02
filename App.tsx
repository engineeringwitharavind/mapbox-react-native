import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import Geocoder from '@mapbox/mapbox-sdk/services/geocoding';
import { GeocodeFeature } from '@mapbox/mapbox-sdk/services/geocoding';
import Geolocation from 'react-native-geolocation-service';

const MAPBOX_TOKEN =
  'pk.eyJ1IjoiYXJhdmluZC1reXJvIiwiYSI6ImNsZDhobXBnOTAwNXUzbm53cjBrNG9hcmsifQ.UqTaW425cc4HhwpV_fQ82g';

MapboxGL.setAccessToken(MAPBOX_TOKEN);

const MapScreen = () => {
  const [marker, setMarker] = useState<number[] | null>([
    -122.406417, 37.785834,
  ]);
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<GeocodeFeature[]>([]);
  const [error, setError] = useState('');

  const cameraRef = useRef<MapboxGL.Camera>(null);

  const onSearchTextChange = (inputText: string) => {
    setSearchText(inputText);
    console.log('[searchText().input]', searchText);
  };

  // On Search results selection
  const onResultPress = (result: GeocodeFeature) => {
    setSearchText(result.place_name);
    setResults([]);
    console.log('[onResultPress().coordinates]', result.center);
    if (
      result.center &&
      Array.isArray(result.center) &&
      result.center.length >= 2
    ) {
      cameraRef.current?.flyTo([result.center[0], result.center[1]], 7000); // longitude and latitude along with animation duration
      setMarker(result.center);
    }
  };

  // Handle User locaiton
  useEffect(() => {
    const checkLocationPermission = async () => {
      if (
        Platform.OS === 'ios' ||
        (Platform.OS === 'android' && Platform.Version < 23)
      ) {
        return true;
      }
      const isGranted = await MapboxGL.requestAndroidLocationPermissions();
      return isGranted;
    };

    const handleUserLocation = async () => {
      const hasLocationPermission = await checkLocationPermission();
      if (hasLocationPermission) {
        Geolocation.getCurrentPosition(
          (position) => {
            const { longitude, latitude } = position.coords;
            console.log(
              '[handleUserLocation.Geolocation.coords]',
              position.coords
            );
            setMarker([longitude, latitude]);
            cameraRef.current?.flyTo([longitude, latitude]);
            console.log('[useEffect().marker.coordinates]', marker);
          },
          (error) => {
            console.log(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000,
          }
        );
      } else {
        console.log('Location permission not granted');
      }
    };

    handleUserLocation();
  }, []);

  // Handle Geocoder Search
  useEffect(() => {
    const searchPlaces = async () => {
      try {
        const geocodingClient = Geocoder({ accessToken: MAPBOX_TOKEN });
        const response = await geocodingClient
          .forwardGeocode({
            query: searchText,
            limit: 10,
          })
          .send();
        setResults(response.body?.features ?? []);
        console.log('[useEffect().searchPlaces().response]', response.body);
        setError('');
      } catch (error) {
        setError(
          'An error occurred while searching for places. Please try again later.'
        );
      }
    };

    if (searchText.length > 0) {
      searchPlaces();
    } else {
      setResults([]);
    }
  }, [searchText]);

  return (
    <View style={styles.container}>
      {marker && (
        <MapboxGL.MapView
          style={styles.map}
          styleURL={MapboxGL.StyleURL.Street}
          zoomEnabled
          scaleBarEnabled={false}
          logoEnabled={false}
        >
          <MapboxGL.PointAnnotation
            id='selectedLocation'
            coordinate={marker}
            title='Selected Location'
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.markerContainer}>
              <View style={styles.marker}>
                <View style={styles.markerInner} />
              </View>
            </View>
          </MapboxGL.PointAnnotation>
          <MapboxGL.Camera
            ref={cameraRef}
            zoomLevel={14}
            animationMode='easeTo'
          />
          {results.map((result) => (
            <MapboxGL.PointAnnotation
              key={result.id}
              id={result.id}
              coordinate={result.center}
              title={result.place_name}
              selected={false}
              onSelected={() => onResultPress(result)}
            />
          ))}
        </MapboxGL.MapView>
      )}
      <TextInput
        style={styles.searchBar}
        onChangeText={onSearchTextChange}
        value={searchText}
        placeholder='Search for a location'
      />
      {results.length > 0 && (
        <FlatList
          style={styles.resultsList}
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={() => onResultPress(item)}>
              <View style={styles.resultItem}>
                <Text style={styles.resultItemText}>{item.place_name}</Text>
                <Text style={styles.resultItemDescription}>
                  {item.properties.address}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        />
      )}
      {error.length > 0 && <Text>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'black',
  },
  markerInner: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: 'hotpink',
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    margin: 10,
    paddingHorizontal: 10,
  },
  resultsList: {
    backgroundColor: '#fff',
    maxHeight: 200,
    marginHorizontal: 10,
    borderRadius: 5,
    overflow: 'hidden',
    elevation: 1,
  },
  resultItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  resultItemText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultItemDescription: {
    fontSize: 12,
    color: '#666',
  },
});

export default MapScreen;
