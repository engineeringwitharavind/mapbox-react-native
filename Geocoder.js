import React, { useState } from 'react';
import MapboxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import MapboxClient from '@mapbox/mapbox-sdk';
import { StyleSheet, TextInput, View } from 'react-native';

const Geocoder = ({ accessToken, onLocationSelected }) => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const client = MapboxClient({ accessToken: accessToken });
  const geocodingService = MapboxGeocoding(client);

  const handleSearch = async () => {
    if (query) {
      setSearching(true);
      const response = await geocodingService
        .forwardGeocode({
          query: query,
          autocomplete: false,
          limit: 5,
        })
        .send();
      const locations = response.body.features.map((f) => {
        return {
          name: f.place_name,
          center: f.center,
        };
      });
      setSearching(false);
      onLocationSelected(locations);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Search location...'
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  input: {
    height: 40,
    fontSize: 16,
  },
});

export default Geocoder;
