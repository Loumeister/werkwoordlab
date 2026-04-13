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
  | "VT_RUWE_STAM_OVERRIDE";

export const MISCONCEPTION_TITLES: Record<MisconceptionCode, string> = {
  PV_STAM_T_OMISSION: "Ik-vorm+t weggelaten",
  PV_FALSE_T_ADD: "Onterechte +t toegevoegd",
  PV_JIJ_INVERSION_FALSE_T: "Onterechte +t bij inversie met jij",
  PV_MEERVOUD_T_ADDITION: "Onterechte +t bij meervoud",
  VD_KOFSCHIP_MISAPPLIED: "'t kofschip-regel fout toegepast",
  VD_IRREGULAR_PP_REGULARIZED: "Onregelmatig voltooid deelwoord geregulariseerd",
  HOMOPHONE_FUNCTION_CONFUSION: "Homofone vorm verward door functiefout",
  VT_DE_TE_CONFUSION: "Verkeerde uitgang -de of -te (verleden tijd)",
  VT_VD_FUNCTION_CONFUSION: "Voltooid deelwoord gebruikt als persoonsvorm VT",
  VT_ENKELVOUD_MEERVOUD: "Enkelvoud/meervoud verwisseld (verleden tijd)",
  VT_RUWE_STAM_OVERRIDE: "Kofschip op ik-vorm toegepast in plaats van stam",
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
];
