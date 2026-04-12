/**
 * Werkwoordlab-specific misconception domain types and editor config.
 * Local to werkwoordlab — not portable to grammar-core.
 */

export type MisconceptionCode =
  | "PV_STAM_T_OMISSION"
  | "PV_FALSE_T_ADD"
  | "PV_JIJ_INVERSION_FALSE_T"
  | "PV_MEERVOUD_T_ADDITION"
  | "VD_KOFSCHIP_MISAPPLIED"
  | "VD_IRREGULAR_PP_REGULARIZED"
  | "HOMOPHONE_FUNCTION_CONFUSION"
  | "VT_DE_TE_CONFUSION"
  | "VT_VD_FUNCTION_CONFUSION"
  | "VT_ENKELVOUD_MEERVOUD"
  | "VT_RUWE_STAM_OVERRIDE"
  | "INF_PV_CONFUSION"
  | "INF_VD_CONFUSION"
  | "VD_ADJ_FUNCTION_CONFUSION"
  | "OVD_FUNCTION_CONFUSION";

export const MISCONCEPTION_TITLES: Record<MisconceptionCode, string> = {
  PV_STAM_T_OMISSION: "Stam+t weggelaten",
  PV_FALSE_T_ADD: "Onterechte +t toegevoegd",
  PV_JIJ_INVERSION_FALSE_T: "Onterechte +t bij inversie met jij",
  PV_MEERVOUD_T_ADDITION: "Onterechte +t bij meervoud",
  VD_KOFSCHIP_MISAPPLIED: "'t kofschip-regel fout toegepast",
  VD_IRREGULAR_PP_REGULARIZED: "Onregelmatig voltooid deelwoord geregulariseerd",
  HOMOPHONE_FUNCTION_CONFUSION: "Homofone vorm verward door functiefout",
  VT_DE_TE_CONFUSION: "Verkeerde uitgang -de of -te (verleden tijd)",
  VT_VD_FUNCTION_CONFUSION: "Voltooid deelwoord gebruikt als persoonsvorm VT",
  VT_ENKELVOUD_MEERVOUD: "Enkelvoud/meervoud verwisseld (verleden tijd)",
  VT_RUWE_STAM_OVERRIDE: "Ruwe stam niet herkend bij -de/-te keuze",
  INF_PV_CONFUSION: "Persoonsvorm gebruikt waar infinitief nodig is",
  INF_VD_CONFUSION: "Voltooid deelwoord gebruikt waar infinitief nodig is",
  VD_ADJ_FUNCTION_CONFUSION: "Bijvoeglijk en werkwoordelijk gebruik VD verward",
  OVD_FUNCTION_CONFUSION: "Onvoltooid deelwoord verward met PV of VD",
};

const MISCONCEPTION_CODE_SET = new Set<string>([
  "PV_STAM_T_OMISSION",
  "PV_FALSE_T_ADD",
  "PV_JIJ_INVERSION_FALSE_T",
  "PV_MEERVOUD_T_ADDITION",
  "VD_KOFSCHIP_MISAPPLIED",
  "VD_IRREGULAR_PP_REGULARIZED",
  "HOMOPHONE_FUNCTION_CONFUSION",
  "VT_DE_TE_CONFUSION",
  "VT_VD_FUNCTION_CONFUSION",
  "VT_ENKELVOUD_MEERVOUD",
  "VT_RUWE_STAM_OVERRIDE",
  "INF_PV_CONFUSION",
  "INF_VD_CONFUSION",
  "VD_ADJ_FUNCTION_CONFUSION",
  "OVD_FUNCTION_CONFUSION",
]);

export function isMisconceptionCode(code: string): code is MisconceptionCode {
  return MISCONCEPTION_CODE_SET.has(code);
}

// Editor-only grouping config — a plain convenience array, not a shared contract.
export const FEEDBACK_GROUPS = [
  {
    label: "Persoonsvorm (tegenwoordige tijd)",
    codes: [
      "PV_STAM_T_OMISSION",
      "PV_FALSE_T_ADD",
      "PV_JIJ_INVERSION_FALSE_T",
      "PV_MEERVOUD_T_ADDITION",
    ] as MisconceptionCode[],
  },
  {
    label: "Persoonsvorm (verleden tijd)",
    codes: [
      "VT_DE_TE_CONFUSION",
      "VT_VD_FUNCTION_CONFUSION",
      "VT_ENKELVOUD_MEERVOUD",
      "VT_RUWE_STAM_OVERRIDE",
    ] as MisconceptionCode[],
  },
  {
    label: "Voltooid deelwoord",
    codes: [
      "VD_KOFSCHIP_MISAPPLIED",
      "VD_IRREGULAR_PP_REGULARIZED",
    ] as MisconceptionCode[],
  },
  {
    label: "Homofoniefouten",
    codes: ["HOMOPHONE_FUNCTION_CONFUSION"] as MisconceptionCode[],
  },
  {
    label: "Infinitief",
    codes: [
      "INF_PV_CONFUSION",
      "INF_VD_CONFUSION",
    ] as MisconceptionCode[],
  },
  {
    label: "Bijvoeglijk deelwoord",
    codes: ["VD_ADJ_FUNCTION_CONFUSION"] as MisconceptionCode[],
  },
  {
    label: "Onvoltooid deelwoord",
    codes: ["OVD_FUNCTION_CONFUSION"] as MisconceptionCode[],
  },
];
