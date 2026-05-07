/**
 * Breed-group tables — 1:1 port of the Python spec in spec/dogfoodcalc.docx.
 *
 * Known issues preserved from the spec (to be addressed in a separate pass):
 *   - "poodle" appears in both group1 and group2; group1 wins.
 *   - "boxer" appears in both group2 and group6; group2 wins.
 *   - "doberman" appears in both group2 and group7; group2 wins.
 *   - "mixed breed" listed twice in group1.
 *   - Lookup is exact-match on lowercased input; "golden retriever puppy"
 *     would not match.
 */

export interface BreedGroup {
  readonly name: string;
  readonly adjustment: number;
  readonly breeds: readonly string[];
}

export const BREED_GROUPS: readonly BreedGroup[] = [
  {
    name: "group 1",
    adjustment: 0.1,
    breeds: [
      "mixed breed",
      "golden retriever",
      "cockapoo",
      "german shepherd",
      "poodle",
      "cocker spaniel",
      "cavapoo",
      "irish terrier",
      "spitz",
      "kerry blue terrier",
      "soft coated",
      "wheaten terrier",
      "irish water spaniel",
      "kerry beagle",
      "mixed breed",
      "beagle",
      "chihuahua",
      "yorkshire",
      "rottweiler",
      "akita",
      "pinscher",
      "cane corso",
      "shiba",
    ],
  },
  {
    name: "group 2",
    adjustment: 0.0,
    breeds: [
      "bichon frise",
      "dachshund",
      "irish wolfhound",
      "maltese",
      "saint bernard",
      "shar pei",
      "great dane",
      "glen of imaal terrier",
      "english springer spaniel",
      "border terrier",
      "labradoodle",
      "poodle",
      "pomeranian",
      "schnauzer",
      "doberman",
      "boxer",
      "newfoundland",
      "great pyrenees",
      "chow chow",
      "samoyed",
      "gordon setter",
      "bearded collie",
      "cavalier king charles spaniel",
      "cairn terrier",
      "west highland white terrier",
      "scottish terrier",
      "labrador",
    ],
  },
  {
    name: "group 3",
    adjustment: -0.1,
    breeds: [
      "french bulldog",
      "english bulldog",
      "basset",
      "corgi",
      "staffordshire bull terrier",
    ],
  },
  {
    name: "group 4",
    adjustment: -0.2,
    breeds: ["pug"],
  },
  {
    name: "group 5",
    adjustment: -0.05,
    breeds: ["shih tzu", "american bulldog", "lhasa apso"],
  },
  {
    name: "group 6",
    adjustment: 0.2,
    breeds: [
      "jack russell",
      "irish setter (red or white)",
      "border collie",
      "malinois",
      "siberian husky",
      "greyhound",
      "whippet",
      "boxer",
      "australian shepherd",
      "weimaraner",
      "saluki",
      "pointer",
      "vizsla",
      "kelpie",
    ],
  },
  {
    name: "group 7",
    adjustment: 0.15,
    breeds: ["doberman", "dalmatian"],
  },
];

export const DEFAULT_BREED_ADJUSTMENT = 0.1;
