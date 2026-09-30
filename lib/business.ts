/**
 * Company details shown on the site, in one place.
 *
 * The contact details here, the address and opening hours in the dictionaries (contact.info), and
 * the About page story and team are demonstration content. Replace them with the real ones and set
 * `isDemo` to false; while it is true, the About and Contact pages say so to visitors.
 */
export const BUSINESS = {
  isDemo: true,
  email: "contact@theironvault.md",
  phone: { display: "+373 22 000 000", tel: "+37322000000" },
} as const;
