import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Testing database connection...');
    
    // Simple query to test connection
    const userCount = await prismadb.user.count();
    
    console.log('Database connection successful');
    
    return res.status(200).json({ 
      success: true, 
      userCount,
      message: 'Database connection working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
} 