export function Footer() {
  return (
    <footer className="bg-steel text-on-steel-muted border-t-4 border-[#282c31]">
      <div className="wrap py-6 flex flex-wrap justify-between gap-4 t-data">
        <span>© {new Date().getFullYear()} adalbertdb</span>
        <span>Next.js · Tailwind CSS</span>
      </div>
    </footer>
  );
}
