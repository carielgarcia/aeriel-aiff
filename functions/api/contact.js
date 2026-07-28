export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    const { name, email, message, phone } = data;
    const social_handle = data.social_handle || data.social || '';

    // Validate required fields (name, email, message mandatory)
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ status: "error", error: "Missing required fields: Name, Email, and Message are mandatory." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!env.RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ status: "error", error: "RESEND_API_KEY environment variable is not configured." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Cleanly formatted plain-text email body containing all fields
    const emailText = [
      "New Contact Transmission from AERIEL.NET:",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Social Handle: ${social_handle ? social_handle : "N/A"}`,
      `Phone: ${phone ? phone : "N/A"}`,
      "",
      "Message Body:",
      "----------------------------------------",
      message,
      "----------------------------------------"
    ].join("\n");

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "AERIEL Website <onboarding@resend.dev>",
        to: ["contact@aeriel.net"],
        subject: "[AERIEL.NET] New Message from " + name,
        text: emailText
      })
    });

    if (resendResponse.ok) {
      return new Response(
        JSON.stringify({ status: "success" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      const errorText = await resendResponse.text();
      return new Response(
        JSON.stringify({ status: "error", error: errorText }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (err) {
    return new Response(
      JSON.stringify({ status: "error", error: err.message || "An unexpected error occurred." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
