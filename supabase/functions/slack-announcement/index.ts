// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"

interface ProjectAnnouncement {
  id: string
  title: string
  description: string
  announcement_type: string
  priority: string
  project_id: string
  visibility: 'project' | 'team' | 'board' | 'club_wide'
  target_team: 'tech' | 'finance' | 'marketing' | 'design' | 'project_manager' | null
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: ProjectAnnouncement
  schema: string
}

Deno.serve(async (req) => {
  try {
    const payload: WebhookPayload = await req.json()
    console.log('Received webhook payload:', payload)

    // Only process inserts to project_announcements
    if (payload.type !== 'INSERT' || payload.table !== 'project_announcements') {
      return new Response(JSON.stringify({ status: 'ignored' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { title, description, priority, visibility, target_team } = payload.record
    
    // Determine which webhook to use based on visibility
    let webhookSecretName = 'SLACK_WEBHOOK_URL' // Default fallback
    
    if (visibility === 'board') {
      webhookSecretName = 'SLACK_WEBHOOK_BOARD'
    } else if (visibility === 'club_wide') {
      webhookSecretName = 'SLACK_WEBHOOK_CLUB'
    } else if (visibility === 'team' && target_team) {
      // Map 'tech' -> SLACK_WEBHOOK_TECH, etc.
      webhookSecretName = `SLACK_WEBHOOK_${target_team.toUpperCase()}`
    } else if (visibility === 'project') {
      webhookSecretName = 'SLACK_WEBHOOK_PROJECTS'
    }

    let slackWebhookUrl = Deno.env.get(webhookSecretName)
    
    // Fallback if specific webhook isn't set
    if (!slackWebhookUrl) {
      console.log(`Specific webhook ${webhookSecretName} not found, falling back to default.`)
      slackWebhookUrl = Deno.env.get('SLACK_WEBHOOK_URL')
    }

    if (!slackWebhookUrl) {
      console.error('No Slack Webhook URL found in environment variables.')
      return new Response(JSON.stringify({ error: 'Slack webhook not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Determine priority prefix or ping
    let ping = ''
    if (priority === 'high' || priority === 'urgent') {
      ping = '@here '
    }

    const message = {
      text: `${ping}*New Announcement: ${title}*`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${ping}*New Announcement: ${title}*`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'plain_text',
            text: description,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Visibility: ${visibility.toUpperCase()}${target_team ? ` | Team: ${target_team.toUpperCase()}` : ''} | Priority: ${priority.toUpperCase()}`,
            },
          ],
        },
      ],
    }

    console.log(`Sending to webhook: ${webhookSecretName}`)
    const response = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    })

    const responseText = await response.text()
    console.log('Slack response:', responseText)

    return new Response(JSON.stringify({ 
      status: 'success', 
      channel: webhookSecretName, 
      slackResponse: responseText 
    }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error processing webhook:', error)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
