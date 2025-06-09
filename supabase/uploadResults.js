import fs from 'fs';
import path from 'path';
import { supabase } from './initClient.js';
import dotenv from 'dotenv';
dotenv.config();

const TABLE = process.env.SUPABASE_TABLE || 'helpdesk_articles';
const source_file = 'support.csv';
const resultsPath = path.join('output', 'helpdesk_results.json');

async function uploadResults() {
  try {
    const data = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
    const enriched = data.map(entry => ({
      ...entry,
      source_file
    }));

    const { error } = await supabase.from(TABLE).insert(enriched);
    if (error) {
      console.error('Upload error:', error.message);
    } else {
      console.log('✅ Uploaded', enriched.length, 'entries to Supabase');
    }
  } catch (err) {
    console.error('Failed to upload results:', err.message);
  }
}

uploadResults();
