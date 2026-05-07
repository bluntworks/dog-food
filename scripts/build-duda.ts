/**
 * Wraps the Vite library output (dist/) into a Duda Widget Builder package.
 *
 * Output: duda-widget/{widget.html, widget.css, widget.js, widget.json}
 *
 * `widget.html` declares the mount point with property bindings; `widget.json`
 * is the property manifest. The Duda editor reads the manifest, presents the
 * properties to the site owner, and substitutes their values into the
 * `{{property}}` placeholders in the HTML.
 */

import { mkdir, copyFile, writeFile, readFile, rm } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const dist = resolve(root, "dist");
const out = resolve(root, "duda-widget");

const WIDGET_HTML = `<div
  data-dogfood-calc
  data-heading="{{heading}}"
  data-subheading="{{subheading}}"
  data-cta-label="{{ctaLabel}}"
  data-food-kcal-per-kg="{{foodKcalPerKg}}"
  data-kibble-kcal-per-kg="{{kibbleKcalPerKg}}"
  data-food-split-percent="{{foodSplitPercent}}"
  data-default-mode="{{defaultMode}}"
  data-enable-mixed-mode="{{enableMixedMode}}"
></div>
`;

const WIDGET_JSON = {
  name: "Dog Food Calculator",
  description:
    "Personalized daily energy and food-portion calculator for dogs.",
  version: "0.1.0",
  properties: [
    {
      name: "heading",
      label: "Heading text",
      type: "text",
      default: "Build your dog's feeding plan",
    },
    {
      name: "subheading",
      label: "Subheading text",
      type: "text",
      default:
        "Tell us a bit about your dog and we'll work out their daily energy needs.",
    },
    {
      name: "ctaLabel",
      label: "Button label",
      type: "text",
      default: "Calculate daily portion",
    },
    {
      name: "foodKcalPerKg",
      label: "Food energy density (kcal/kg)",
      type: "number",
      default: 1345,
    },
    {
      name: "kibbleKcalPerKg",
      label: "Kibble energy density (kcal/kg)",
      type: "number",
      default: 1345,
    },
    {
      name: "foodSplitPercent",
      label: "Food share in mixed mode (%)",
      type: "number",
      default: 80,
    },
    {
      name: "defaultMode",
      label: "Default serving mode",
      type: "select",
      options: [
        { value: "food-only", label: "Only food" },
        { value: "mixed", label: "Food + kibble" },
      ],
      default: "mixed",
    },
    {
      name: "enableMixedMode",
      label: "Allow visitors to switch modes",
      type: "boolean",
      default: true,
    },
  ],
} as const;

const main = async (): Promise<void> => {
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });

  // The IIFE bundle and CSS produced by `vite build`.
  await copyFile(
    resolve(dist, "dogfoodcalc.iife.js"),
    resolve(out, "widget.js"),
  );
  await copyFile(resolve(dist, "dogfoodcalc.css"), resolve(out, "widget.css"));

  await writeFile(resolve(out, "widget.html"), WIDGET_HTML, "utf8");
  await writeFile(
    resolve(out, "widget.json"),
    JSON.stringify(WIDGET_JSON, null, 2),
    "utf8",
  );

  // Sanity: confirm the JS file actually contains the expected global.
  const js = await readFile(resolve(out, "widget.js"), "utf8");
  if (!js.includes("DogFoodCalc")) {
    throw new Error("widget.js does not expose DogFoodCalc — build broken?");
  }

  console.log(`✓ Duda widget package written to ${out}`);
  console.log(
    "  Files: widget.html, widget.css, widget.js, widget.json — zip the directory and upload to Duda Widget Builder.",
  );
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
