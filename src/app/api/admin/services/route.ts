import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Service from "@/models/Service";

// GET all services
export async function GET() {
  try {
    await dbConnect();
    const services = await Service.find().sort({ created_at: -1 }).lean();
    
    // Convert _id to id for frontend compatibility
    const formattedServices = services.map(s => ({
        ...s,
        id: s._id.toString(),
        _id: undefined
    }));

    return NextResponse.json(formattedServices);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new service
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const service = await Service.create(body);
    
    const formattedData = {
        ...service.toObject(),
        id: service._id.toString()
    };

    return NextResponse.json(formattedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update service (using ID in body or params)
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) return NextResponse.json({ error: "Service ID is required" }, { status: 400 });

    const updatedService = await Service.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedService) return NextResponse.json({ error: "Service not found" }, { status: 404 });

    const formattedData = {
        ...updatedService.toObject(),
        id: updatedService._id.toString()
    };

    return NextResponse.json(formattedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE service
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Service ID is required" }, { status: 400 });

    await Service.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
