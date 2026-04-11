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
        "Je hebt waarschijnlijk de ik-vorm gebruikt zonder -t, maar bij hij, zij of het hoort er een -t achter de ik-vorm.",
      redenering:
        "In de tegenwoordige tijd krijgt de persoonsvorm bij hij/zij/het de ik-vorm plus -t. Schrijf 'hij loopt', niet 'hij loop'.",
      herprobeer:
        "Bepaal het onderwerp. Is het hij, zij of het? Voeg dan -t toe aan de ik-vorm.",
    },
  },

  PV_FALSE_T_ADD: {
    herstelvraag: "Is het onderwerp 'ik'?",
    sleutelwoord: "ik",
    uitleg: {
      diagnose:
        "Je hebt waarschijnlijk de ik-vorm plus -t gebruikt, maar bij 'ik' schrijf je alleen de ik-vorm.",
      redenering:
        "De ik-vorm schrijf je zonder -t. Schrijf 'ik loop', niet 'ik loopt'.",
      herprobeer:
        "Kijk naar het onderwerp. Staat er 'ik'? Gebruik dan de ik-vorm, zonder -t.",
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
        "Controleer of 'je' of 'jij' achter de persoonsvorm staat. Zo ja: gebruik de ik-vorm.",
    },
  },

  PV_MEERVOUD_T_ADDITION: {
    herstelvraag: "Is het onderwerp meervoud: wij, jullie of zij?",
    sleutelwoord: "meervoud",
    uitleg: {
      diagnose:
        "Je hebt waarschijnlijk de enkelvoudsregel toegepast op een meervoudig onderwerp.",
      redenering:
        "Bij meervoudige onderwerpen (wij, jullie, zij) gebruikt de persoonsvorm de ik-vorm. Schrijf 'wij lopen', niet 'wij loopt'.",
      herprobeer:
        "Controleer het onderwerp: is het wij/jullie/zij? Gebruik dan de ik-vorm.",
    },
  },

  VD_KOFSCHIP_MISAPPLIED: {
    herstelvraag: "Eindigt de stam (infinitief minus -en) op een klank uit 't kofschip'?",
    sleutelwoord: "stam",
    uitleg: {
      diagnose:
        "Je hebt waarschijnlijk de eindklank van de stam (infinitief minus -en) verkeerd beoordeeld bij de keuze voor -d of -t.",
      redenering:
        "Schrijf -t in het voltooid deelwoord als de stam (infinitief minus -en) eindigt op een klank uit 't kofschip' (t, k, f, s, ch, p). Eindigt de stam op een andere klank, dan -d. Schrijf 'gewerkt', maar 'gespeeld'.",
      herprobeer:
        "Bepaal de stam (trek -en af van de infinitief) en kijk naar de eindklank. Zit die in 't kofschip'? Dan -t, anders -d.",
    },
  },

  VD_IRREGULAR_PP_REGULARIZED: {
    herstelvraag: "Heeft dit werkwoord een onregelmatig voltooid deelwoord?",
    sleutelwoord: "onregelmatig",
    uitleg: {
      diagnose:
        "Je hebt waarschijnlijk de regelmatige strategie (ik-vorm + -d/-t) toegepast op een onregelmatig werkwoord.",
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

  VT_DE_TE_CONFUSION: {
    herstelvraag: "Welke eindklank heeft de stam (infinitief minus -en)?",
    sleutelwoord: "stam",
    uitleg: {
      diagnose:
        "Je hebt waarschijnlijk de uitgang gekozen op basis van de ik-vorm, maar de kofschip-regel vraagt de eindklank van de stam (infinitief minus -en).",
      redenering:
        "Haal -en af van de infinitief om de stam te krijgen. Controleer of de eindklank van die stam in 't kofschip' (t-k-f-s-ch-p) staat. Zo ja: ik-vorm + -te (of -ten), anders: ik-vorm + -de (of -den).",
      herprobeer:
        "Bepaal de stam (trek -en af van de infinitief). Kijk naar de eindklank. Zit die in 't kofschip? Dan ik-vorm + -te, anders ik-vorm + -de.",
    },
  },

  VT_VD_FUNCTION_CONFUSION: {
    herstelvraag: "Is dit een persoonsvorm of een deelwoord?",
    sleutelwoord: "persoonsvorm",
    uitleg: {
      diagnose:
        "Je hebt waarschijnlijk een voltooid deelwoord ingevuld (zoals gewerkt of gespeeld), maar hier is een persoonsvorm verleden tijd nodig.",
      redenering:
        "De persoonsvorm verleden tijd staat zonder voorvoegsel ge-. Een voltooid deelwoord begint vaak met ge- en staat na een hulpwerkwoord. Schrijf 'hij werkte', niet 'hij gewerkt'.",
      herprobeer:
        "Verwijder het hulpwerkwoord uit de zin: past de zin dan nog? Dan is het een persoonsvorm — gebruik de verleden-tijdsvorm zonder ge-.",
    },
  },

  VT_ENKELVOUD_MEERVOUD: {
    herstelvraag: "Is het onderwerp enkelvoud of meervoud?",
    sleutelwoord: "meervoud",
    uitleg: {
      diagnose:
        "Je hebt waarschijnlijk de enkelvoudsvorm (-de/-te) gebruikt bij een meervoudig onderwerp, of andersom.",
      redenering:
        "Enkelvoud (ik, hij, zij, het): ik-vorm + -de of -te. Meervoud (wij, jullie, zij, en): ik-vorm + -den of -ten. Schrijf 'hij werkte' maar 'zij werkten'.",
      herprobeer:
        "Bepaal het onderwerp. Is het enkelvoud? Gebruik -de of -te. Is het meervoud? Gebruik -den of -ten.",
    },
  },

  VT_RUWE_STAM_OVERRIDE: {
    herstelvraag: "Welke klank hoor je écht als je -en afhaalt van de infinitief?",
    sleutelwoord: "klank",
    uitleg: {
      diagnose:
        "Je hebt waarschijnlijk de ik-vorm bekeken in plaats van de eindklank van de stam (infinitief minus -en).",
      redenering:
        "Soms verschilt de ik-vorm (schrijfwijze) van de stam (klank). Trek -en af van de infinitief: 'leven' → stam 'lev' (v staat niet in 't kofschip → -de) → ik-vorm leef + de = leefde. 'verhuizen' → stam 'verhuiz' (z staat niet in 't kofschip → -de) → ik-vorm verhuis + de = verhuisde.",
      herprobeer:
        "Bepaal de stam (trek -en af van de infinitief). Hoor je een klank uit 't kofschip' (t-k-f-s-ch-p)? Dan ik-vorm + -te, anders ik-vorm + -de.",
    },
  },
};
