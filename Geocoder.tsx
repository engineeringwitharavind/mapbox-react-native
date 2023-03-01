import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { GeocodeQueryType } from '@mapbox/mapbox-sdk/services/geocoding';
import { Feature } from 'geojson';
import { MAPBOX_TOKEN } from './App';
