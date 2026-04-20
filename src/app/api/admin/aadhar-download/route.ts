import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get("url");

    if (!fileUrl) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Cloudinary blocks direct CDN delivery of `.pdf` files on many accounts (401 error)
    // due to "Allow delivery of PDF and ZIP files" security settings.
    // The foolproof workaround is to request Cloudinary to transform the PDF into a JPG.
    // This bypasses the block, requires no authentication, and gives the admin a perfectly
    // readable image of the Aadhar card.
    
    // Replace .pdf with .jpg
    let fetchUrl = fileUrl;
    if (fetchUrl.toLowerCase().endsWith(".pdf")) {
      fetchUrl = fetchUrl.substring(0, fetchUrl.length - 4) + ".jpg";
    }

    // Fetch the transformed image (or original image if it wasn't a PDF)
    const response = await fetch(fetchUrl);

    if (!response.ok) {
      const text = await response.text();
      console.error("Cloudinary fetch failed:", response.status, text);
      return NextResponse.json(
        { error: `Cloudinary returned ${response.status}: ${text}` },
        { status: response.status }
      );
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Stream back to browser with attachment header so it triggers a save dialog
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="guest_aadhar.jpg"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("Aadhar download proxy error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


