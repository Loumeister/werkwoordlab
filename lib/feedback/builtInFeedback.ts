/**
 * Built-in feedback content for werkwoordlab misconception codes.
 * Local to werkwoordlab — not portable to grammar-core.
 *
 * Rich feedback explains the relevant contrast without inferring learner thinking.
 */

import { type FeedbackEntry } from "./types";
import { type MisconceptionCode } from "./misconceptions";

export const BUILT_IN_FEEDBACK: Record<MisconceptionCode, FeedbackEntry> = {
  PV_STAM_T_OMISSION: {
    herstelvraag: "Welk onderwerp staat er in de zin?",
    sleutelwoord: "onderwerp",
    uitleg: {
      diagnose:
        "Je antwoord gebruikt de ik-vorm zonder -t terwijl het onderwerp derde persoon enkelvoud is.",
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
        "Je antwoord voegt een -t toe terwijl 'ik' het onderwerp is.",
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
        "Je antwoord volgt de gewone jij-regel terwijl 'je/jij' achter de persoonsvorm staat.",
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
        "Je antwoord gebruikt een enkelvoudsvorm bij een meervoudig onderwerp.",
      redenering:
        "Bij een meervoudig onderwerp krijgt de persoonsvorm de vorm van het hele werkwoord. Schrijf 'wij lopen', niet 'wij loopt'.",
      herprobeer:
        "Controleer het onderwerp. Is het meervoud? Gebruik dan de vorm van het hele werkwoord.",
    },
  },

  VD_KOFSCHIP_MISAPPLIED: {
    herstelvraag: "Welke letter of lettercombinatie sluit de stam af?",
    sleutelwoord: "stam",
    uitleg: {
      diagnose:
        "De gekozen uitgang past niet bij het slot van de stam.",
      redenering:
        "Haal bij een regelmatig werkwoord -en weg. Eindigt de stam op t, k, f, s, ch, p of x, dan eindigt het deelwoord op -t; anders op -d. Zo blijven ook v en z zichtbaar voor de keuze: geleefd, gereisd; bij juich telt ch als één lettercombinatie: gejuicht.",
      herprobeer:
        "Haal -en weg en markeer de laatste letter of lettercombinatie. Kies opnieuw tussen -d en -t.",
    },
  },

  VD_IRREGULAR_PP_REGULARIZED: {
    herstelvraag: "Heeft dit werkwoord een onregelmatig voltooid deelwoord?",
    sleutelwoord: "onregelmatig",
    uitleg: {
      diagnose:
        "Je antwoord maakt van dit onregelmatige werkwoord een regelmatige vorm.",
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
        "Je antwoord past bij een andere grammaticale functie dan het werkwoord in deze zin heeft.",
      redenering:
        "Homofonische werkwoordsvormen klinken hetzelfde maar spellen anders op basis van grammaticale functie. Bepaal altijd eerst of het een persoonsvorm, infinitief of deelwoord is.",
      herprobeer:
        "Bepaal eerst de functie. Gebruik de tijdproef alleen wanneer je controleert of het woord een persoonsvorm is.",
    },
  },

  VT_DE_TE_CONFUSION: {
    herstelvraag: "Welke letter of lettercombinatie sluit de stam af?",
    sleutelwoord: "stam",
    uitleg: {
      diagnose:
        "De gekozen uitgang past niet bij het slot van de stam.",
      redenering:
        "Haal bij een regelmatig werkwoord -en weg. Eindigt de stam op t, k, f, s, ch, p of x, dan schrijf je -te(n); anders -de(n). Gebruik daarna de ik-vorm als schrijfvorm: juichte, leefde, verhuisde.",
      herprobeer:
        "Haal -en weg en markeer de laatste letter of lettercombinatie. Kies opnieuw tussen -de(n) en -te(n).",
    },
  },

  VT_VD_FUNCTION_CONFUSION: {
    herstelvraag: "Is dit een persoonsvorm of een deelwoord?",
    sleutelwoord: "persoonsvorm",
    uitleg: {
      diagnose:
        "Je antwoord is een voltooid deelwoord, terwijl deze plek om een persoonsvorm in de verleden tijd vraagt.",
      redenering:
        "De persoonsvorm verleden tijd staat zonder voorvoegsel ge-. Een voltooid deelwoord begint vaak met ge- en staat na een hulpwerkwoord. Schrijf 'hij werkte', niet 'hij gewerkt'.",
      herprobeer:
        "Zet de zin in een andere tijd. Het werkwoord dat mee verandert is de persoonsvorm; schrijf daarvan nu de verleden tijd.",
    },
  },

  VT_ENKELVOUD_MEERVOUD: {
    herstelvraag: "Is het onderwerp enkelvoud of meervoud?",
    sleutelwoord: "meervoud",
    uitleg: {
      diagnose:
        "Je antwoord gebruikt enkelvoud bij een meervoudig onderwerp, of meervoud bij een enkelvoudig onderwerp.",
      redenering:
        "Enkelvoud (ik, hij, zij, het): ik-vorm + -de of -te. Meervoud (wij, jullie, zij, en): ik-vorm + -den of -ten. Schrijf 'hij werkte' maar 'zij werkten'.",
      herprobeer:
        "Bepaal het onderwerp. Is het enkelvoud? Gebruik -de of -te. Is het meervoud? Gebruik -den of -ten.",
    },
  },

  VT_RUWE_STAM_OVERRIDE: {
    herstelvraag: "Welke letter staat in het hele werkwoord vlak vóór -en?",
    sleutelwoord: "werkwoord",
    uitleg: {
      diagnose:
        "Je antwoord gebruikt de f of s van de ik-vorm voor de uitgang, terwijl het hele werkwoord vóór -en een v of z heeft.",
      redenering:
        "Kies -de of -te met de letter in het hele werkwoord, vóór -en. Schrijf de uitgang daarna achter de ik-vorm: leven heeft v en wordt leefde; verhuizen heeft z en wordt verhuisde.",
      herprobeer:
        "Kijk vóór -en in het hele werkwoord. Staat daar v of z? Kies dan -de en zet die uitgang achter de ik-vorm.",
    },
  },

  INF_PV_CONFUSION: {
    herstelvraag: "Welke vorm vraagt de werkwoordgroep of te-constructie op deze plek?",
    sleutelwoord: "werkwoordgroep",
    uitleg: {
      diagnose:
        "Op deze plek staat een infinitief en niet de persoonsvorm van de zin.",
      redenering:
        "Een infinitief kan onder meer volgen op een modaal werkwoord, op werkwoorden als gaan, blijven en laten, of op te en om te. Bepaal daarom de functie in de hele constructie.",
      herprobeer:
        "Markeer de persoonsvorm en het woord dat de infinitief inleidt. Schrijf daarna de infinitief.",
    },
  },

  INF_VD_CONFUSION: {
    herstelvraag: "Staat er 'hebben' of 'zijn' in de zin, of een modaal werkwoord?",
    sleutelwoord: "modaal",
    uitleg: {
      diagnose:
        "Je antwoord is een voltooid deelwoord, terwijl na het modale werkwoord hier een infinitief hoort.",
      redenering:
        "Na 'wil', 'kan', 'mag' en 'moet' staat een infinitief (basisvorm op -en). Het voltooid deelwoord met ge- staat na 'hebben' of 'zijn'. Schrijf 'hij wil lopen', niet 'hij wil gelopen'.",
      herprobeer:
        "Is het hulpwerkwoord 'wil', 'kan', 'mag' of 'moet'? Dan infinitief zonder ge-. Is het 'heeft' of 'is'? Dan voltooid deelwoord.",
    },
  },

  VD_ADJ_FUNCTION_CONFUSION: {
    herstelvraag: "Staat het deelwoord direct vóór een zelfstandig naamwoord?",
    sleutelwoord: "naamwoord",
    uitleg: {
      diagnose:
        "Je antwoord behandelt het deelwoord als werkwoordelijke vorm terwijl het hier bijvoeglijk wordt gebruikt, of andersom.",
      redenering:
        "Vóór een zelfstandig naamwoord kan een voltooid deelwoord bijvoeglijk zijn. Pas dan de gewone verbuiging van bijvoeglijke naamwoorden toe: de geschilderde deur, maar een gesloten huis. In een werkwoordgroep blijft het een werkwoordelijke vorm: het huis is geschilderd.",
      herprobeer:
        "Bepaal eerst of het deelwoord bij een naamwoord hoort of deel van de werkwoordgroep is. Pas alleen bij bijvoeglijk gebruik de gewone verbuigingsregel toe.",
    },
  },

  OVD_FUNCTION_CONFUSION: {
    herstelvraag: "Beschrijft het werkwoord een lopende handeling vóór een zelfstandig naamwoord?",
    sleutelwoord: "handeling",
    uitleg: {
      diagnose:
        "Je antwoord is een persoonsvorm of voltooid deelwoord, terwijl hier een onvoltooid deelwoord gevraagd wordt.",
      redenering:
        "De basisvorm van het onvoltooid deelwoord eindigt op -end: werkend, slapend, zingend. Bijvoeglijk gebruikt kan die vorm worden verbogen, zoals in 'de werkende leerling'.",
      herprobeer:
        "Beschrijft het woord een doorgaande handeling bij een naamwoord? Vorm dan het onvoltooid deelwoord en controleer daarna de verbuiging.",
    },
  },
};
