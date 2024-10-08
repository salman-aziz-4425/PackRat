import {
  getShapeSourceBounds,
  isLineString,
  isPolygonOrMultiPolygon,
  processShapeData,
  isPoint,
} from '../utils/mapFunctions';
import { API_URL } from '@packrat/config';
import { useState, useEffect } from 'react';

type Feature = Record<string, any>;

interface MapPreviewData {
  isPoint: boolean;
  uri: string;
}

interface ImageShape {
  type: string;
  features: Feature[];
}

const useProcessedShape = (shape) => {
  const [processedShape, setProcessedShape] = useState(null);

  useEffect(() => {
    const processed = processShapeData(shape);
    setProcessedShape(processed);
  }, [shape]);

  return processedShape;
};

const useMapPreviewData = (shape, processedShape) => {
  const [mapPreviewData, setMapPreviewData] = useState<MapPreviewData | null>(
    null,
  );

  useEffect(() => {
    if (!processedShape) return;

    const lineProperties = {
      stroke: '#16b22d',
      'stroke-width': 4,
      'stroke-opacity': 1,
    };
    const pointProperties = {
      'marker-color': '#16b22d',
    };

    if (isLineString(shape)) {
      shape.features[0].properties = lineProperties;
    }

    const imageShape: ImageShape = { type: 'FeatureCollection', features: [] };

    const polygonObj = {
      ...shape.features[0],
      geometry: {
        type: shape.features[0].geometry.type,
        coordinates: [shape.features[0].geometry.coordinates[0]],
      },
    };

    if (isPolygonOrMultiPolygon(shape)) {
      imageShape.features.push([shape.features[0].geometry.coordinates[0]]);
    } else {
      imageShape.features.push(shape.features[0]);
    }

    processedShape.features.forEach((feature) => {
      if (feature.properties.meta == 'end') {
        feature.properties = pointProperties;
        imageShape.features.push(feature);
      }
    });

    const urlEncodedImageShapeGeoJSON = encodeURIComponent(
      JSON.stringify(imageShape, null, 0),
    );

    let bounds = getShapeSourceBounds(shape);
    if (Array.isArray(bounds[0]) && Array.isArray(bounds[1])) {
      bounds = [bounds[0].concat(bounds[1])];
    }

    const {
      coordinates: [lng, lat],
    } = shape.features[0].geometry;

    const mapPreviewEndpoint = `${API_URL}/mapPreview`;

    const data = {
      isPoint: isPoint(shape),
      uri: isPoint(shape)
        ? `${mapPreviewEndpoint}/pin-s+db4848(${lng},${lat})/${lng},${lat},8.63,0/900x400`
        : `${mapPreviewEndpoint}/geojson(${urlEncodedImageShapeGeoJSON})/[${bounds.join(
            ',',
          )}]/900x400?padding=50,30,30,30`,
    };

    setMapPreviewData(data);
  }, [shape, processedShape]);

  return mapPreviewData;
};

export { useProcessedShape, useMapPreviewData };