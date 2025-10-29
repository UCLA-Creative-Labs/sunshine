import pkg from 'contentful-management';
const { createClient } = pkg;
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const SPACE_ID = process.env.SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'script-test';

if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

async function cleanup() {
  try {
    console.log(`⚠️  WARNING: This will delete ALL member entries in the "${ENVIRONMENT}" environment!\n`);

    // Initialize Contentful client
    const client = createClient({
      accessToken: MANAGEMENT_TOKEN
    });

    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT);

    console.log(`✅ Connected to Contentful (Environment: ${ENVIRONMENT})\n`);

    // Get all member entries
    console.log('📋 Fetching all member entries...');
    const entries = await environment.getEntries({
      content_type: 'member',
      limit: 1000
    });

    console.log(`   Found ${entries.items.length} member entries\n`);

    if (entries.items.length === 0) {
      console.log('✅ No entries to delete!');
      return;
    }

    let deletedCount = 0;
    let errorCount = 0;

    for (const [index, entry] of entries.items.entries()) {
      try {
        const name = entry.fields.name?.['en-US'] || 'Unknown';
        console.log(`[${index + 1}/${entries.items.length}] Deleting: ${name}`);

        // Unpublish if published
        if (entry.isPublished()) {
          await entry.unpublish();
        }

        // Delete entry
        await entry.delete();
        console.log(`   ✅ Deleted`);
        deletedCount++;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Cleanup Summary:');
    console.log(`   ✅ Deleted: ${deletedCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   🔍 Environment: ${ENVIRONMENT}`);
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run cleanup
cleanup();
