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
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'script-test'; // Default to test environment

if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error('❌ Missing required environment variables:');
  console.error('   SPACE_ID:', SPACE_ID ? '✓' : '✗');
  console.error('   CONTENTFUL_MANAGEMENT_TOKEN:', MANAGEMENT_TOKEN ? '✓' : '✗');
  console.error('\nPlease add CONTENTFUL_MANAGEMENT_TOKEN to your .env.local file');
  process.exit(1);
}

// Team/Committee mapping
const TEAM_MAPPING = {
  'President': 'President',
  'Director': 'Director',
  'Design': 'Design',
  'Marketing': 'Marketing/External',
  'Projects': 'Projects',
  'Finance': 'Finance',
  'Tech': 'Tech',
  'Exec': 'Director', // Map Exec to Director
  'Senior Advisor': 'Senior Advisor' // Keep Senior Advisor separate
};

function parseTeamFromRole(roleString) {
  if (!roleString) return ['General'];

  const roles = [];
  const parts = roleString.split(',').map(s => s.trim());

  for (const part of parts) {
    for (const [key, value] of Object.entries(TEAM_MAPPING)) {
      if (part.includes(key)) {
        if (!roles.includes(value)) {
          roles.push(value);
        }
      }
    }
  }

  return roles.length > 0 ? roles : ['General'];
}

function parseTitles(roleString) {
  if (!roleString) return [];
  return roleString.split(',').map(s => s.trim()).filter(Boolean);
}

async function uploadDefaultAvatar(environment) {
  try {
    console.log('📤 Checking for default avatar...');

    // Check if default avatar already exists
    const assets = await environment.getAssets({
      'fields.title[match]': 'Default Member Avatar',
      limit: 1
    });

    if (assets.items.length > 0) {
      const existingAsset = assets.items[0];
      console.log('✅ Found existing default avatar:', existingAsset.sys.id);
      return existingAsset;
    }

    console.log('   No existing avatar found, uploading new one...');

    const avatarPath = resolve(__dirname, '../public/images/default-avatar.svg');
    const avatarBuffer = readFileSync(avatarPath);

    // Create asset
    const asset = await environment.createAssetFromFiles({
      fields: {
        title: {
          'en-US': 'Default Member Avatar'
        },
        description: {
          'en-US': 'Default profile picture for members without photos'
        },
        file: {
          'en-US': {
            contentType: 'image/svg+xml',
            fileName: 'default-avatar.svg',
            file: avatarBuffer
          }
        }
      }
    });

    // Process asset
    const processedAsset = await asset.processForAllLocales();

    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Get the latest version after processing
    const latestAsset = await environment.getAsset(processedAsset.sys.id);

    // Publish asset
    const publishedAsset = await latestAsset.publish();

    console.log('✅ Default avatar uploaded:', publishedAsset.sys.id);
    return publishedAsset;
  } catch (error) {
    console.error('❌ Error with default avatar:', error.message);
    throw error;
  }
}

async function migrateMembers() {
  try {
    console.log('🚀 Starting member migration...\n');

    // Initialize Contentful client
    const client = createClient({
      accessToken: MANAGEMENT_TOKEN
    });

    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT);

    console.log(`✅ Connected to Contentful (Environment: ${ENVIRONMENT})\n`);

    // Get existing members to check for duplicates
    console.log('📋 Fetching existing members...');
    const existingEntries = await environment.getEntries({
      content_type: 'member',
      limit: 1000
    });

    const existingMembersMap = new Map();
    existingEntries.items.forEach(item => {
      const name = item.fields.name?.['en-US'];
      if (name) {
        existingMembersMap.set(name.toLowerCase().trim(), item);
      }
    });

    console.log(`   Found ${existingMembersMap.size} existing members\n`);

    // Upload default avatar
    const defaultAvatar = await uploadDefaultAvatar(environment);

    // Read and parse CSV
    const csvPath = resolve(__dirname, 'members.csv');
    console.log('📖 Reading CSV from:', csvPath);

    const csvContent = readFileSync(csvPath, 'utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      bom: true // Handle UTF-8 BOM
    });

    console.log(`📊 Found ${records.length} total records\n`);

    // Filter for active members only
    const activeMembers = records.filter(record => record.Active === 'Yes');
    console.log(`✅ Filtered to ${activeMembers.length} active members\n`);

    let createdCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    for (const [index, member] of activeMembers.entries()) {
      try {
        const name = member.Name?.trim();

        if (!name) {
          console.log(`⏭️  Skipping row ${index + 1}: No name provided`);
          continue;
        }

        console.log(`\n[${index + 1}/${activeMembers.length}] Processing: ${name}`);

        // Parse data
        const year = parseInt(member.Year) || new Date().getFullYear();
        const roles = parseTeamFromRole(member['Committee + Role']);
        const titles = parseTitles(member['Committee + Role']);
        const degree = member.Major?.trim() || '';
        const fact = member['Fun Fact']?.trim() || '';
        const website = member['Personal website']?.trim() || '';

        console.log(`   📋 Year: ${year}`);
        console.log(`   👥 Roles: ${roles.join(', ')}`);
        console.log(`   🎓 Major: ${degree || 'N/A'}`);

        // Check if member already exists
        const existingEntry = existingMembersMap.get(name.toLowerCase().trim());

        // Build field data (without photo - we'll handle that separately)
        const fieldData = {
          name: {
            'en-US': name
          },
          year: {
            'en-US': year
          },
          roles: {
            'en-US': roles
          },
          titles: {
            'en-US': titles
          },
          ...(degree && {
            degree: {
              'en-US': degree
            }
          }),
          ...(fact && {
            fact: {
              'en-US': fact
            }
          }),
          ...(website && {
            website: {
              'en-US': website
            }
          })
        };

        let entry;

        if (existingEntry) {
          // Update existing entry - DON'T touch the photo field
          console.log(`   🔄 Updating existing entry...`);
          console.log(`   📷 Preserving existing photo (not modifying)`);

          // Update only the fields we want to change, preserve photo
          existingEntry.fields.name = fieldData.name;
          existingEntry.fields.year = fieldData.year;
          existingEntry.fields.roles = fieldData.roles;
          existingEntry.fields.titles = fieldData.titles;
          if (fieldData.degree) existingEntry.fields.degree = fieldData.degree;
          if (fieldData.fact) existingEntry.fields.fact = fieldData.fact;
          if (fieldData.website) existingEntry.fields.website = fieldData.website;

          entry = await existingEntry.update();
          console.log(`   ✅ Updated (kept as draft)`);
          updatedCount++;
        } else {
          // Create new entry - include default photo
          console.log(`   ➕ Creating new entry...`);
          fieldData.photo = {
            'en-US': {
              sys: {
                type: 'Link',
                linkType: 'Asset',
                id: defaultAvatar.sys.id
              }
            }
          };
          entry = await environment.createEntry('member', {
            fields: fieldData
          });
          console.log(`   ✅ Created (kept as draft)`);
          createdCount++;
        }

        // Rate limiting - wait 500ms between creates
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Migration Summary:');
    console.log(`   ➕ Created: ${createdCount}`);
    console.log(`   🔄 Updated: ${updatedCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📝 Total Processed: ${activeMembers.length}`);
    console.log(`   🔍 Environment: ${ENVIRONMENT}`);
    console.log('='.repeat(50));
    console.log('\n⚠️  Note: All entries are kept as DRAFTS.');
    console.log('   Review them in Contentful, then publish manually when ready.\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run migration
migrateMembers();
