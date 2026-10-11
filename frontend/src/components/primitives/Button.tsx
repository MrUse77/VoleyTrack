import type { ButtonHTMLAttributes } from "react";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "./buttonClasses";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
};

/**
 * The design's pill button. The `.btn` treatments themselves — their design source, the
 * variant-to-class mapping and the exported `buttonClasses` used by link-shaped buttons live
 * in `./buttonClasses.ts`, because this module may only export components
 * (eslint react-refresh/only-export-components).
 */
export function Button({ className = "", size = "md", type = "button", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={buttonClasses(variant, size, className)}
      type={type}
      {...props}
    />
  );
}
