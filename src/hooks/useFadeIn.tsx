import { useEffect, useRef, ReactNode } from "react";

export function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("animate-fade-in-up");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export function FadeIn({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useFadeIn();
  return <div ref={ref} className={className}>{children}</div>;
}
