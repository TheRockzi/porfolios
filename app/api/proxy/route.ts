import { NextResponse } from 'next/server';
import { mockSystemActivity, mockThreatData } from '@/app/lib/mockData';

const SHODAN_API_KEY = process.env.NEXT_PUBLIC_SHODAN_API_KEY || '';
const URLSCAN_API_KEY = process.env.NEXT_PUBLIC_URLSCAN_API_KEY || '';

const USE_MOCK_DATA = !SHODAN_API_KEY || !URLSCAN_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  const target = searchParams.get('target');

  if (!endpoint) {
    return NextResponse.json({ error: 'No endpoint specified' }, { status: 400 });
  }

  // If we're using mock data, return it immediately
  if (USE_MOCK_DATA) {
    switch (endpoint) {
      case 'scans':
        return NextResponse.json({ total: Math.floor(Math.random() * 1000) + 100 });
      case 'sources':
        return NextResponse.json(Array.from({ length: Math.floor(Math.random() * 20) + 5 }));
      case 'activity':
        const mockActivity = {
          matches: mockSystemActivity.map(item => ({
            ...item,
            port: Math.floor(Math.random() * 1000) + 1,
            product: ['Apache', 'Nginx', 'IIS'][Math.floor(Math.random() * 3)],
            version: `${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`,
            vulns: Math.random() > 0.7 ? {
              'CVE-2023-1234': {
                summary: 'Remote Code Execution Vulnerability',
                cvss: (Math.random() * 10).toFixed(1)
              }
            } : undefined
          }))
        };
        return NextResponse.json(mockActivity);
      case 'threats':
        const mockThreats = {
          results: mockThreatData.map(item => ({
            ...item,
            page: {
              domain: target || 'example.com'
            },
            stats: {
              malicious: Math.floor(Math.random() * 5),
              suspicious: Math.floor(Math.random() * 10)
            },
            verdicts: {
              overall: {
                score: Math.floor(Math.random() * 100),
                malicious: Math.random() > 0.7
              }
            }
          }))
        };
        return NextResponse.json(mockThreats);
      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }
  }

  try {
    let url = '';
    let headers: HeadersInit = {};

    switch (endpoint) {
      case 'scans':
        url = `https://api.shodan.io/shodan/host/count?key=${SHODAN_API_KEY}&query=port:22,80,443`;
        break;
      case 'sources':
        url = `https://api.shodan.io/shodan/ports?key=${SHODAN_API_KEY}`;
        break;
      case 'activity':
        const query = target ? `hostname:${target}` : 'port:80';
        url = `https://api.shodan.io/shodan/host/search?key=${SHODAN_API_KEY}&query=${query}`;
        break;
      case 'threats':
        const urlscanQuery = target ? `domain:${target}` : 'domain:*.com';
        url = `https://urlscan.io/api/v1/search/?q=${urlscanQuery}&size=12`;
        headers = {
          'API-Key': URLSCAN_API_KEY
        };
        break;
      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error in proxy/${endpoint}:`, error);
    
    // Fallback to mock data on error
    switch (endpoint) {
      case 'scans':
        return NextResponse.json({ total: Math.floor(Math.random() * 1000) + 100 });
      case 'sources':
        return NextResponse.json(Array.from({ length: Math.floor(Math.random() * 20) + 5 }));
      case 'activity':
        return NextResponse.json({ matches: mockSystemActivity });
      case 'threats':
        return NextResponse.json({ results: mockThreatData });
      default:
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
  }
}