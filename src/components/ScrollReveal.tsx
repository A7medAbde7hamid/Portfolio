import { useEffect, useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: "fade" | "left" | "right" | "scale";
  delay?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

const ScrollReveal = ({
  children,
  animation = "fade",
  delay = 0,
  className = "",
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, delay);

            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            entry.target.classList.remove("visible");
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [delay, once, threshold]);

  const getAnimationClass = () => {
    switch (animation) {
      case "left":
        return "scroll-reveal-left";
      case "right":
        return "scroll-reveal-right";
      case "scale":
        return "scroll-reveal-scale";
      default:
        return "scroll-reveal";
    }
  };

  return (
    <div ref={elementRef} className={`${getAnimationClass()} ${className}`}>
      {children}
    </div>
  );
};

export default ScrollReveal;
