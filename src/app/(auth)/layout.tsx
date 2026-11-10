import { Logo } from "@/components/brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="hl-hero min-h-dvh">
      <div className="mx-auto max-w-lg px-4 pb-16 pt-6">
        <Logo className="mb-6" />
        {children}
      </div>
    </div>
  );
}
