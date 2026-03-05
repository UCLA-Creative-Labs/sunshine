import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log("Slack Announcement Function initialized");

const SLACK_BOT_TOKEN = Deno.env.get('SLACK_BOT_TOKEN');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

// Mapping for specific visibility channels
const VISIBILITY_MAPPING: Record<string, string> = {
  'club_wide': 'C042EJJE33K', 
  'board': 'C042EJJE33K',     
};

const TEAM_CHANNELS: Record<string, string> = {
  'tech': 'C07GEAH55EX',
  'finance': 'C07GT3VRNDP',
  'marketing': 'C07GBGY0AH3',
  'design': 'C07GT3VMEHF',
  'project_managers': 'C07GBGXEXMK'
};

serve(async (req) => {
  try {
    const payload = await req.json();
    const { record, type } = payload;

    // Only process new announcements
    if (type !== 'INSERT') {
      return new Response(JSON.stringify({ message: 'Ignore non-insert event' }), { status: 200 });
    }

    const { 
      title, 
      description, 
      visibility, 
      project_id, 
      target_team,
      link_url,
      priority
    } = record;

    let channelId = '';

    // Determine the correct channel based on visibility
    if (visibility === 'project' && project_id) {
      // Fetch project's slack channel from the projects table
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('slack_channel_id, projectName')
        .eq('id', project_id)
        .single();
      
      if (projectError) {
        console.error('Error fetching project slack channel:', projectError);
      } else {
        channelId = project?.slack_channel_id;
        console.log(`Found project channel: ${channelId} for project: ${project?.projectName}`);
      }
    } else if (visibility === 'team' && target_team) {
      channelId = TEAM_CHANNELS[target_team];
      console.log(`Selected team channel: ${channelId} for team: ${target_team}`);
    } else {
      channelId = VISIBILITY_MAPPING[visibility];
      console.log(`Selected visibility channel: ${channelId} for visibility: ${visibility}`);
    }

    if (!channelId) {
      console.warn(`No Slack channel mapping found for: visibility=${visibility}, team=${target_team}, project=${project_id}`);
      return new Response(JSON.stringify({ error: 'No channel mapping' }), { status: 200 });
    }

    // Ping @channel for high or urgent priority announcements
    const shouldPing = priority === 'high' || priority === 'urgent';
    const slackDescription = shouldPing ? `<!channel>\n${description}` : description;

    // Prepare Slack Message
    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `📢 ${title}`,
          emoji: true
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: description
        }
      }
    ];

    if (link_url) {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<${link_url}|View more details>`
        }
      });
    }

    // Send to Slack via chat.postMessage
    const slackRes = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SLACK_BOT_TOKEN}`
      },
      body: JSON.stringify({
        channel: channelId,
        blocks: blocks,
        text: `New Announcement: ${title}` // Fallback text
      })
    });

    const slackResult = await slackRes.json();
    if (!slackResult.ok) {
      console.error('Slack API error:', slackResult.error);
      return new Response(JSON.stringify({ error: slackResult.error }), { status: 500 });
    }

    console.log(`Successfully posted announcement to Slack channel: ${channelId}`);
    return new Response(JSON.stringify({ ok: true }), { status: 200 });

  } catch (err: any) {
    console.error('Function error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
})
