import { Pipeline } from './pipelineStorage';

export async function savePipeline(pipeline: Pipeline): Promise<Pipeline> {
  // In a static export, we can't make server-side API calls.
  // Instead, we'll save to localStorage for demonstration purposes.
  const pipelines = JSON.parse(localStorage.getItem('pipelines') || '[]');
  const newPipeline = { ...pipeline, id: Date.now().toString() };
  pipelines.push(newPipeline);
  localStorage.setItem('pipelines', JSON.stringify(pipelines));
  return newPipeline;
}

export async function executePipeline(pipeline: { nodes: any[], edges: any[] }, data: any): Promise<any> {
  // Simulate pipeline execution
  let result = { ...data };
  for (const node of pipeline.nodes) {
    switch (node.data.label) {
      case 'Parse URL':
        // Simulate parsing URL
        result.parsedUrl = new URL(result.url);
        break;
      case 'Clean Data':
        // Simulate cleaning data
        result.title = result.title.trim().toLowerCase();
        break;
      case 'Anonymize':
        // Simulate anonymizing
        result.description = result.description.replace(/\S+@\S+\.\S+/g, '[EMAIL]');
        break;
      case 'Extract Entities':
        // Simulate entity extraction
        result.entities = result.description.match(/\b[A-Z][a-z]+\b/g) || [];
        break;
      case 'Summarize':
        // Simulate summarization
        result.summary = result.description.split('.')[0] + '.';
        break;
    }
  }
  return result;
}