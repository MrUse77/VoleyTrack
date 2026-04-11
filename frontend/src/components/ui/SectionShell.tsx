import type { HTMLAttributes } from "react";

type SectionShellProps = HTMLAttributes<HTMLElement>;

export function SectionShell({
	className = "",
	children,
	...props
}: SectionShellProps) {
	return (
		<section className={`space-y-6 ${className}`.trim()} {...props}>
			{children}
		</section>
	);
}
