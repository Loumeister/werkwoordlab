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
  | "HOMOPHONE_FUNCTION_CONFUSION";

export const MISCONCEPTION_TITLES: Record<MisconceptionCode, string> = {
  PV_STAM_T_OMISSION: "Stam+t weggelaten",
  PV_FALSE_T_ADD: "Onterechte +t toegevoegd",
  PV_JIJ_INVERSION_FALSE_T: "Onterechte +t bij inversie met jij",
  PV_MEERVOUD_T_ADDITION: "Onterechte +t bij meervoud",
  VD_KOFSCHIP_MISAPPLIED: "'t kofschip-regel fout toegepast",
  VD_IRREGULAR_PP_REGULARIZED: "Onregelmatig voltooid deelwoord geregulariseerd",
  HOMOPHONE_FUNCTION_CONFUSION: "Homofone vorm verward door functiefout",
};

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
