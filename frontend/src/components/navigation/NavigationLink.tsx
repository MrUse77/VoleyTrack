import type { ComponentProps } from "react";
import { Link } from "@tanstack/react-router";

type NavigationLinkProps = Omit<ComponentProps<typeof Link>, "search"> & {
  /**
   * The target route's search params. TanStack Router derives this prop's type from the literal
   * `to` of a concrete link, which a wrapper accepting any path cannot restate, so it is
   * declared as a plain object here and forwarded unchanged (`/matches?status=live` and
   * `/planillero?partido=…` are the two live call sites).
   */
  search?: Record<string, unknown>;
};

/**
 * The app's internal link, and the one place that decides what a link may say about the
 * current location.
 *
 * Why this exists: TanStack Router's own `Link` sets `aria-current="page"` whenever it
 * considers itself active (`node_modules/@tanstack/react-router/dist/esm/link.js`,
 * `STATIC_ACTIVE_PROPS`), and by default "active" means *the current path starts with the
 * link's path* (`resolveIsActive`, the non-exact branch). Every link pointing at an ancestor
 * route therefore announced itself as "the current page" too - the section entry and the page
 * entry both claimed to be the page you are on, which is the one thing
 * `aria-current="page"` is defined to mean. That default cannot be overridden per link by
 * passing `aria-current` ourselves: the static active props are spread after the caller's
 * props, so an active `Link` always ends up with `page`.
 *
 * The fix is to make the library's own notion of "active" exact, once, here. With
 * `activeOptions.exact`, an ancestor link is not active at all, so the library adds nothing
 * and the marker becomes something this app decides:
 *
 * - **The link that is the current location** carries `aria-current="page"`. The library
 *   still produces it on its own for an exact match, so nothing has to restate it.
 * - **The section ancestor that contains the current location** carries
 *   `aria-current="location"` ("the current location is inside this entry"). Only navigation
 *   renders this, and `Sidebar` computes it from the path it is given - see `Sidebar.tsx`.
 *   A sibling tab whose path merely *prefixes* the current one (`Resumen` under
 *   `/tournaments/$id/standings`) is not a section that contains the page, so it carries
 *   nothing.
 * - **Action links** ("Volver", "Cancelar", a header call to action) carry no `aria-current`
 *   at all: they are a way out of the page, not a claim about where you are. A back link is
 *   the clearest case - on `/matches/$id/live` the only element claiming to be the current
 *   page used to be the `Volver` link pointing at `/matches`, which is the exact opposite of
 *   the current location.
 *
 * Two links that genuinely point at the same place (the shell's `Ver en vivo` call to action
 * on `/matches?status=live`, beside the sidebar's own `Partidos` entry) may both carry `page`:
 * accuracy is the invariant here, not cardinality, and suppressing an honest marker to reach a
 * count of one would make the markup less true, not more. A page with no link to its own
 * location (`/admin/matches/$id/scoring`) legitimately carries none.
 *
 * `activeOptions` is always spread last, so a call site cannot relax the exactness that this
 * rule depends on; callers may still tighten it (`includeSearch`, `explicitUndefined`).
 * `src/router.test.tsx` walks every route with the real router and fails if any element claims
 * `page` without pointing at the current location, or if a section ancestor loses `location`.
 *
 * Every internal link in the app imports this module under the module-local name `Link`
 * (`import { NavigationLink as Link } from ".../NavigationLink";`), so no screen can pick the
 * library's fuzzy marking back up by accident.
 */
export function NavigationLink({ activeOptions, search, ...props }: NavigationLinkProps) {
  return (
    <Link
      {...props}
      activeOptions={{ ...activeOptions, exact: true }}
      search={search as ComponentProps<typeof Link>["search"]}
    />
  );
}
