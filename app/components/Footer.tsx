"use client";

export function Footer({ name }: { name: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      &copy; {year} Designed & Built by {name}
    </footer>
  );
}