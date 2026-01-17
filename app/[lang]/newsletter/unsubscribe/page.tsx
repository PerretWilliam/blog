import { Resend } from "resend";
import { Container } from "@/components/container";
import Link from "next/link"; // Correction of the import
import { getDictionary, Locale } from "@/dictionaries/dictionaries";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * UnsubscribePage Component
 *
 * This component handles the unsubscription process for a newsletter. It retrieves the user's email and language
 * from the search parameters and performs the unsubscription using the Resend API. It also displays a confirmation
 * message to the user.
 *
 * @param {Object} props - The component props.
 * @param {Promise<{ email: string }>} props.searchParams - A promise resolving to the search parameters containing the user's email.
 * @param {Promise<{ lang: Locale }>} props.params - A promise resolving to the route parameters containing the language locale.
 *
 * @returns {JSX.Element} The rendered unsubscribe page.
 */
export default async function UnsubscribePage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ email: string }>;
  params: Promise<{ lang: Locale }>;
}): Promise<React.JSX.Element> {
  // Extract email and language from the provided promises
  const { email } = await searchParams;
  const { lang } = await params;

  // Fetch the dictionary for the specified language
  const dict = await getDictionary(lang);

  // Decode the email address if it exists
  const decodedEmail = email ? decodeURIComponent(email) : "";

  // If a valid email is provided, attempt to unsubscribe the user
  if (decodedEmail) {
    try {
      console.log(
        `Attempting to unsubscribe: ${decodedEmail} (Audience: ${process.env.BLOG_AUDIENCE_ID})`,
      );

      // Call the Resend API to update the user's subscription status
      const response = await resend.contacts.update({
        email: decodedEmail,
        audienceId: process.env.BLOG_AUDIENCE_ID!,
        unsubscribed: true,
      });

      // Log the result of the API call
      if (response.error) {
        console.error("Resend API Error:", response.error);
      } else {
        console.log("Successfully unsubscribed in Resend");
      }
    } catch (e) {
      console.error("Technical error during unsubscription:", e);
    }
  }

  // Extract and split the description text for rendering
  const description = dict.newsletter.unsubscribe.description;
  const parts = description.split("<strong>{email}</strong>");

  // Render the unsubscribe confirmation page
  return (
    <Container size="prose" className="py-20 text-center">
      <h1 className="text-3xl font-black mb-4">
        {dict.newsletter.unsubscribe.title}
      </h1>
      <p className="text-muted-foreground">
        {parts[0]}
        <strong className="text-foreground">{decodedEmail}</strong>
        {parts[1]}
      </p>
      <Link
        href={`/${lang}`}
        className="inline-block mt-8 underline font-medium decoration-3 decoration-primary hover:font-bold"
      >
        {dict.newsletter.unsubscribe.back}
      </Link>
    </Container>
  );
}
