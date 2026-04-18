import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Gallery from "@/models/Gallery";

export async function GET() {
  try {
    await dbConnect();
    const images = await Gallery.find().sort({ created_at: -1 }).lean();
    
    const formattedImages = images.map(img => ({
      ...img,
      id: img._id.toString(),
      _id: undefined
    }));

    return NextResponse.json(formattedImages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const image = await Gallery.create(body);
    
    const formattedData = {
      ...image.toObject(),
      id: image._id.toString()
    };

    return NextResponse.json(formattedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) return NextResponse.json({ error: "Image ID is required" }, { status: 400 });

    const updatedImage = await Gallery.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedImage) return NextResponse.json({ error: "Image not found" }, { status: 404 });

    const formattedData = {
      ...updatedImage.toObject(),
      id: updatedImage._id.toString()
    };

    return NextResponse.json(formattedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Image ID is required" }, { status: 400 });

    await Gallery.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
