import { afterEach, describe, expect, it } from "vitest";
import { isRichFeedbackEntry, type RichFeedbackEntry } from "@/lib/feedback/types";
import { BUILT_IN_FEEDBACK } from "@/lib/feedback/builtInFeedback";
import { MISCONCEPTION_TITLES } from "@/lib/feedback/misconceptions";
import {
  getFeedbackOverrides,
  setFeedbackOverride,
  resetFeedbackOverride,
  clearAllFeedbackOverrides,
  exportFeedbackOverrides,
} from "@/lib/feedback/feedbackOverrides";
import { getEffectiveFeedback } from "@/lib/feedback/feedbackLookup";

// ---------------------------------------------------------------------------
// LocalStorage mock — same pattern as persistence.test.ts, with removeItem added
// ---------------------------------------------------------------------------

class LocalStorageMock {
  private store = new Map<string, string>();

  getItem(key: string) {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }

  removeItem(key: string) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

// ---------------------------------------------------------------------------
// isRichFeedbackEntry
// ---------------------------------------------------------------------------

describe("isRichFeedbackEntry", () => {
  const validRich: RichFeedbackEntry = {
    herstelvraag: "Welk onderwerp staat er in de zin?",
    sleutelwoord: "onderwerp",
    uitleg: {
      diagnose: "Je hebt waarschijnlijk de stam gebruikt zonder -t.",
      redenering: "Bij hij/zij/het krijgt de persoonsvorm stam+t.",
      herprobeer: "Bepaal het onderwerp. Is het hij/zij/het? Voeg dan -t toe.",
    },
  };

  it("geeft true voor een geldig RichFeedbackEntry", () => {
    expect(isRichFeedbackEntry(validRich)).toBe(true);
  });

  it("geeft false voor een string", () => {
    expect(isRichFeedbackEntry("korte hint")).toBe(false);
  });

  it("geeft false voor undefined", () => {
    expect(isRichFeedbackEntry(undefined)).toBe(false);
  });

  it("geeft false voor null", () => {
    expect(isRichFeedbackEntry(null)).toBe(false);
  });

  it("geeft false voor een object zonder herstelvraag-sleutel", () => {
    expect(isRichFeedbackEntry({ sleutelwoord: "test" })).toBe(false);
  });

  it("geeft true voor een object dat alleen herstelvraag bevat (minimale check)", () => {
    // The guard only checks for the presence of 'herstelvraag' as a discriminator key.
    expect(isRichFeedbackEntry({ herstelvraag: "?" })).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Built-in feedback content integrity
// ---------------------------------------------------------------------------

describe("BUILT_IN_FEEDBACK", () => {
  const codes = Object.keys(MISCONCEPTION_TITLES) as Array<keyof typeof MISCONCEPTION_TITLES>;

  it("heeft een entry voor elke misconceptiecode", () => {
    for (const code of codes) {
      expect(BUILT_IN_FEEDBACK[code]).toBeDefined();
    }
  });

  it("alle built-in entries zijn RichFeedbackEntry (v1 content keuze)", () => {
    for (const code of codes) {
      expect(isRichFeedbackEntry(BUILT_IN_FEEDBACK[code])).toBe(true);
    }
  });

  it("alle rich entries hebben niet-lege verplichte velden", () => {
    for (const code of codes) {
      const entry = BUILT_IN_FEEDBACK[code];
      if (isRichFeedbackEntry(entry)) {
        expect(entry.herstelvraag.trim()).not.toBe("");
        expect(entry.sleutelwoord.trim()).not.toBe("");
        expect(entry.uitleg.diagnose.trim()).not.toBe("");
        expect(entry.uitleg.redenering.trim()).not.toBe("");
        expect(entry.uitleg.herprobeer.trim()).not.toBe("");
      }
    }
  });
});

// ---------------------------------------------------------------------------
// feedbackOverrides CRUD
// ---------------------------------------------------------------------------

describe("feedbackOverrides", () => {
  const storage = new LocalStorageMock();

  afterEach(() => {
    storage.clear();
    delete (globalThis as { window?: unknown }).window;
  });

  function withStorage() {
    (globalThis as { window: { localStorage: LocalStorageMock } }).window = {
      localStorage: storage,
    };
  }

  it("getFeedbackOverrides geeft leeg object bij geen opgeslagen overrides", () => {
    withStorage();
    expect(getFeedbackOverrides()).toEqual({});
  });

  it("setFeedbackOverride slaat een override op en getFeedbackOverrides leest hem terug", () => {
    withStorage();
    setFeedbackOverride("PV_STAM_T_OMISSION", "aangepaste hint");
    expect(getFeedbackOverrides()["PV_STAM_T_OMISSION"]).toBe("aangepaste hint");
  });

  it("setFeedbackOverride slaat een rich entry op", () => {
    withStorage();
    const rich: RichFeedbackEntry = {
      herstelvraag: "Heb je het onderwerp bepaald?",
      sleutelwoord: "onderwerp",
      uitleg: {
        diagnose: "Je vergat de -t.",
        redenering: "Bij hij/zij/het stam+t.",
        herprobeer: "Voeg -t toe.",
      },
    };
    setFeedbackOverride("PV_FALSE_T_ADD", rich);
    const result = getFeedbackOverrides()["PV_FALSE_T_ADD"];
    expect(isRichFeedbackEntry(result)).toBe(true);
    expect((result as RichFeedbackEntry).sleutelwoord).toBe("onderwerp");
  });

  it("resetFeedbackOverride verwijdert een specifieke override", () => {
    withStorage();
    setFeedbackOverride("PV_STAM_T_OMISSION", "tijdelijke hint");
    setFeedbackOverride("PV_FALSE_T_ADD", "andere hint");
    resetFeedbackOverride("PV_STAM_T_OMISSION");

    const overrides = getFeedbackOverrides();
    expect(overrides["PV_STAM_T_OMISSION"]).toBeUndefined();
    expect(overrides["PV_FALSE_T_ADD"]).toBe("andere hint");
  });

  it("clearAllFeedbackOverrides verwijdert alle overrides", () => {
    withStorage();
    setFeedbackOverride("PV_STAM_T_OMISSION", "hint a");
    setFeedbackOverride("VD_KOFSCHIP_MISAPPLIED", "hint b");
    clearAllFeedbackOverrides();
    expect(getFeedbackOverrides()).toEqual({});
  });

  it("exportFeedbackOverrides geeft geldige JSON-string terug", () => {
    withStorage();
    setFeedbackOverride("HOMOPHONE_FUNCTION_CONFUSION", "export-hint");
    const json = exportFeedbackOverrides();
    const parsed = JSON.parse(json) as unknown;
    expect(typeof parsed).toBe("object");
    expect((parsed as Record<string, unknown>)["HOMOPHONE_FUNCTION_CONFUSION"]).toBe("export-hint");
  });

  it("getFeedbackOverrides handelt malformed JSON veilig af", () => {
    withStorage();
    storage.setItem("werkwoordlab-feedback-overrides", "geen-json");
    expect(getFeedbackOverrides()).toEqual({});
  });

  it("alle CRUD-functies doen niets als window niet beschikbaar is (SSR-guard)", () => {
    // window is not set — simulates SSR environment
    expect(() => setFeedbackOverride("PV_STAM_T_OMISSION", "x")).not.toThrow();
    expect(getFeedbackOverrides()).toEqual({});
    expect(() => resetFeedbackOverride("PV_STAM_T_OMISSION")).not.toThrow();
    expect(() => clearAllFeedbackOverrides()).not.toThrow();
    expect(exportFeedbackOverrides()).toBe("{}");
  });
});

// ---------------------------------------------------------------------------
// getEffectiveFeedback
// ---------------------------------------------------------------------------

describe("getEffectiveFeedback", () => {
  const storage = new LocalStorageMock();

  afterEach(() => {
    storage.clear();
    delete (globalThis as { window?: unknown }).window;
  });

  function withStorage() {
    (globalThis as { window: { localStorage: LocalStorageMock } }).window = {
      localStorage: storage,
    };
  }

  it("geeft built-in feedback terug als er geen override is", () => {
    withStorage();
    const result = getEffectiveFeedback("PV_STAM_T_OMISSION");
    expect(result).toBe(BUILT_IN_FEEDBACK["PV_STAM_T_OMISSION"]);
  });

  it("geeft override terug als die bestaat, niet de built-in", () => {
    withStorage();
    setFeedbackOverride("PV_STAM_T_OMISSION", "docentaanpassing");
    const result = getEffectiveFeedback("PV_STAM_T_OMISSION");
    expect(result).toBe("docentaanpassing");
    expect(result).not.toBe(BUILT_IN_FEEDBACK["PV_STAM_T_OMISSION"]);
  });

  it("override voor één code laat andere codes ongemoeid", () => {
    withStorage();
    setFeedbackOverride("PV_STAM_T_OMISSION", "aangepast");
    const other = getEffectiveFeedback("PV_FALSE_T_ADD");
    expect(other).toBe(BUILT_IN_FEEDBACK["PV_FALSE_T_ADD"]);
  });

  it("geeft built-in terug na reset van override", () => {
    withStorage();
    setFeedbackOverride("VD_KOFSCHIP_MISAPPLIED", "tijdelijk");
    resetFeedbackOverride("VD_KOFSCHIP_MISAPPLIED");
    const result = getEffectiveFeedback("VD_KOFSCHIP_MISAPPLIED");
    expect(result).toBe(BUILT_IN_FEEDBACK["VD_KOFSCHIP_MISAPPLIED"]);
  });

  it("heeft een entry voor alle bekende misconceptiecodes", () => {
    withStorage();
    const codes = Object.keys(MISCONCEPTION_TITLES) as Array<keyof typeof MISCONCEPTION_TITLES>;
    for (const code of codes) {
      expect(getEffectiveFeedback(code)).toBeDefined();
    }
  });
});
