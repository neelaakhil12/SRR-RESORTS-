import mongoose from 'mongoose';
import dbConnect from './src/lib/mongoose.ts';
import Booking from './src/models/Booking.ts';

async function check() {
  try {
    await dbConnect();
    const bookings = await Booking.find({ service_type: 'LEISURE' }).sort({ created_at: -1 }).limit(5);
    console.log(JSON.stringify(bookings, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

check();
