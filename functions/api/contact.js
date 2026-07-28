const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json"
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    const { name, email, message, phone } = data;
    const social_handle = data.social_handle || data.social || '';

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ status: "error", error: "Missing required fields: Name, Email, and Message are mandatory." }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!env.RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ status: "error", error: "RESEND_API_KEY environment variable is not set in Cloudflare Pages." }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Cleanly formatted plain-text email body
    const emailText = [
      "========================================",
      "AERIEL.NET - NEW CONTACT TRANSMISSION",
      "========================================",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Social Handle: ${social_handle ? social_handle : "N/A"}`,
      `Phone: ${phone ? phone : "N/A"}`,
      "",
      "MESSAGE BODY:",
      "----------------------------------------",
      message,
      "----------------------------------------",
      "",
      `Timestamp: ${new Date().toISOString()}`
    ].join("\n");

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "AERIEL Website <onboarding@resend.dev>",
        to: ["contact@aeriel.net"],
        reply_to: email,
        subject: `[AERIEL.NET] New Message from ${name}`,
        text: emailText
      })
    });

    if (resendResponse.ok) {
      const resData = await resendResponse.json().catch(() => ({}));
      return new Response(
        JSON.stringify({ status: "success", id: resData.id }),
        { status: 200, headers: corsHeaders }
      );
    } else {
      const errorText = await resendResponse.text();
      return new Response(
        JSON.stringify({ status: "error", error: `Resend API Error: ${errorText}` }),
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (err) {
    return new Response(
      JSON.stringify({ status: "error", error: err.message || "An unexpected server error occurred." }),
      { status: 500, headers: corsHeaders }
    );
  }
}
