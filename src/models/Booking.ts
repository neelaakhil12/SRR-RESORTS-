import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    service_id: { type: String },
    service_type: { type: String }, // ROOM, HALL, etc
    items: { type: [String], default: [] },
    date: { type: String }, // Format: YYYY-MM-DD (for single day events)
    time_slot: { type: String },
    start_date: { type: String }, // For stays
    end_date: { type: String }, // For stays
    check_in_time: { type: String, default: "06:00" },
    check_out_time: { type: String, default: "22:00" },
    duration: { type: Number, default: 1 }, // For leisure/hourly services

    guests: { type: Number, required: true, min: 1 },
    is_stayer: { type: Boolean, default: false },
    room_number: { type: String },
    token_id: { type: String },
    special_requests: { type: String },
    status: { 
      type: String, 
      default: 'PENDING',
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']
    },
    payment_method: { 
        type: String, 
        enum: ['CASH', 'UPI', 'CARD', 'ONLINE'] 
    },
    booking_source: { 
        type: String, 
        default: 'ONLINE',
        enum: ['ONLINE', 'WALK_IN', 'PHONE'] 
    },
    total_amount: { type: Number },
    payment_status: { 
        type: String, 
        default: 'PENDING',
        enum: ['PENDING', 'PAID', 'PARTIAL', 'REFUNDED'] 
    },
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
