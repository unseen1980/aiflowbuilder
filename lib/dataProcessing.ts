import axios from 'axios';
import { JSDOM } from 'jsdom';

export async function parseURL(url: string) {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const title = dom.window.document.querySelector('title')?.textContent || '';
    const description = dom.window.document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    return { title, description };
  } catch (error) {
    console.error('Error parsing URL:', error);
    throw new Error('Failed to parse URL');
  }
}

export function cleanData(data: string) {
  // Simple data cleaning: remove extra whitespace and convert to lowercase
  return data.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function anonymizeData(data: string) {
  // Simple anonymization: replace email addresses with [EMAIL]
  return data.replace(/\S+@\S+\.\S+/g, '[EMAIL]');
}

export function extractEntities(data: string) {
  // Simple entity extraction: find words starting with uppercase letters
  const entities = data.match(/\b[A-Z][a-z]+\b/g) || [];
  return Array.from(new Set(entities));
}

export function summarizeText(data: string) {
  // Simple summarization: return the first sentence
  const firstSentence = data.split(/[.!?]/).filter(Boolean)[0];
  return firstSentence ? firstSentence.trim() + '.' : '';
}