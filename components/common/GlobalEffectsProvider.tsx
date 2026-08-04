"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { loadAnimateCss, loadTextAnimationCss } from "@/lib/plugin-styles";

function runWhenBrowserIdle(callback: () => void, timeout = 2500) {
  if (typeof window === "undefined") return () => {};

  let cancelled = false;
  let idleId: number | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const run = () => {
    if (cancelled) return;
    callback();
  };

  const ric = window.requestIdleCallback?.bind(window);
  if (ric) {
    idleId = ric(run, { timeout });
  } else {
    timeoutId = setTimeout(run, Math.min(timeout, 1200));
  }

  return () => {
    cancelled = true;
    if (idleId != null && window.cancelIdleCallback) {
      window.cancelIdleCallback(idleId);
    }
    if (timeoutId) clearTimeout(timeoutId);
  };
}

export default function GlobalEffectsProvider() {
  const hasLoadedBootstrap = useRef(false);
  const bootstrapRef = useRef<{ Modal: any; Offcanvas: any } | null>(null);
  const wowRef = useRef<any>(null);
  const gsapRef = useRef<any>(null);
  const scrollTriggerRef = useRef<any>(null);
  const splitTextRef = useRef<any>(null);
  const hasLoadedGsap = useRef(false);
  const hasLoadedAnimateCss = useRef(false);
  const hasLoadedTextAnimCss = useRef(false);

  const pathname = usePathname();
  const isMobileViewport = () =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 991px)").matches;

  const ensureGsapLoaded = async () => {
    if (hasLoadedGsap.current && gsapRef.current && scrollTriggerRef.current && splitTextRef.current) {
      return true;
    }

    if (!hasLoadedTextAnimCss.current) {
      await loadTextAnimationCss();
      hasLoadedTextAnimCss.current = true;
    }

    const [{ gsap }, { ScrollTrigger }, splitTextModule] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/SplitText"),
    ]);

    const SplitText = splitTextModule.default;
    gsap.registerPlugin(ScrollTrigger, SplitText);

    gsapRef.current = gsap;
    scrollTriggerRef.current = ScrollTrigger;
    splitTextRef.current = SplitText;
    hasLoadedGsap.current = true;

    return true;
  };

  // Load Bootstrap JS only once on client (idle — not needed for first paint)
  useEffect(() => {
    if (typeof window === "undefined" || hasLoadedBootstrap.current) return;

    return runWhenBrowserIdle(() => {
      if (hasLoadedBootstrap.current) return;
      import("bootstrap/dist/js/bootstrap.esm")
        .then((module) => {
          hasLoadedBootstrap.current = true;
          bootstrapRef.current = module;
        })
        .catch(() => {});
    }, 3000);
  }, []);

  // Close any open modals/offcanvas on route change
  useEffect(() => {
    if (!hasLoadedBootstrap.current || !bootstrapRef.current) return;

    const bootstrap = bootstrapRef.current;

    document.querySelectorAll(".modal.show").forEach((modal) => {
      const instance = bootstrap.Modal.getOrCreateInstance(modal);
      if (instance) instance.hide();
    });

    document.querySelectorAll(".offcanvas.show").forEach((offcanvas) => {
      const instance = bootstrap.Offcanvas.getOrCreateInstance(offcanvas);
      if (instance) instance.hide();
    });
  }, [pathname]);

  // WOW.js — idle / first scroll (skip on mobile)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isMobileViewport()) return;

    let started = false;
    let cancelIdle: (() => void) | null = null;

    const initWow = async () => {
      if (started) return;
      started = true;

      if (!hasLoadedAnimateCss.current) {
        await loadAnimateCss();
        hasLoadedAnimateCss.current = true;
      }

      if (!wowRef.current) {
        const module = (await import("@/utils/wow")).default;
        wowRef.current = new module({ mobile: false });
        wowRef.current.init();
      } else {
        wowRef.current.sync();
      }
    };

    const onScroll = () => {
      void initWow();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true, once: true });
    window.addEventListener("pointerdown", onScroll, { once: true });
    cancelIdle = runWhenBrowserIdle(() => {
      void initWow();
    }, 2800);

    return () => {
      cancelIdle?.();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onScroll);
    };
  }, [pathname]);

  // tf-animate visibility helpers — idle after route change
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isMobileViewport()) return;

    let removeScroll: (() => void) | null = null;

    const cancelIdle = runWhenBrowserIdle(() => {
      function debounce(fn: (...args: any[]) => void, delay: number) {
        let timeoutId: ReturnType<typeof setTimeout>;
        return (...args: any[]) => {
          if (timeoutId) clearTimeout(timeoutId);
          timeoutId = setTimeout(() => fn(...args), delay);
        };
      }

      const elements = document.querySelectorAll(
        ".tf-animate-1, .tf-animate-2, .tf-animate-3, .tf-animate-4"
      );

      const checkVisible = () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;

        elements.forEach((el) => {
          if (el.classList.contains("active-animate")) return;

          const rect = el.getBoundingClientRect();
          const elementTop = rect.top + scrollPosition;
          const elementBottom = elementTop + (el as HTMLElement).offsetHeight;

          if (
            scrollPosition + windowHeight * 0.9 > elementTop &&
            scrollPosition < elementBottom
          ) {
            const delay = parseFloat(el.getAttribute("data-delay") ?? "0") || 0;
            setTimeout(() => {
              el.classList.add("active-animate");
            }, delay * 1000);
          }
        });
      };

      const debouncedScroll = debounce(checkVisible, 50);
      checkVisible();
      window.addEventListener("scroll", debouncedScroll);
      removeScroll = () => window.removeEventListener("scroll", debouncedScroll);
    }, 2000);

    return () => {
      cancelIdle();
      removeScroll?.();
    };
  }, [pathname]);

  // GSAP text / scroll effects — idle or first scroll
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isMobileViewport()) return;

    let isCancelled = false;
    let started = false;

    const runAnimations = async () => {
      if (started || isCancelled) return;
      started = true;

      await ensureGsapLoaded();
      if (isCancelled || !gsapRef.current || !scrollTriggerRef.current || !splitTextRef.current) return;

      const gsap = gsapRef.current;
      const SplitText = splitTextRef.current;

      if (window.innerWidth <= 550) {
        const animatedTextElements = document.querySelectorAll(
          ".text-anime-wave, .text-anime-wave-1, .text-anime-wave-2"
        );
        animatedTextElements.forEach((el) => {
          const animEl = el as Element & { animation?: any };
          if (animEl.animation) {
            animEl.animation.progress(1).kill();
          }
          gsap.set(animEl, { clearProps: "all" });
        });
        return;
      }

      const waveElements = document.querySelectorAll(
        ".text-anime-wave, .text-anime-wave-1, .text-anime-wave-2, .text-anime-wave-3"
      );

      waveElements.forEach((el) => {
        const animEl = el as Element & { animation?: any };
        if (animEl.animation) {
          animEl.animation.progress(1).kill();
        }

        let origin = "left center";
        let rotateStart = -90;
        const delay = parseFloat(el.getAttribute("data-delay") ?? "0") || 0;

        if (el.classList.contains("text-anime-wave-1")) {
          origin = "center center";
        } else if (el.classList.contains("text-anime-wave-2")) {
          origin = "right center";
          rotateStart = 90;
        }

        gsap.set(el, {
          opacity: 0,
          rotateY: rotateStart,
          transformOrigin: origin,
        });

        (el as any).animation = gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          opacity: 1,
          rotateY: 0,
          duration: 1,
          delay: delay,
          ease: "back.out(1.7)",
        });
      });

      const colorElements = document.querySelectorAll(".text-color-change");

      colorElements.forEach((el) => {
        const animEl = el as Element & {
          wordSplit?: any;
          charSplit?: any;
          animation?: any;
        };

        if (animEl.wordSplit) animEl.wordSplit.revert();
        if (animEl.charSplit) animEl.charSplit.revert();

        animEl.wordSplit = new SplitText(animEl, {
          type: "words",
          wordsClass: "word-wrapper",
        });

        animEl.charSplit = new SplitText(animEl.wordSplit.words, {
          type: "chars",
          charsClass: "char-wrapper",
        });

        gsap.set(animEl.charSplit.chars, {
          color: "#A2A3AB",
          opacity: 1,
        });

        animEl.animation = gsap.to(animEl.charSplit.chars, {
          scrollTrigger: {
            trigger: animEl,
            start: "top 90%",
            end: "bottom 35%",
            toggleActions: "play none none reverse",
            scrub: true,
          },
          color: "#24283E",
          stagger: {
            each: 0.05,
            from: "start",
          },
          duration: 0.5,
          ease: "power2.out",
        });
      });
    };

    const onInteract = () => {
      void runAnimations();
      window.removeEventListener("scroll", onInteract);
      window.removeEventListener("pointerdown", onInteract);
    };

    window.addEventListener("scroll", onInteract, { passive: true, once: true });
    window.addEventListener("pointerdown", onInteract, { once: true });
    const cancelIdle = runWhenBrowserIdle(() => {
      void runAnimations();
    }, 3200);

    return () => {
      isCancelled = true;
      cancelIdle();
      window.removeEventListener("scroll", onInteract);
      window.removeEventListener("pointerdown", onInteract);
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.getAll().forEach((st: any) => st.kill());
      }
    };
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isMobileViewport()) return;
    let isCancelled = false;
    let started = false;

    const run = async () => {
      if (started || isCancelled) return;
      started = true;
      await ensureGsapLoaded();
      if (isCancelled || !gsapRef.current) return;
      const gsap = gsapRef.current;

      if (!window.matchMedia("(min-width: 992px)").matches) return;

      if (document.querySelector(".scroll-tranform")) {
        gsap.to(".scroll-tranform", {
          y: -100,
          scrollTrigger: {
            trigger: ".scroll-tranform-section",
            start: "top center",
            end: "bottom top",
            scrub: 3,
          },
        });
      }

      if (document.querySelector(".scroll-tranform-up")) {
        gsap.to(".scroll-tranform-up", {
          y: 100,
          scrollTrigger: {
            trigger: ".scroll-tranform-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 3,
          },
        });
      }
    };

    const onInteract = () => {
      void run();
      window.removeEventListener("scroll", onInteract);
    };
    window.addEventListener("scroll", onInteract, { passive: true, once: true });
    const cancelIdle = runWhenBrowserIdle(() => {
      void run();
    }, 3500);

    return () => {
      isCancelled = true;
      cancelIdle();
      window.removeEventListener("scroll", onInteract);
    };
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isMobileViewport()) return;
    let isCancelled = false;
    let started = false;

    const run = async () => {
      if (started || isCancelled) return;
      started = true;
      await ensureGsapLoaded();
      if (isCancelled || !gsapRef.current) return;
      const gsap = gsapRef.current;

      if (!window.matchMedia("(min-width: 768px)").matches) return;

      const images = gsap.utils.toArray(".img-paralax");
      images.forEach((img: any) => {
        const element = img as HTMLElement;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: element,
            scrub: 3,
            pin: false,
          },
        });

        tl.fromTo(
          element,
          { yPercent: 0, ease: "none" },
          { yPercent: -10, ease: "none" }
        );
      });
    };

    const onInteract = () => {
      void run();
      window.removeEventListener("scroll", onInteract);
    };
    window.addEventListener("scroll", onInteract, { passive: true, once: true });
    const cancelIdle = runWhenBrowserIdle(() => {
      void run();
    }, 3500);

    return () => {
      isCancelled = true;
      cancelIdle();
      window.removeEventListener("scroll", onInteract);
    };
  }, [pathname]);

  return null;
}
