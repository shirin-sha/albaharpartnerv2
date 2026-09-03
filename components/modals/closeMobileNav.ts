/** Custom mobile nav (not Bootstrap Offcanvas) — keep open/close in one place. */
export function closeMobileNav() {
  if (typeof document === "undefined") return;

  const el = document.getElementById("canvasMobile");
  if (el) {
    el.classList.remove("show");
    el.style.visibility = "";
    el.style.transform = "";
    el.setAttribute("aria-hidden", "true");
  }

  document.body.classList.remove("overflow-hidden");
  document.querySelectorAll(".mobile-nav-backdrop").forEach((b) => b.remove());
}

/** Let the Link click finish (Next.js navigation) before hiding the panel. */
export function closeMobileNavSoon() {
  if (typeof window === "undefined") return;
  window.setTimeout(closeMobileNav, 0);
}
