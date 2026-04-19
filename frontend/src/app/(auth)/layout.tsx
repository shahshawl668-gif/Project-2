export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative isolate flex min-h-screen items-center justify-center bg-transparent px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.16),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_28%)]" />
      {children}
    </div>
  );
}
