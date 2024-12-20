import { Trip } from '../../drizzle/methods/trip';

/**
 * Retrieves a trip by its ID and returns the trip details.
 * @param {PrismaClient} prisma - Prisma client.
 * @param {string} tripId - The ID of the trip.
 * @return {Promise<object>} A promise that resolves to the trip details.
 */
export const getTripByIdService = async (tripId: string): Promise<object> => {
  try {
    const tripClass = new Trip();
    const trip = await tripClass.findById(tripId);
    if (!trip) {
      throw new Error('Trip cannot be found');
    }
    const packs = {
      ...trip.packs,
      items: trip.packs?.itemPacks?.map((itemPack) => itemPack.item),
    };
    const geoJSON = trip.tripGeojsons?.map(
      (tripGeojson) => tripGeojson.geojson,
    )[0];
    return {
      ...trip,
      geoJSON: geoJSON?.geoJSON ? JSON.parse(geoJSON?.geoJSON) : null,
      packs,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Trip cannot be found');
  }
};
