let inMemoryPipelines: Pipeline[] = [];

export interface Pipeline {
  id: string;
  name: string;
  nodes: any[];
  edges: any[];
}

export function getPipelines(): Pipeline[] {
  return inMemoryPipelines;
}

export function savePipeline(pipeline: Pipeline): Pipeline {
  const newPipeline = { ...pipeline, id: Date.now().toString() };
  inMemoryPipelines.push(newPipeline);
  return newPipeline;
}

export function getPipeline(id: string): Pipeline | undefined {
  return inMemoryPipelines.find(p => p.id === id);
}

export function updatePipeline(id: string, updatedPipeline: Pipeline): Pipeline | null {
  const index = inMemoryPipelines.findIndex(p => p.id === id);
  if (index === -1) return null;
  inMemoryPipelines[index] = { ...updatedPipeline, id };
  return inMemoryPipelines[index];
}

export function deletePipeline(id: string): boolean {
  const initialLength = inMemoryPipelines.length;
  inMemoryPipelines = inMemoryPipelines.filter(p => p.id !== id);
  return inMemoryPipelines.length < initialLength;
}