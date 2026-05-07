import "./ui/widget.css";
import { mountWidget } from "./ui/mount";

const SELECTOR = "[data-dogfood-calc]";

const mountAll = (): void => {
  const hosts = document.querySelectorAll<HTMLElement>(SELECTOR);
  hosts.forEach((el) => mountWidget(el));
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountAll, { once: true });
} else {
  mountAll();
}

// Re-mount hook for hosts (Duda, dynamic loaders) that inject the widget
// after the initial load. Call window.DogFoodCalc.mountAll() yourself,
// or rely on the MutationObserver below.
const observer = new MutationObserver(() => mountAll());
observer.observe(document.documentElement, { childList: true, subtree: true });

interface DogFoodCalcGlobal {
  readonly mountAll: () => void;
  readonly mount: (el: HTMLElement) => void;
}

const api: DogFoodCalcGlobal = {
  mountAll,
  mount: mountWidget,
};

(window as unknown as { DogFoodCalc: DogFoodCalcGlobal }).DogFoodCalc = api;

export { mountWidget, mountAll };
