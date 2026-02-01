// import { NextResponse } from "next/server";
// import connectMongo from "@/lib/mongoDB";
// import { auth } from "@/lib/firebase";
// export async function GET() {
//   const status = {
//     mongodb: "Checking...",
//     firebase: "Checking...",
//   };
  
//   try {
//     console.log("Attempting to connect to MongoDB...");
//     await connectMongo();

//     return NextResponse.json(
//       {
//         message: "Successfully connected to MongoDB Atlas! 🚀",
//       },
//       { status: 200 },
//     );
//   } catch (error: any) {
//     console.error("Database connection error:", error);

//     return NextResponse.json(
//       {
//         error: "Failed to connect to database",
//         details: error.message,
//       },
//       { status: 500 },
//     );
//   }
// }


import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoDB";
import { auth } from "@/lib/firebase";

export async function GET() {
  const status = {
    mongodb: "Checking...",
    firebase: "Checking...",
  };

  try {
    // 1. Test MongoDB Connection
    await connectMongo();
    status.mongodb = "Connected successfully! ✅";

    // 2. Test Firebase Initialization
    // We check if the auth object exists and has the correct Project ID from your env
    if (auth.app.options.projectId) {
      status.firebase = `Initialized for project: ${auth.app.options.projectId} ✅`;
    } else {
      throw new Error("Firebase initialized but Project ID is missing.");
    }

    return NextResponse.json({
      success: true,
      message: "All systems go!",
      databases: status,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Database test failed:", error);

    return NextResponse.json({
      success: false,
      message: "One or more databases failed to connect.",
      error: error.message,
      // If MongoDB failed, it usually happens at the connectMongo() line
      currentStatus: status,
    }, { status: 500 });
  }
}