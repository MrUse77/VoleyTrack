import type { HTMLAttributes, ReactNode } from "react";

interface SectionShellProps extends HTMLAttributes<HTMLElement> {
	eyebrow?: string;
	title?: string;
	description?: string;
	actions?: ReactNode;
}

export function SectionShell({
	eyebrow,
	title,
	description,
	actions,
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
