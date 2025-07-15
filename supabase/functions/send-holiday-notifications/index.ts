import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const today = new Date();
    const currentDate = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    console.log(`Checking for holidays on ${currentDate}`);

    // Get today's holidays
    const { data: holidays, error: holidaysError } = await supabase
      .from('holidays')
      .select('*')
      .eq('date_formula', currentDate);

    if (holidaysError) {
      console.error('Error fetching holidays:', holidaysError);
      throw holidaysError;
    }

    // Get all active users with notification preferences
    const { data: users, error: usersError } = await supabase
      .from('user_notification_preferences')
      .select('*')
      .eq('is_active', true);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      throw usersError;
    }

    let notificationsSent = 0;

    for (const holiday of holidays || []) {
      console.log(`Processing holiday: ${holiday.name}`);
      
      // Filter users based on holiday criteria
      const eligibleUsers = users?.filter(user => {
        // Check country match
        if (holiday.countries && holiday.countries.length > 0) {
          if (!holiday.countries.includes(user.country_code)) {
            return false;
          }
        }

        // Check religion match for religious holidays
        if (holiday.type === 'religious' && holiday.religions) {
          if (!user.religion || !holiday.religions.includes(user.religion)) {
            return false;
          }
          return user.receive_religious;
        }

        // Check notification preferences by type
        switch (holiday.type) {
          case 'national':
            return user.receive_national;
          case 'international':
            return user.receive_international;
          case 'cultural':
            return user.receive_cultural;
          default:
            return true;
        }
      }) || [];

      console.log(`Found ${eligibleUsers.length} eligible users for ${holiday.name}`);

      // Generate and send notifications for each eligible user
      for (const user of eligibleUsers) {
        try {
          // Generate personalized message
          const greetingResponse = await fetch(`${supabaseUrl}/functions/v1/generate-greeting`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              holiday,
              userPrefs: user,
              type: 'holiday'
            }),
          });

          const greetingData = await greetingResponse.json();
          
          if (greetingData.error) {
            console.error('Error generating greeting:', greetingData.error);
            continue;
          }

          // Save notification to database
          const { error: notificationError } = await supabase
            .from('holiday_notifications')
            .insert({
              user_id: user.user_id,
              holiday_id: holiday.id,
              message: greetingData.message,
              notification_type: 'holiday',
              status: 'sent'
            });

          if (notificationError) {
            console.error('Error saving notification:', notificationError);
          } else {
            notificationsSent++;
            console.log(`Notification sent to user ${user.user_id} for ${holiday.name}`);
          }
        } catch (error) {
          console.error(`Error processing user ${user.user_id}:`, error);
        }
      }
    }

    // Check for birthdays
    const { data: birthdayUsers, error: birthdayError } = await supabase
      .from('user_notification_preferences')
      .select('*')
      .eq('is_active', true)
      .eq('receive_birthday', true)
      .not('birthday', 'is', null);

    if (!birthdayError && birthdayUsers) {
      const todayBirthdays = birthdayUsers.filter(user => {
        if (!user.birthday) return false;
        const birthday = new Date(user.birthday);
        return birthday.getMonth() === today.getMonth() && 
               birthday.getDate() === today.getDate();
      });

      for (const user of todayBirthdays) {
        try {
          const greetingResponse = await fetch(`${supabaseUrl}/functions/v1/generate-greeting`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userPrefs: user,
              type: 'birthday'
            }),
          });

          const greetingData = await greetingResponse.json();
          
          if (!greetingData.error) {
            await supabase
              .from('holiday_notifications')
              .insert({
                user_id: user.user_id,
                message: greetingData.message,
                notification_type: 'birthday',
                status: 'sent'
              });
            
            notificationsSent++;
            console.log(`Birthday notification sent to user ${user.user_id}`);
          }
        } catch (error) {
          console.error(`Error processing birthday for user ${user.user_id}:`, error);
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      notificationsSent,
      holidaysProcessed: holidays?.length || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in send-holiday-notifications:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});