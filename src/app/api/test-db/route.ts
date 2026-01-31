import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoDB";

export async function GET() {
  try {
    console.log("Attempting to connect to MongoDB...");
    await connectMongo();
    
    return NextResponse.json({ 
      message: "Successfully connected to MongoDB Atlas! 🚀" 
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("Database connection error:", error);
    
    return NextResponse.json({ 
      error: "Failed to connect to database", 
      details: error.message 
    }, { status: 500 });
  }
}