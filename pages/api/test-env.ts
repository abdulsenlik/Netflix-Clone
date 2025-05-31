import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Testing environment variables...');
    
    const envVars = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_JWT_SECRET: !!process.env.NEXTAUTH_JWT_SECRET,
      GITHUB_ID: !!process.env.GITHUB_ID,
      GITHUB_SECRET: !!process.env.GITHUB_SECRET,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    };

    const envDetails = {
      DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
      NEXTAUTH_URL_VALUE: process.env.NEXTAUTH_URL || 'NOT_SET',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
    };

    const missingVars = Object.entries(envVars)
      .filter(([, exists]) => !exists)
      .map(([name]) => name);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Environment variables check',
      envVars,
      envDetails,
      missingVars,
      allPresent: missingVars.length === 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Environment test failed:', error);
    
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
} 