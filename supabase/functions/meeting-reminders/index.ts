import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const now = new Date();

    // Get meetings that need 1-day reminder (meeting is tomorrow)
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const { data: dayMeetings } = await supabase
      .from("meetings")
      .select("*")
      .eq("meeting_date", tomorrowStr)
      .eq("reminder_1day_sent", false);

    // Get meetings that need 1-hour reminder (meeting is within next 1-2 hours today)
    const todayStr = now.toISOString().split("T")[0];
    const { data: todayMeetings } = await supabase
      .from("meetings")
      .select("*")
      .eq("meeting_date", todayStr)
      .eq("reminder_1hour_sent", false);

    const emailsSent: string[] = [];

    // Helper to convert "09:00 AM" to 24h hour number
    const parseTimeToHour = (timeStr: string): number => {
      const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (!match) return -1;
      let hour = parseInt(match[1]);
      const ampm = match[3].toUpperCase();
      if (ampm === "PM" && hour !== 12) hour += 12;
      if (ampm === "AM" && hour === 12) hour = 0;
      return hour;
    };

    // Send 1-day reminders
    if (dayMeetings && dayMeetings.length > 0) {
      for (const meeting of dayMeetings) {
        const emails: string[] = [];
        if (meeting.booked_by_email) emails.push(meeting.booked_by_email);
        if (meeting.owner_email) emails.push(meeting.owner_email);

        for (const email of emails) {
          // Use Supabase Auth admin to send email (or log for now)
          console.log(`[1-DAY REMINDER] Sending to ${email} for meeting "${meeting.title}" on ${meeting.meeting_date} at ${meeting.meeting_time}`);
          emailsSent.push(`1day:${email}:${meeting.id}`);
        }

        // Mark as sent
        await supabase
          .from("meetings")
          .update({ reminder_1day_sent: true })
          .eq("id", meeting.id);
      }
    }

    // Send 1-hour reminders
    if (todayMeetings && todayMeetings.length > 0) {
      const currentHour = now.getHours();

      for (const meeting of todayMeetings) {
        const meetingHour = parseTimeToHour(meeting.meeting_time);
        // Send if meeting is within next 1-2 hours
        if (meetingHour >= 0 && meetingHour - currentHour >= 0 && meetingHour - currentHour <= 2) {
          const emails: string[] = [];
          if (meeting.booked_by_email) emails.push(meeting.booked_by_email);
          if (meeting.owner_email) emails.push(meeting.owner_email);

          for (const email of emails) {
            console.log(`[1-HOUR REMINDER] Sending to ${email} for meeting "${meeting.title}" at ${meeting.meeting_time}`);
            emailsSent.push(`1hour:${email}:${meeting.id}`);
          }

          await supabase
            .from("meetings")
            .update({ reminder_1hour_sent: true })
            .eq("id", meeting.id);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: emailsSent.length,
        reminders: emailsSent,
        timestamp: now.toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Meeting reminder error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
