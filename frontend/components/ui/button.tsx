import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({ children, variant = "default", size = "md", className, ...props }: ButtonProps) {
  return (
    <button className={cn(
      "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50",
      variant === "default" && "bg-green-600 text-white hover:bg-green-700",
      variant === "outline" && "border border-gray-300 text-gray-700 hover:bg-gray-50",
      variant === "ghost" && "text-gray-700 hover:bg-gray-100",
      variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
      size === "sm" && "px-3 py-1.5 text-sm",
      size === "md" && "px-4 py-2 text-sm",
      size === "lg" && "px-6 py-3 text-base",
      className
    )} {...props}>
      {children}
    </button>
  );
}
