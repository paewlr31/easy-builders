import "server-only";

const databaseFromEnv = process.env.DATABASE_URL?.trim().replace(/^["']|["']$/g, "");
const resendKeyFromEnv = process.env.RESEND_API_KEY?.trim();
const resendFromEnv = process.env.RESEND_FROM?.trim();

export const databaseUrl = databaseFromEnv || "";

export const resendApiKey = resendKeyFromEnv || "";

export const resendFrom = resendFromEnv || "Easy Builders <onboarding@resend.dev>";

export const resendTo = "ebzapytania@gmail.com";
