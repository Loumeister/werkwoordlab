/**
 * Built-in feedback content for werkwoordlab misconception codes.
 * Local to werkwoordlab — not portable to grammar-core.
 *
 * V1 uses RichFeedbackEntry for all 7 current codes. This is a content choice, not an
 * architectural constraint. Future or simpler entries may be plain strings.
 */

import { type FeedbackEntry } from "./types";
import { type MisconceptionCode } from "./misconceptions";

export const BUILT_IN_FEEDBACK: Record<MisconceptionCode, FeedbackEntry> = {
  PV_STAM_T_OMISSION: {
    herstelvraag: "Welk onderwerp staat er in de zin?",
    sleutelwoord: "onderwerp",
    uitleg: {
      diagnose:
        "Je hebt waarschijnlijk de stam gebruikt, maar bij hij, zij of het hoort er een -t achter de stam.",
      redenering:
        "In de tegenwoordige tijd krijgt de persoonsvorm bij hij/zij/het de stam plus -t. Schrijf 'hij loopt', niet 'hij loop'.",
      herprobeer:
        "Bepaal het onderwerp. Is het hij, zij of het? Voeg dan -t toe aan de stam.",
    },
  },

  PV_FALSE_T_ADD: {
    herstelvraag: "Is het onderwerp 'ik'?",
    sleutelwoord: "ik",
    uitleg: {
      diagnose:
        "Je hebt waarschijnlijk de stam plus -t gebruikt, maar bij 'ik' schrijf je alleen de stam.",
      redenering:
        "De ik-vorm in de tegenwoordige tijd is gelijk aan de stam — zonder -t. Schrijf 'ik loop', niet 'ik loopt'.",
      herprobeer:
        "Kijk naar het onderwerp. Staat er 'ik'? Gebruik dan alleen de stam, zonder -t.",
    },
  },

  PV_JIJ_INVERSION_FALSE_T: {
    herstelvraag: "Staat 'je' of 'jij' achter de persoonsvorm?",
    sleutelwoord: "persoonsvorm",
    uitleg: {
      diagnose:
        "Je hebt waarschijnlijk de gewone -t-regel toegepast, maar bij 'je/jij' achter de persoonsvorm vervalt de -t.",
      redenering:
        "Wanneer 'je' of 'jij' achter de persoonsvorm staat, krijgt de persoonsvorm geen -t. Schrijf 'Hoe oud word jij?', niet 'wordt jij'.",
      herprobeer:
        "Controleer of 'je' of 'jij' achter de persoonsvorm staat. Zo ja: gebruik de stam zonder -t.",
    },
  },

  PV_MEERVOUD_T_ADDITION: {
    herstelvraag: "Is het onderwerp meervoud: wij, jullie of zij?",
    sleutelwoord: "meervoud",
    uitleg: {
      diagnose:
        "Je hebt waarschijnlijk de enkelvoudsregel toegepast op een meervoudig onderwerp.",
      redenering:
        "Bij meervoudige onderwerpen (wij, jullie, zij) gebruikt de persoonsvorm de stam zonder -t. Schrijf 'wij lopen', niet 'wij loopt'.",
      herprobeer:
        "Controleer het onderwerp: is het wij/jullie/zij? Gebruik dan de stam zonder -t.",
    },
  },

  VD_KOFSCHIP_MISAPPLIED: {
    herstelvraag: "Eindigt de stam op een klank uit 't kofschip'?",
    sleutelwoord: "stam",
    uitleg: {
      diagnose:
        "Je hebt waarschijnlijk de eindklank van de stam verkeerd beoordeeld bij de keuze voor -d of -t.",
      redenering:
        "Schrijf -t in het voltooid deelwoord als de stam eindigt op een klank uit 't kofschip' (t, k, f, s, ch, p). Eindigt de stam op een andere klank, dan -d. Schrijf 'gewerkt', maar 'gespeeld'.",
      herprobeer:
        "Schrijf de stam op en kijk naar de laatste klank. Zit die in 't kofschip'? Dan -t, anders -d.",
    },
  },

  VD_IRREGULAR_PP_REGULARIZED: {
    herstelvraag: "Heeft dit werkwoord een onregelmatig voltooid deelwoord?",
    sleutelwoord: "onregelmatig",
    uitleg: {
      diagnose:
        "Je hebt waarschijnlijk de regelmatige strategie (stam + -d/-t) toegepast op een onregelmatig werkwoord.",
      redenering:
        "Onregelmatige werkwoorden volgen de gewone -d/-t-regel niet. De vorm moet je herkennen of opzoeken, zoals 'gereden', 'gevonden', 'gegaan'.",
      herprobeer:
        "Controleer of het werkwoord een bekende onregelmatige vorm heeft. Zo ja, gebruik die vaste vorm.",
    },
  },

  HOMOPHONE_FUNCTION_CONFUSION: {
    herstelvraag: "Welke grammaticale functie heeft het werkwoord hier?",
    sleutelwoord: "functie",
    uitleg: {
      diagnose:
        "Je hebt waarschijnlijk de klank gevolgd in plaats van eerst de grammaticale functie te bepalen.",
      redenering:
        "Homofonische werkwoordsvormen klinken hetzelfde maar spellen anders op basis van grammaticale functie. Bepaal altijd eerst of het een persoonsvorm, infinitief of deelwoord is.",
      herprobeer:
        "Verander de zin naar de verleden tijd. Verandert het woord van vorm? Dan is het een persoonsvorm.",
    },
  },
};
