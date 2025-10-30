import pkg from 'contentful-management';
const { createClient } = pkg;
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const SPACE_ID = process.env.SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';

if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

async function publishMembers() {
  try {
    console.log('🚀 Publishing member entries from CSV...\n');

    // Read and parse CSV
    console.log('📋 Reading members.csv...');
    const csvContent = readFileSync(resolve(__dirname, 'members.csv'), 'utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });

    const csvNames = records.map(record => record['Full Name']?.trim()).filter(Boolean);
    console.log(`   Found ${csvNames.length} members in CSV\n`);

    // Initialize Contentful client
    const client = createClient({
      accessToken: MANAGEMENT_TOKEN
    });

    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT);

    console.log(`✅ Connected to Contentful (Environment: ${ENVIRONMENT})\n`);

    // Get all draft member entries
    console.log('📋 Fetching draft member entries...');
    const entries = await environment.getEntries({
      content_type: 'member',
      limit: 1000
    });

    const draftEntries = entries.items.filter(entry => !entry.isPublished());

    // Filter to only CSV members
    const csvDraftEntries = draftEntries.filter(entry => {
      const name = entry.fields.name?.['en-US'];
      return csvNames.includes(name);
    });

    console.log(`   Found ${draftEntries.length} draft members total`);
    console.log(`   Found ${csvDraftEntries.length} draft members from CSV to publish\n`);

    if (csvDraftEntries.length === 0) {
      console.log('✅ No CSV draft entries to publish!');
      return;
    }

    let publishedCount = 0;
    let errorCount = 0;

    for (const [index, entry] of csvDraftEntries.entries()) {
      try {
        const name = entry.fields.name?.['en-US'] || 'Unknown';
        console.log(`[${index + 1}/${csvDraftEntries.length}] Publishing: ${name}`);

        await entry.publish();
        console.log(`   ✅ Published`);
        publishedCount++;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Publish Summary:');
    console.log(`   ✅ Published: ${publishedCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   🔍 Environment: ${ENVIRONMENT}`);
    console.log('='.repeat(50) + '\n');

    console.log('🎉 Members are now live on your website!');
    console.log('   Visit: http://localhost:3000/team (or your production URL)\n');

  } catch (error) {
    console.error('❌ Publish failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run publish
publishMembers();
