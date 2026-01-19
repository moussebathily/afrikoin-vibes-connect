import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  application_id: string;
  new_status: string;
  job_title: string;
  company: string;
  user_id: string;
  applicant_name?: string;
}

const getStatusMessage = (status: string, jobTitle: string, company: string) => {
  const messages: Record<string, { subject: string; title: string; message: string; emoji: string }> = {
    reviewed: {
      subject: `Votre candidature a été consultée - ${jobTitle}`,
      title: "Candidature consultée",
      message: `Le recruteur de ${company} a consulté votre candidature pour le poste de ${jobTitle}. Restez attentif à votre boîte mail !`,
      emoji: "👀"
    },
    shortlisted: {
      subject: `🎉 Félicitations ! Vous êtes présélectionné - ${jobTitle}`,
      title: "Vous êtes présélectionné !",
      message: `Excellente nouvelle ! Votre candidature pour le poste de ${jobTitle} chez ${company} a retenu l'attention du recruteur. Vous faites partie des candidats présélectionnés.`,
      emoji: "🌟"
    },
    accepted: {
      subject: `🎊 Candidature acceptée - ${jobTitle}`,
      title: "Candidature acceptée !",
      message: `Félicitations ! Votre candidature pour le poste de ${jobTitle} chez ${company} a été acceptée. Le recruteur vous contactera très prochainement.`,
      emoji: "🎉"
    },
    rejected: {
      subject: `Mise à jour de votre candidature - ${jobTitle}`,
      title: "Mise à jour de votre candidature",
      message: `Nous vous informons que votre candidature pour le poste de ${jobTitle} chez ${company} n'a malheureusement pas été retenue. Ne vous découragez pas, d'autres opportunités vous attendent !`,
      emoji: "💪"
    }
  };

  return messages[status] || {
    subject: `Mise à jour de votre candidature - ${jobTitle}`,
    title: "Statut mis à jour",
    message: `Le statut de votre candidature pour le poste de ${jobTitle} chez ${company} a été mis à jour.`,
    emoji: "📬"
  };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      application_id, 
      new_status, 
      job_title, 
      company, 
      user_id,
      applicant_name 
    }: NotificationRequest = await req.json();

    // Get user email using service role
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(user_id);
    
    if (userError || !userData?.user?.email) {
      console.error("Could not get user email:", userError);
      return new Response(
        JSON.stringify({ error: "Could not retrieve user email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const applicantEmail = userData.user.email;

    const statusInfo = getStatusMessage(new_status, job_title, company);

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${statusInfo.subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #1a1a1a; font-size: 28px; font-weight: bold;">
                ${statusInfo.emoji} ${statusInfo.title}
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Bonjour ${applicant_name || 'Candidat'},
              </p>
              <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                ${statusInfo.message}
              </p>
              
              <!-- Job Details Card -->
              <table width="100%" style="background-color: #f9fafb; border-radius: 12px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Poste</p>
                    <p style="margin: 0 0 16px; color: #111827; font-size: 18px; font-weight: 600;">${job_title}</p>
                    <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Entreprise</p>
                    <p style="margin: 0; color: #111827; font-size: 18px; font-weight: 600;">${company}</p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Consultez vos candidatures sur AfriKoin pour plus de détails.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">
                AfriKoin - Votre plateforme d'emploi en Afrique
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Cet email a été envoyé automatiquement suite à une mise à jour de votre candidature.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const emailResponse = await resend.emails.send({
      from: "AfriKoin Jobs <onboarding@resend.dev>",
      to: [applicant_email],
      subject: statusInfo.subject,
      html: emailHtml,
    });

    console.log("Notification email sent:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, emailId: emailResponse.id }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
