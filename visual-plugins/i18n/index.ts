import ar from "./ar.json";
import cs from "./cs.json";
import de from "./de.json";
import en from "./en.json";
import es from "./es.json";
import fa from "./fa.json";
import fr from "./fr.json";
import he from "./he.json";
import hi from "./hi.json";
import it from "./it.json";
import ja from "./ja.json";
import ko from "./ko.json";
import mix from "./mix.json";
import nah from "./nah.json";
import nl from "./nl.json";
import pl from "./pl.json";
import ptBR from "./pt-BR.json";
import ro from "./ro.json";
import ru from "./ru.json";
import sv from "./sv.json";
import th from "./th.json";
import tr from "./tr.json";
import tzh from "./tzh.json";
import uk from "./uk.json";
import vi from "./vi.json";
import yua from "./yua.json";
import zap from "./zap.json";
import zh from "./zh.json";

export type PluginTextField =
  | "displayName"
  | "description"
  | "scopeWarning"
  | "defaultCaption";

export type PluginLocale =
  | "ar"
  | "cs"
  | "de"
  | "en"
  | "es"
  | "fa"
  | "fr"
  | "he"
  | "hi"
  | "it"
  | "ja"
  | "ko"
  | "mix"
  | "nah"
  | "nl"
  | "pl"
  | "pt-BR"
  | "ro"
  | "ru"
  | "sv"
  | "th"
  | "tr"
  | "tzh"
  | "uk"
  | "vi"
  | "yua"
  | "zap"
  | "zh";

type PluginMessages = Partial<Record<PluginTextField, string>>;
type PluginLocaleMessages = { plugins?: Record<string, PluginMessages> };

const LOCALES: Record<PluginLocale, PluginLocaleMessages> = {
  ar: ar as PluginLocaleMessages,
  cs: cs as PluginLocaleMessages,
  de: de as PluginLocaleMessages,
  en: en as PluginLocaleMessages,
  es: es as PluginLocaleMessages,
  fa: fa as PluginLocaleMessages,
  fr: fr as PluginLocaleMessages,
  he: he as PluginLocaleMessages,
  hi: hi as PluginLocaleMessages,
  it: it as PluginLocaleMessages,
  ja: ja as PluginLocaleMessages,
  ko: ko as PluginLocaleMessages,
  mix: mix as PluginLocaleMessages,
  nah: nah as PluginLocaleMessages,
  nl: nl as PluginLocaleMessages,
  pl: pl as PluginLocaleMessages,
  "pt-BR": ptBR as PluginLocaleMessages,
  ro: ro as PluginLocaleMessages,
  ru: ru as PluginLocaleMessages,
  sv: sv as PluginLocaleMessages,
  th: th as PluginLocaleMessages,
  tr: tr as PluginLocaleMessages,
  tzh: tzh as PluginLocaleMessages,
  uk: uk as PluginLocaleMessages,
  vi: vi as PluginLocaleMessages,
  yua: yua as PluginLocaleMessages,
  zap: zap as PluginLocaleMessages,
  zh: zh as PluginLocaleMessages,
};

const LOCALE_ALIASES: Record<string, PluginLocale> = {
  "pt": "pt-BR",
  "pt-br": "pt-BR",
  "zh-cn": "zh",
  "zh-hans": "zh",
  "iw": "he",
};

let currentLocale: PluginLocale = "es";

function normalizePluginLocale(locale?: string): PluginLocale {
  const raw = (locale || "es").toLowerCase();
  const aliased = LOCALE_ALIASES[raw];
  if (aliased) return aliased;

  const exact = Object.keys(LOCALES).find((key) => key.toLowerCase() === raw);
  if (exact) return exact as PluginLocale;

  const base = raw.split("-")[0];
  const baseMatch = Object.keys(LOCALES).find((key) => key.toLowerCase() === base);
  return (baseMatch as PluginLocale | undefined) ?? "es";
}

export function setPluginLocale(locale: string): void {
  currentLocale = normalizePluginLocale(locale);
}

export function pluginText(
  pluginId: string,
  field: PluginTextField,
  fallback: string,
): string {
  const primaryFallback = currentLocale === "es" ? LOCALES.es : LOCALES.en;
  const secondaryFallback = currentLocale === "es" ? LOCALES.en : LOCALES.es;

  return LOCALES[currentLocale].plugins?.[pluginId]?.[field]
    ?? primaryFallback.plugins?.[pluginId]?.[field]
    ?? secondaryFallback.plugins?.[pluginId]?.[field]
    ?? fallback;
}
