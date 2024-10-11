import Database from 'better-sqlite3';
import path from 'path';

export async function load({ url }) {
  const dbPath = path.resolve('src/database/dbforTrain.db'); // Update with the correct path
  const db = new Database(dbPath);

  try {
    // Extract query parameters
    const selectedTripId = url.searchParams.get('selectedTripId');
    const origin = url.searchParams.get('origin');
    const destination = url.searchParams.get('destination');
    const date = url.searchParams.get('date');
    let start_id = url.searchParams.get('start_id');
    let end_id = url.searchParams.get('end_id');

    // Fetch stations (you can adjust this query according to your needs)
    const stationsQuery = `
      SELECT station_id, station_name
      FROM STATIONS
      WHERE station_id LIKE '%nl%'
         OR station_id LIKE '%ne%'
         OR station_id IN ('st_01', 'st_02', 'st_03');
    `;
    const stations = db.prepare(stationsQuery).all();

    // Ensure the start and end station IDs are in the correct order
    if (start_id > end_id) {
      [start_id, end_id] = [end_id, start_id];
    }

    // Fetch stations between the start and end IDs
    const stationsQ = db.prepare(`
      SELECT station_id, station_name
      FROM STATIONS
      WHERE station_id BETWEEN ? AND ?;
    `).all(start_id, end_id);

    // Fetch trip details if the trip ID is provided
    let tripsQ = [];
    if (selectedTripId) {
      const tripDetailsQuery = `
        SELECT trip_id, seat_type, count(seat_id) as available_seats
        FROM SEAT
        JOIN PAX_COACHES USING (coach_id)
        JOIN TRAINS USING (train_id)
        WHERE seat_id NOT IN (SELECT reserved_seat_id FROM RESERVATIONS)
        AND trip_id = ?
        GROUP BY trip_id, seat_type;
      `;
      tripsQ = db.prepare(tripDetailsQuery).all(selectedTripId);
    }

    // Fetch all trips
    const trips = db.prepare(`
      SELECT t.trip_id, t.staff_id, t.start_station_id, t.end_station_id, t.route, t.from_datetime, 
      s.station_name AS 'start', s2.station_name AS 'end'
      FROM TRIPS t
      JOIN STATIONS s ON t.start_station_id = s.station_id
      JOIN STATIONS s2 ON s2.station_id = t.end_station_id;
    `).all();

    return {
      trips,
      stations,
      stationsQ,
      tripsQ, // Trip details including seat information
      success: true,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      error: 'Unable to fetch data from the database',
      success: false,
    };
  } finally {
    db.close();
  }
}
