// @vitest-environment jsdom
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ChangePasswordPage } from "./ChangePasswordPage";
import { LoginPage } from "./LoginPage";

/**
 * Appearance pins for the two auth screens' branding column.
 *
 * Both auth screens render a branding column as `main`'s first element child. These pins
 * capture its full markup identity — the element structure, the exact class list of the
 * column, of the mark/wordmark block and of the claim, the mark's presence and text, the
 * wordmark separated from the mark, and the claim's text — plus the form column's own class
 * list, so a later change to either screen cannot move the branding without failing here.
 *
 * The pin is the whole object compared with `toEqual`, not a set of `toContain` probes: a
 * field-by-field pin with `toContain` can pass while an added class, a swapped element or a
 * reordered child slips through. When the two screens are unified, the change-password pin
 * is updated deliberately, and the diff between the old and the new object is the record of
 * exactly what changed on that screen.
 */
type BrandingPin = {
	mainClassName: string;
	brandingTag: string;
	brandingClassName: string;
	brandingTestId: string | null;
	logoTag: string;
	logoClassName: string;
	/** The wordmark alone: the logo block's own text nodes, with the mark's text excluded. */
	wordmark: string;
	markTag: string | null;
	markClassName: string | null;
	markText: string | null;
	claimTag: string;
	claimClassName: string;
	claimText: string;
	formColumnTag: string;
	formColumnClassName: string;
};

function brandingPinOf(page: ReactElement): BrandingPin {
	const host = document.createElement("div");
	host.innerHTML = renderToStaticMarkup(page);

	const main = host.querySelector("main");

	if (!main) {
		throw new Error("auth page rendered no <main>");
	}

	const branding = main.firstElementChild;
	const formColumn = main.lastElementChild;

	if (!branding || !formColumn) {
		throw new Error("auth page rendered no branding or form column");
	}

	const logo = branding.firstElementChild;
	const claim = branding.lastElementChild;

	if (!logo || !claim) {
		throw new Error("branding column rendered no logo or claim");
	}

	// The mark is the logo block's own `aria-hidden` element. It is absent on a screen whose
	// wordmark carries the mark as bare text, so the pin records its absence rather than
	// silently reading the text node as if it were the mark.
	const mark = logo.querySelector('[aria-hidden="true"]');
	const wordmark = [...logo.childNodes]
		.filter((node) => node.nodeType === Node.TEXT_NODE)
		.map((node) => node.textContent ?? "")
		.join("")
		.trim();

	return {
		mainClassName: main.className,
		brandingTag: branding.tagName.toLowerCase(),
		brandingClassName: branding.className,
		brandingTestId: branding.getAttribute("data-testid"),
		logoTag: logo.tagName.toLowerCase(),
		logoClassName: logo.className,
		wordmark,
		markTag: mark?.tagName.toLowerCase() ?? null,
		markClassName: mark?.className ?? null,
		markText: mark?.textContent ?? null,
		claimTag: claim.tagName.toLowerCase(),
		claimClassName: claim.className,
		claimText: claim.textContent ?? "",
		formColumnTag: formColumn.tagName.toLowerCase(),
		formColumnClassName: formColumn.className,
	};
}

describe("auth branding column", () => {
	// Pinned BEFORE the unification, against the untouched login screen. Design source:
	// frontend/design/html/voleytrack-login.html — `.branding` (line 43) is the --surface
	// column with an 80px padding and a 1px --border right edge, holding the 48px/900
	// -0.03em wordmark beside a 54px mark (lines 44-45) and the 16px --muted 32ch claim
	// (line 46); `.login-wrap` (line 42) pins the column at 640px and hides it below 920px
	// (line 62).
	it("pins the login screen's design-aligned branding column", () => {
		expect(brandingPinOf(<LoginPage />)).toEqual({
			mainClassName:
				"grid min-h-svh w-full grid-cols-1 bg-vt-background text-vt-text min-[920px]:grid-cols-[640px_minmax(0,1fr)]",
			brandingTag: "section",
			brandingClassName:
				"hidden flex-col justify-center border-r border-vt-border bg-vt-surface p-20 min-[920px]:flex",
			// The one field the unification moved on this screen: the testid the block used to
			// carry ("login-branding") named the screen it was drawn on, and the block is now
			// shared, so it carries the shared name. Nothing visual on this screen changed.
			brandingTestId: "auth-branding",
			logoTag: "div",
			logoClassName: "flex items-center gap-3 text-[48px] font-black tracking-[-0.03em] text-vt-text",
			wordmark: "VoleyTrack",
			markTag: "span",
			markClassName: "grid size-[54px] shrink-0 place-items-center",
			markText: "🏐",
			claimTag: "p",
			claimClassName: "mt-4 mb-0 max-w-[32ch] text-base text-vt-muted",
			claimText: "Gestión de staff, equipos, jugadores y torneos.",
			formColumnTag: "section",
			formColumnClassName: "flex items-center justify-center bg-vt-background p-10",
		});
	});

	// Updated DELIBERATELY when the two auth screens were unified, against the pin that was
	// written first and confirmed green on the untouched screen. The old pin read:
	//   mainClassName        "...lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)]"
	//   brandingClassName    "flex flex-col justify-center bg-vt-surface px-6 py-12 text-center
	//                         sm:px-10 sm:py-16 lg:py-0 lg:pt-5 lg:pl-[80px] lg:pr-20 lg:text-left"
	//   brandingTestId       null
	//   logoTag/logoClassName  "p" / "m-0 text-[32px] font-black leading-[60px] text-vt-text
	//                            lg:w-[400px] lg:text-[48px]"
	//   wordmark             "🏐 VoleyTrack"
	//   markTag/markClassName/markText  null / null / null
	//   claimClassName       "mx-auto mt-5 mb-0 max-w-[480px] text-sm leading-6 text-vt-muted
	//                         sm:text-base lg:mx-0 lg:leading-10"
	//   claimText            "El sistema definitivo para gestión y análisis de ligas de vóley."
	// Every changed field is a change the design's own branding column makes, not a pin
	// weakened to pass: the column is now the design's (the 640px grid slot, hidden below
	// 920px, 80px padding, the 1px --border right edge), the wordmark is the design's
	// 48px/900 -0.03em block, the mark is the design's 54px element instead of bare text
	// inside the wordmark, and the claim is the design's own sentence. The form column's own
	// markup is untouched.
	it("pins the change-password screen's branding column after the unification", () => {
		expect(brandingPinOf(<ChangePasswordPage />)).toEqual({
			mainClassName:
				"grid min-h-svh w-full grid-cols-1 bg-vt-background text-vt-text min-[920px]:grid-cols-[640px_minmax(0,1fr)]",
			brandingTag: "section",
			brandingClassName:
				"hidden flex-col justify-center border-r border-vt-border bg-vt-surface p-20 min-[920px]:flex",
			brandingTestId: "auth-branding",
			logoTag: "div",
			logoClassName: "flex items-center gap-3 text-[48px] font-black tracking-[-0.03em] text-vt-text",
			wordmark: "VoleyTrack",
			markTag: "span",
			markClassName: "grid size-[54px] shrink-0 place-items-center",
			markText: "🏐",
			claimTag: "p",
			claimClassName: "mt-4 mb-0 max-w-[32ch] text-base text-vt-muted",
			claimText: "Gestión de staff, equipos, jugadores y torneos.",
			formColumnTag: "section",
			formColumnClassName: "bg-vt-background",
		});
	});
});
