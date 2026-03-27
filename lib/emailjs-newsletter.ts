const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '';
const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '';
const templateId = process.env.NEXT_PUBLIC_EMAILJS_NEWSLETTER_TEMPLATE_ID ?? '';

export function isNewsletterEmailJsConfigured(): boolean {
  return Boolean(
    publicKey.length > 0 && serviceId.length > 0 && templateId.length > 0
  );
}

/**
 * Šalje prijavu na newsletter preko EmailJS-a.
 * U EmailJS šablonu koristi iste ključeve: subscriber_email, source, site.
 */
export async function sendNewsletterSignup(email: string): Promise<void> {
  if (!isNewsletterEmailJsConfigured()) {
    throw new Error('EMAILJS_NOT_CONFIGURED');
  }

  const emailjs = (await import('@emailjs/browser')).default;

  await emailjs.send(
    serviceId,
    templateId,
    {
      subscriber_email: email,
      source: 'popbeauty-newsletter',
      site: 'Pop Beauty',
    },
    { publicKey }
  );
}
