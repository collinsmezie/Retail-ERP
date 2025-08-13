import { NextRequest, NextResponse } from 'next/server';
import { staticRepository } from '../../../lib/staticRepository';
import { logger } from '../../../lib/logger';

export async function GET(request: NextRequest) {
  return await POST(request);
}

export async function POST(request: NextRequest) {
  try {
    logger.info('Static inventory seeding endpoint accessed');
    
    // Get stats from static repository
    const stats = staticRepository.getStats();
    
    logger.info('Static data repository stats', stats);
    
    return NextResponse.json({
      success: true,
      message: 'Static inventory data is already loaded and ready',
      details: 'This application uses static data that is loaded at startup. No seeding is needed.',
      stats,
      note: 'Inventory data is loaded from static TypeScript files and works in Vercel serverless environment.'
    });
    
  } catch (error) {
    logger.error('Error accessing static inventory data', { error });
    return NextResponse.json(
      { error: 'Failed to access static inventory data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 