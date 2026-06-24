import type { ButtonHTMLAttributes, ReactNode } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly children: ReactNode
  readonly tone?: "primary" | "secondary"
}

export function Button({ children, className = "", tone = "primary", ...props }: ButtonProps) {
  const tones = {
    primary: "bg-lime text-ink hover:bg-cream",
    secondary: "border border-cream/20 text-cream hover:border-lime hover:text-lime",
  } as const
  return (
    <button className={`rounded-full px-5 py-3 font-black transition ${tones[tone]} ${className}`} {...props}>
      {children}
    </button>
  )
}
