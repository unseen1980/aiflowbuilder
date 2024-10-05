import { NextRequest, NextResponse } from 'next/server';
import { savePipeline, getPipelines } from '@/lib/pipelineStorage';
import { parseURL, cleanData, anonymizeData, extractEntities, summarizeText } from '@/lib/dataProcessing';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('POST request received');
    const pipeline = await request.json();
    console.log('Received pipeline:', pipeline);

    if (!pipeline.name) {
      console.log('Pipeline name is missing');
      return NextResponse.json({ error: 'Pipeline name is required' }, { status: 400 });
    }

    console.log('Saving pipeline...');
    const savedPipeline = savePipeline(pipeline);
    console.log('Pipeline saved:', savedPipeline);

    return NextResponse.json(savedPipeline);
  } catch (error) {
    console.error('Error in POST /api/pipelines:', error);
    return NextResponse.json({ 
      error: 'Error saving pipeline', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const pipelines = getPipelines();
    return NextResponse.json(pipelines);
  } catch (error) {
    console.error('Error in GET /api/pipelines:', error);
    return NextResponse.json({ error: 'Error fetching pipelines' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { pipeline, data } = await request.json();
    let result = data;

    for (const node of pipeline.nodes) {
      switch (node.data.label) {
        case 'Parse URL':
          result = await parseURL(result.url);
          break;
        case 'Clean Data':
          result.title = cleanData(result.title);
          break;
        case 'Anonymize':
          result.description = anonymizeData(result.description);
          break;
        case 'Extract Entities':
          result.entities = extractEntities(result.description);
          break;
        case 'Summarize':
          result.summary = summarizeText(result.description);
          break;
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error executing pipeline:', error);
    return NextResponse.json({ error: 'Error executing pipeline' }, { status: 500 });
  }
}