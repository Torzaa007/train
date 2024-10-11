// import Database from 'better-sqlite3';
// import path from 'path';

// export async function GET({ url }) {
//   const dbPath = path.resolve('src/database/dbforTrain.db');
//   const db = new Database(dbPath);

//   // Extract selectedTripId from query parameters
//   const selectedTripId = url.searchParams.get('selectedTripId');
//   console.log(selectedTripId)
//   console.log('Received selectedTripId from frontend:', selectedTripId); // Log the received trip ID

//   if (!selectedTripId) {
//     // If selectedTripId is missing, return an error response
//     return new Response(JSON.stringify({
//       error: 'Missing or invalid trip ID',
//       success: false
//     }), {
//       status: 400,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }

//   try {
//     // Query for fetching the trip details
//     const tripsQuery = `
//       SELECT t.trip_id, tr.train_id, s.seat_id, s.seat_type, 
//              substr(pc.class_1,1,1) 'class', substr(pc.class_1, length(pc.class_1)-1, 2) 'seat_per_coach'
//       FROM TRIPS t
//       JOIN TRAINS tr ON t.trip_id = tr.trip_id
//       JOIN SEAT s ON s.train_id = tr.train_id
//       JOIN PAX_COACHES pc ON pc.train_id = tr.train_id
//       WHERE t.trip_id = ?;
//     `;

//     // Fetch trip details from the database using selectedTripId
//     const tripsQ = db.prepare(tripsQuery).all(selectedTripId);
    
//     console.log('Fetched Trip Details:', tripsQ); // Log the fetched trip details

//     if (tripsQ.length === 0) {
//       // If no trip details found, return an error response
//       return new Response(JSON.stringify({
//         error: 'No trip details found for the provided trip ID',
//         success: false
//       }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }

//     // Return the fetched trip details as a JSON response
//     return new Response(JSON.stringify({
//       tripsQ,
//       success: true
//     }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' }
//     });

//   } catch (error) {
//     console.error('Error fetching data from the database:', error); // Log any errors

//     // Return an error response if there's an issue with the database query
//     return new Response(JSON.stringify({
//       error: 'Unable to fetch data from the database',
//       success: false
//     }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   } finally {
//     db.close();
//   }
// }
