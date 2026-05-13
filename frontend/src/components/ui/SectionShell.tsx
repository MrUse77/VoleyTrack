import type { HTMLAttributes, ReactNode } from "react";

type SectionShellProps = HTMLAttributes<HTMLElement> & {
	eyebrow?: string;
	title?: string;
	description?: string;
	actions?: ReactNode;
};

export function SectionShell({
	className = "",
	eyebrow,
	title,
	description,
	actions,
	children,
	...props
}: SectionShellProps) {
	return (
		<section className={`space-y-6 ${className}`.trim()} {...props}>
			{(eyebrow || title || description || actions) && (
				<header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className="space-y-2">
						{eyebrow && (
							<p className="text-[10px] font-bold uppercase tracking-[0.28em] text-vt-muted">
								{eyebrow}
							</p>
						)}
						{title && (
							<h2 className="text-2xl font-black uppercase tracking-[-0.05em] text-white sm:text-[2rem]">
								{title}
							</h2>
						)}
						{description && (
							<p className="max-w-2xl text-sm leading-6 text-vt-muted">
								{description}
							</p>
						)}
					</div>
					{actions && <div className="flex items-center gap-2">{actions}</div>}
				</header>
			)}
			{children}
		</section>
	);
}
