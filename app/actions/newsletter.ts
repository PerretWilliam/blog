"use server";

import { z } from "zod";
import { Resend } from "resend";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { getDictionary, Locale } from "@/dictionaries/dictionaries";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Delays the execution for a specified amount of time.
 * @param {number} ms - The number of milliseconds to delay.
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 */
const delay: (ms: number) => Promise<void> = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Schema for validating the email field in the newsletter subscription form.
 */
const schema = z.object({
  email: z.email("Invalid email"),
});

/**
 * Represents the state of the newsletter subscription process.
 * @typedef {Record<string, unknown>} NewsletterState
 */
type NewsletterState = Record<string, unknown>;

/**
 * Subscribes a user to the newsletter.
 * @async
 * @param {NewsletterState} prevState - The previous state of the newsletter subscription.
 * @param {FormData} formData - The form data containing the user's email.
 * @param {Locale} lang - The language/locale for the subscription process.
 * @returns {Promise<{ success?: boolean; error?: string }>} The result of the subscription process.
 */
export async function subscribeToNewsletter(
  prevState: NewsletterState,
  formData: FormData,
  lang: Locale,
): Promise<{ success?: boolean; error?: string }> {
  const email = formData.get("email") as string;
  const validatedFields = schema.safeParse({ email });

  const dict = await getDictionary(lang);

  if (!validatedFields.success) {
    return {
      error:
        validatedFields.error.issues[0].message ||
        dict.newsletter.action.invalidEmail,
    };
  }

  const userEmail = validatedFields.data.email;
  const audienceId = process.env.BLOG_AUDIENCE_ID!;

  try {
    // --- STEP 1: CONTACT MANAGEMENT (Consumes 1 to 2 API requests) ---
    const { data: existingContact } = await resend.contacts.get({
      email: userEmail,
      audienceId,
    });

    if (existingContact) {
      if (existingContact.unsubscribed === false) {
        return {
          error: dict.newsletter.action.alreadySubscribed,
        };
      }

      // Re-subscription case: set the unsubscribed flag to false
      const { error: updateError } = await resend.contacts.update({
        email: userEmail,
        audienceId,
        unsubscribed: false,
      });

      if (updateError) {
        console.error("Update Error:", updateError);
        return { error: dict.newsletter.action.resubscribedError };
      }
    } else {
      // New subscription case
      const { error: createError } = await resend.contacts.create({
        email: userEmail,
        audienceId,
        unsubscribed: false,
      });

      if (createError) {
        console.error("Create Error:", createError);
        return { error: dict.newsletter.action.resubscribedError };
      }
    }

    // --- TECHNICAL PAUSE: Wait 800ms to reset the quota (Rate Limit 429) ---
    await delay(800);

    // --- STEP 2: HANDLEBARS TEMPLATE PREPARATION ---
    const templatePath = path.join(
      process.cwd(),
      `content/email-templates/${lang}/welcome.hbs`,
    );

    if (!fs.existsSync(templatePath)) {
      console.error(`Template not found: ${templatePath}`);
      return { error: "Server configuration error (template)." };
    }

    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const template = handlebars.compile(templateSource);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const unsubscribeUrl = `${baseUrl}/${lang}/newsletter/unsubscribe?email=${encodeURIComponent(userEmail)}`;

    const htmlToSend = template({
      email: userEmail,
      unsubscribeUrl: unsubscribeUrl,
      blogUrl: baseUrl, // Used for the button in the template
    });

    // --- STEP 3: EMAIL SENDING (Consumes the 3rd request) ---
    const { error: mailError } = await resend.emails.send({
      from: "William <newsletter@william-perret.fr>",
      to: userEmail,
      subject: dict.newsletter.action.welcome,
      html: htmlToSend,
    });

    if (mailError) {
      console.error("Email Send Error (Resend Details):", mailError);
      return {
        error: dict.newsletter.action.sendEmailError,
      };
    }

    return { success: true };
  } catch (e) {
    console.error("Global Server Error:", e);
    return { error: dict.newsletter.action.ServerError };
  }
}
