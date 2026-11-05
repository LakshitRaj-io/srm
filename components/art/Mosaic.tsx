import { Parallax } from "./Parallax";

type Shot = { src: string; alt: string };

// Three photos at different sizes, drifting at different speeds so the group has depth.
export function Mosaic({ shots }: { shots: [Shot, Shot, Shot] }) {
  const [a, b, c] = shots;
  return (
    <div className="wrap grid gap-3 md:grid-cols-12">
      <Parallax {...a} speed={14} sizes="(min-width:768px) 58vw, 100vw" className="h-[calc(var(--vh)*44)] md:col-span-7 md:row-span-2 md:h-[calc(var(--vh)*68)]" />
      <Parallax {...b} speed={7} sizes="(min-width:768px) 42vw, 100vw" className="h-[calc(var(--vh)*30)] md:col-span-5 md:h-auto" />
      <Parallax {...c} speed={20} sizes="(min-width:768px) 42vw, 100vw" className="h-[calc(var(--vh)*30)] md:col-span-5 md:h-auto" />
    </div>
  );
}
