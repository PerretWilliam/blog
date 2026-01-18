"use client";

import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconLoader2, IconCheck } from "@tabler/icons-react";
import { Dictionary, Locale } from "@/dictionaries/dictionaries";

type NewsletterState = {
  error?: string;
  success?: boolean;
};

/**
 * Renders the newsletter subscription form.
 * @param {Object} props - The properties passed to the component.
 * @param {Locale} props.lang - The language locale used for the subscription process.
 * @param {Dictionary} props.dict - The dictionary object containing localized strings.
 * @returns {JSX.Element} The rendered newsletter form component.
 */
export function NewsletterForm({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}): React.JSX.Element {
  const [state, formAction, isPending] = useActionState<
    NewsletterState,
    FormData
  >(
    /**
     * Handles the subscription action.
     * @param {NewsletterState} state - The current state of the form.
     * @param {FormData} payload - The form data submitted by the user.
     * @returns {Promise<NewsletterState>} The updated state after processing the subscription.
     */
    (state, payload) => subscribeToNewsletter(state, payload, lang),
    {} as NewsletterState,
  );

  if (state?.success) {
    return (
      <div className="flex items-center gap-2 text-green-600 font-medium py-2 animate-in fade-in zoom-in-95">
        <IconCheck size={20} /> {dict.newsletter.thanks}
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <form action={formAction} className="flex items-center space-x-2">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          disabled={isPending}
          className={`bg-background ${state?.error ? "border-destructive ring-destructive" : ""}`}
        />
        <Button variant="newsLetter" type="submit" disabled={isPending}>
          {isPending ? (
            <IconLoader2 className="animate-spin h-4 w-4" />
          ) : (
            dict.newsletter.cta
          )}
        </Button>
      </form>
      {state?.error && (
        <p className="text-xs text-destructive mt-2 font-medium">
          {state.error}
        </p>
      )}
    </div>
  );
}
