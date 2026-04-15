import { useEffect, useCallback } from "react";

export interface AppSettings {
  // Business
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  businessEmail: string;
  businessTagline: string;
  businessWebsite: string;
  businessLogo: string;
  businessRegistration: string;
  businessNTN: string;
  // Localization
  currency: string;
  currencySymbol: string;
  dateFormat: string;
  numberFormat: string;
  timezone: string;
  language: string;
  // POS
  defaultPaymentMethod: string;
  defaultPaymentStatus: string;
  posGridColumns: string;
  autoCreateCustomer: boolean;
  enableBarcode: boolean;
  soundOnSale: boolean;
  posQuickActions: boolean;
  posShowStock: boolean;
  posConfirmSale: boolean;
  // Invoice
  invoicePrefix: string;
  invoiceStartNumber: number;
  invoiceTerms: string;
  invoiceNotes: string;
  showSignatureLine: boolean;
  showTermsOnInvoice: boolean;
  // Tax
  taxEnabled: boolean;
  taxRate: number;
  taxLabel: string;
  taxRegistrationNo: string;
  taxInclusive: boolean;
  // Receipt
  receiptShowLogo: boolean;
  receiptFooterText: string;
  receiptShowTax: boolean;
  receiptShowBarcode: boolean;
  receiptPaperSize: string;
  receiptCopies: number;
  // WhatsApp
  enableWhatsApp: boolean;
  whatsAppDefault: string;
  whatsAppTemplate: string;
  // Alerts
  lowStockAlert: boolean;
  lowStockThreshold: number;
  emailAlerts: boolean;
  dailySummaryAlert: boolean;
  paymentDueAlert: boolean;
  expiryAlert: boolean;
  // Appearance
  theme: string;
  sidebarColor: string;
  accentColor: string;
  fontSize: string;
  compactMode: boolean;
  animationsEnabled: boolean;
  cursorStyle: string;
  // Backup
  autoBackup: boolean;
  backupFrequency: string;
  dataRetentionDays: number;
  // Printing
  printOnSave: boolean;
  defaultPrinter: string;
  printMargins: string;
  // Security
  sessionTimeout: number;
  requirePasswordChange: boolean;
  twoFactorEnabled: boolean;
  loginAttemptLimit: number;
  ipWhitelist: string;
  // Users
  enableMultiUser: boolean;
  defaultUserRole: string;
  allowSelfRegistration: boolean;
  // Advanced
  enableAPI: boolean;
  debugMode: boolean;
  cacheEnabled: boolean;
  exportFormat: string;
  decimalPlaces: number;
  roundingMethod: string;
  negativeSalesAllowed: boolean;
  editAfterSave: boolean;
  deleteRequiresPassword: boolean;
}

const defaultSettings: AppSettings = {
  businessName: "Qazi Enterprises",
  businessPhone: "",
  businessAddress: "",
  businessEmail: "",
  businessTagline: "Your trusted business partner",
  businessWebsite: "",
  businessLogo: "",
  businessRegistration: "",
  businessNTN: "",
  currency: "PKR",
  currencySymbol: "Rs",
  dateFormat: "dd/MM/yyyy",
  numberFormat: "en-PK",
  timezone: "Asia/Karachi",
  language: "en",
  defaultPaymentMethod: "cash",
  defaultPaymentStatus: "paid",
  posGridColumns: "4",
  autoCreateCustomer: true,
  enableBarcode: true,
  soundOnSale: true,
  posQuickActions: true,
  posShowStock: true,
  posConfirmSale: true,
  invoicePrefix: "QE-",
  invoiceStartNumber: 1001,
  invoiceTerms: "Payment is due within 30 days of invoice date.",
  invoiceNotes: "",
  showSignatureLine: true,
  showTermsOnInvoice: true,
  taxEnabled: false,
  taxRate: 0,
  taxLabel: "GST",
  taxRegistrationNo: "",
  taxInclusive: false,
  receiptShowLogo: true,
  receiptFooterText: "Thank you for your business!",
  receiptShowTax: false,
  receiptShowBarcode: true,
  receiptPaperSize: "80mm",
  receiptCopies: 1,
  enableWhatsApp: true,
  whatsAppDefault: "",
  whatsAppTemplate: "Dear {customer}, your invoice #{invoice} of Rs {total} is ready. Thank you!",
  lowStockAlert: true,
  lowStockThreshold: 10,
  emailAlerts: false,
  dailySummaryAlert: false,
  paymentDueAlert: true,
  expiryAlert: false,
  theme: "system",
  sidebarColor: "dark",
  accentColor: "amber",
  fontSize: "normal",
  compactMode: false,
  animationsEnabled: true,
  cursorStyle: "neon-glow",
  autoBackup: false,
  backupFrequency: "daily",
  dataRetentionDays: 365,
  printOnSave: false,
  defaultPrinter: "default",
  printMargins: "normal",
  sessionTimeout: 30,
  requirePasswordChange: false,
  twoFactorEnabled: false,
  loginAttemptLimit: 5,
  ipWhitelist: "",
  enableMultiUser: true,
  defaultUserRole: "user",
  allowSelfRegistration: false,
  enableAPI: false,
  debugMode: false,
  cacheEnabled: true,
  exportFormat: "xlsx",
  decimalPlaces: 2,
  roundingMethod: "round",
  negativeSalesAllowed: false,
  editAfterSave: true,
  deleteRequiresPassword: false,
};

/** Read full settings from localStorage, merged with defaults */
export function getAppSettings(): AppSettings {
  if (typeof localStorage === 'undefined') return { ...defaultSettings };
  try {
    const raw = localStorage.getItem("app_settings");
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : { ...defaultSettings };
  } catch {
    return { ...defaultSettings };
  }
}

// ── Accent color palettes (oklch values for 4+ color themes) ──
// Each palette has: primary, accent, success, warning — 4 harmonious colors
const accentPalettes: Record<string, {
  main: string; foreground: string;
  primary: string; accent: string; success: string; warning: string;
  primaryOklch: string; accentOklch: string; successOklch: string; warningOklch: string;
}> = {
  amber:     { main: "38 92% 50%", foreground: "0 0% 100%", primary: "38 92% 50%", accent: "25 95% 53%", success: "142 71% 45%", warning: "48 96% 53%",
               primaryOklch: "oklch(0.78 0.18 75)", accentOklch: "oklch(0.65 0.20 45)", successOklch: "oklch(0.6 0.18 150)", warningOklch: "oklch(0.85 0.18 90)" },
  blue:      { main: "217 91% 60%", foreground: "0 0% 100%", primary: "217 91% 60%", accent: "199 89% 48%", success: "162 73% 46%", warning: "43 96% 56%",
               primaryOklch: "oklch(0.55 0.22 260)", accentOklch: "oklch(0.65 0.17 210)", successOklch: "oklch(0.6 0.18 165)", warningOklch: "oklch(0.82 0.17 85)" },
  green:     { main: "142 71% 45%", foreground: "0 0% 100%", primary: "142 71% 45%", accent: "168 76% 42%", success: "120 65% 50%", warning: "84 81% 44%",
               primaryOklch: "oklch(0.6 0.18 150)", accentOklch: "oklch(0.62 0.15 175)", successOklch: "oklch(0.65 0.2 140)", warningOklch: "oklch(0.7 0.17 120)" },
  red:       { main: "0 72% 51%", foreground: "0 0% 100%", primary: "0 72% 51%", accent: "340 82% 52%", success: "16 85% 57%", warning: "45 93% 47%",
               primaryOklch: "oklch(0.55 0.22 25)", accentOklch: "oklch(0.6 0.22 350)", successOklch: "oklch(0.7 0.18 40)", warningOklch: "oklch(0.8 0.17 80)" },
  purple:    { main: "270 60% 55%", foreground: "0 0% 100%", primary: "270 60% 55%", accent: "290 65% 50%", success: "240 55% 60%", warning: "310 60% 58%",
               primaryOklch: "oklch(0.55 0.2 300)", accentOklch: "oklch(0.5 0.22 320)", successOklch: "oklch(0.55 0.18 270)", warningOklch: "oklch(0.62 0.2 340)" },
  teal:      { main: "174 72% 40%", foreground: "0 0% 100%", primary: "174 72% 40%", accent: "190 80% 42%", success: "160 65% 45%", warning: "140 55% 50%",
               primaryOklch: "oklch(0.6 0.14 185)", accentOklch: "oklch(0.58 0.14 200)", successOklch: "oklch(0.62 0.14 170)", warningOklch: "oklch(0.65 0.13 155)" },
  // Multi-color themed combos
  ocean:     { main: "200 80% 50%", foreground: "0 0% 100%", primary: "200 80% 50%", accent: "170 70% 45%", success: "155 65% 50%", warning: "220 75% 60%",
               primaryOklch: "oklch(0.58 0.17 230)", accentOklch: "oklch(0.62 0.14 185)", successOklch: "oklch(0.65 0.14 170)", warningOklch: "oklch(0.6 0.15 255)" },
  sunset:    { main: "15 85% 55%", foreground: "0 0% 100%", primary: "15 85% 55%", accent: "340 75% 55%", success: "45 90% 50%", warning: "30 90% 60%",
               primaryOklch: "oklch(0.65 0.2 35)", accentOklch: "oklch(0.6 0.2 350)", successOklch: "oklch(0.82 0.17 80)", warningOklch: "oklch(0.75 0.18 55)" },
  forest:    { main: "150 60% 40%", foreground: "0 0% 100%", primary: "150 60% 40%", accent: "90 50% 45%", success: "120 55% 50%", warning: "50 70% 55%",
               primaryOklch: "oklch(0.55 0.14 160)", accentOklch: "oklch(0.6 0.12 130)", successOklch: "oklch(0.62 0.15 140)", warningOklch: "oklch(0.75 0.15 90)" },
  galaxy:    { main: "265 70% 55%", foreground: "0 0% 100%", primary: "265 70% 55%", accent: "200 80% 55%", success: "320 65% 55%", warning: "180 60% 50%",
               primaryOklch: "oklch(0.52 0.2 290)", accentOklch: "oklch(0.6 0.17 230)", successOklch: "oklch(0.6 0.18 340)", warningOklch: "oklch(0.62 0.13 195)" },
  cherry:    { main: "350 80% 50%", foreground: "0 0% 100%", primary: "350 80% 50%", accent: "320 70% 55%", success: "10 75% 60%", warning: "0 65% 65%",
               primaryOklch: "oklch(0.55 0.22 10)", accentOklch: "oklch(0.58 0.2 340)", successOklch: "oklch(0.68 0.18 30)", warningOklch: "oklch(0.7 0.16 15)" },
  aqua:      { main: "185 75% 45%", foreground: "0 0% 100%", primary: "185 75% 45%", accent: "210 70% 55%", success: "160 65% 48%", warning: "195 80% 40%",
               primaryOklch: "oklch(0.62 0.13 195)", accentOklch: "oklch(0.6 0.15 240)", successOklch: "oklch(0.63 0.13 175)", warningOklch: "oklch(0.56 0.12 205)" },
  rose:      { main: "350 70% 65%", foreground: "0 0% 100%", primary: "350 70% 65%", accent: "330 60% 60%", success: "10 65% 68%", warning: "320 50% 55%",
               primaryOklch: "oklch(0.7 0.15 10)", accentOklch: "oklch(0.65 0.15 350)", successOklch: "oklch(0.73 0.13 25)", warningOklch: "oklch(0.6 0.14 340)" },
  lavender:  { main: "260 50% 70%", foreground: "0 0% 100%", primary: "260 50% 70%", accent: "280 45% 65%", success: "240 45% 68%", warning: "300 40% 62%",
               primaryOklch: "oklch(0.7 0.12 280)", accentOklch: "oklch(0.65 0.13 300)", successOklch: "oklch(0.68 0.11 260)", warningOklch: "oklch(0.63 0.12 320)" },
  peach:     { main: "20 80% 68%", foreground: "0 0% 100%", primary: "20 80% 68%", accent: "35 75% 62%", success: "10 70% 70%", warning: "45 80% 58%",
               primaryOklch: "oklch(0.75 0.14 45)", accentOklch: "oklch(0.72 0.14 65)", successOklch: "oklch(0.77 0.12 30)", warningOklch: "oklch(0.73 0.15 80)" },
  mint:      { main: "160 50% 60%", foreground: "0 0% 100%", primary: "160 50% 60%", accent: "180 50% 55%", success: "140 45% 58%", warning: "170 55% 52%",
               primaryOklch: "oklch(0.7 0.1 170)", accentOklch: "oklch(0.65 0.1 190)", successOklch: "oklch(0.68 0.1 155)", warningOklch: "oklch(0.63 0.11 180)" },
  sky:       { main: "200 75% 65%", foreground: "0 0% 100%", primary: "200 75% 65%", accent: "215 70% 60%", success: "185 65% 58%", warning: "225 60% 62%",
               primaryOklch: "oklch(0.7 0.12 225)", accentOklch: "oklch(0.65 0.13 240)", successOklch: "oklch(0.67 0.11 200)", warningOklch: "oklch(0.65 0.12 250)" },
  coral:     { main: "10 75% 62%", foreground: "0 0% 100%", primary: "10 75% 62%", accent: "25 80% 58%", success: "0 65% 65%", warning: "35 85% 55%",
               primaryOklch: "oklch(0.68 0.17 30)", accentOklch: "oklch(0.7 0.17 50)", successOklch: "oklch(0.7 0.14 15)", warningOklch: "oklch(0.72 0.17 65)" },
  lilac:     { main: "280 45% 72%", foreground: "0 0% 100%", primary: "280 45% 72%", accent: "260 40% 68%", success: "300 40% 70%", warning: "250 35% 65%",
               primaryOklch: "oklch(0.72 0.11 300)", accentOklch: "oklch(0.68 0.1 280)", successOklch: "oklch(0.7 0.1 320)", warningOklch: "oklch(0.66 0.1 270)" },
  sage:      { main: "140 30% 55%", foreground: "0 0% 100%", primary: "140 30% 55%", accent: "120 25% 50%", success: "160 35% 52%", warning: "100 30% 50%",
               primaryOklch: "oklch(0.62 0.08 155)", accentOklch: "oklch(0.58 0.07 140)", successOklch: "oklch(0.6 0.09 170)", warningOklch: "oklch(0.57 0.08 125)" },
  blush:     { main: "340 55% 72%", foreground: "0 0% 100%", primary: "340 55% 72%", accent: "350 50% 68%", success: "330 45% 70%", warning: "0 50% 65%",
               primaryOklch: "oklch(0.72 0.12 350)", accentOklch: "oklch(0.7 0.12 10)", successOklch: "oklch(0.71 0.11 340)", warningOklch: "oklch(0.68 0.13 15)" },
  mauve:     { main: "300 25% 60%", foreground: "0 0% 100%", primary: "300 25% 60%", accent: "280 30% 58%", success: "320 25% 62%", warning: "270 25% 55%",
               primaryOklch: "oklch(0.62 0.08 320)", accentOklch: "oklch(0.6 0.09 300)", successOklch: "oklch(0.64 0.08 340)", warningOklch: "oklch(0.58 0.09 290)" },
  seafoam:   { main: "170 45% 58%", foreground: "0 0% 100%", primary: "170 45% 58%", accent: "190 50% 52%", success: "155 40% 55%", warning: "200 45% 50%",
               primaryOklch: "oklch(0.65 0.1 180)", accentOklch: "oklch(0.6 0.11 200)", successOklch: "oklch(0.63 0.1 165)", warningOklch: "oklch(0.58 0.11 210)" },
  dustyblue: { main: "210 35% 62%", foreground: "0 0% 100%", primary: "210 35% 62%", accent: "225 40% 58%", success: "195 35% 58%", warning: "240 35% 60%",
               primaryOklch: "oklch(0.65 0.08 235)", accentOklch: "oklch(0.6 0.09 250)", successOklch: "oklch(0.62 0.08 215)", warningOklch: "oklch(0.6 0.09 260)" },
};

// ── Sidebar color palettes ──
const sidebarPalettes: Record<string, Record<string, string>> = {
  dark: {
    "--sidebar-background": "222 47% 11%",
    "--sidebar-foreground": "213 31% 91%",
    "--sidebar-accent": "222 40% 16%",
    "--sidebar-accent-foreground": "213 31% 91%",
    "--sidebar-border": "222 30% 18%",
    "--sidebar-muted": "220 9% 46%",
  },
  light: {
    "--sidebar-background": "0 0% 98%",
    "--sidebar-foreground": "222 47% 11%",
    "--sidebar-accent": "220 14% 92%",
    "--sidebar-accent-foreground": "222 47% 11%",
    "--sidebar-border": "220 13% 91%",
    "--sidebar-muted": "220 9% 46%",
  },
  colored: {
    "--sidebar-background": "222 47% 15%",
    "--sidebar-foreground": "210 40% 96%",
    "--sidebar-accent": "222 40% 22%",
    "--sidebar-accent-foreground": "210 40% 96%",
    "--sidebar-border": "222 30% 25%",
    "--sidebar-muted": "218 11% 55%",
  },
};

function applyTheme(theme: string) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.classList.add("dark");
    }
  }
}

function applyFontSize(size: string) {
  const root = document.documentElement;
  if (size === "small") root.style.fontSize = "14px";
  else if (size === "large") root.style.fontSize = "18px";
  else root.style.fontSize = "16px";
}

function applyCompactMode(compact: boolean) {
  document.documentElement.classList.toggle("compact-mode", compact);
}

function applyAnimations(enabled: boolean) {
  document.documentElement.classList.toggle("no-animations", !enabled);
}

function applyAccentColor(color: string) {
  const palette = accentPalettes[color] || accentPalettes.amber;
  const root = document.documentElement;
  // Apply all 4 theme colors using oklch values
  root.style.setProperty("--accent", palette.accentOklch);
  root.style.setProperty("--accent-foreground", "oklch(1 0 0)");
  root.style.setProperty("--success", palette.successOklch);
  root.style.setProperty("--success-foreground", "oklch(1 0 0)");
  root.style.setProperty("--warning", palette.warningOklch);
  root.style.setProperty("--warning-foreground", "oklch(1 0 0)");
  root.style.setProperty("--chart-1", palette.primaryOklch);
  root.style.setProperty("--chart-2", palette.accentOklch);
  root.style.setProperty("--chart-3", palette.warningOklch);
  root.style.setProperty("--chart-4", palette.successOklch);
  // Sidebar colors
  root.style.setProperty("--sidebar-primary", palette.primaryOklch);
  root.style.setProperty("--sidebar-primary-foreground", "oklch(1 0 0)");
  root.style.setProperty("--sidebar-ring", palette.primaryOklch);
  // Primary + ring
  root.style.setProperty("--primary", palette.primaryOklch);
  root.style.setProperty("--primary-foreground", "oklch(1 0 0)");
  root.style.setProperty("--ring", palette.primaryOklch);
}

function applySidebarColor(style: string) {
  const palette = sidebarPalettes[style] || sidebarPalettes.dark;
  const root = document.documentElement;
  for (const [prop, value] of Object.entries(palette)) {
    root.style.setProperty(prop, value);
  }
}

export function applyAllSettings() {
  const s = getAppSettings();
  applyTheme(s.theme || "system");
  applyFontSize(s.fontSize || "normal");
  applyCompactMode(s.compactMode ?? false);
  applyAnimations(s.animationsEnabled ?? true);
  applyAccentColor(s.accentColor || "amber");
  applySidebarColor(s.sidebarColor || "dark");
}

/** Format a number using the user's settings */
export function formatCurrency(amount: number): string {
  const s = getAppSettings();
  const places = s.decimalPlaces ?? 2;
  let formatted: string;
  
  if (s.roundingMethod === "floor") {
    amount = Math.floor(amount * Math.pow(10, places)) / Math.pow(10, places);
  } else if (s.roundingMethod === "ceil") {
    amount = Math.ceil(amount * Math.pow(10, places)) / Math.pow(10, places);
  }
  
  try {
    formatted = new Intl.NumberFormat(s.numberFormat || "en-PK", {
      minimumFractionDigits: places,
      maximumFractionDigits: places,
    }).format(amount);
  } catch {
    formatted = amount.toFixed(places);
  }
  
  return `${s.currencySymbol || "Rs"} ${formatted}`;
}

/** Format a date using user's timezone and format */
export function formatDate(date: string | Date): string {
  const s = getAppSettings();
  const d = typeof date === "string" ? new Date(date) : date;
  try {
    return d.toLocaleDateString(s.language === "ur" ? "ur-PK" : "en-PK", {
      timeZone: s.timezone || "Asia/Karachi",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return d.toLocaleDateString();
  }
}

export function formatDateTime(date: string | Date): string {
  const s = getAppSettings();
  const d = typeof date === "string" ? new Date(date) : date;
  try {
    return d.toLocaleString(s.language === "ur" ? "ur-PK" : "en-PK", {
      timeZone: s.timezone || "Asia/Karachi",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return d.toLocaleString();
  }
}

export function useAppSettings() {
  useEffect(() => {
    applyAllSettings();

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const s = getAppSettings();
      if (!s.theme || s.theme === "system") {
        applyTheme("system");
        applyAccentColor(s.accentColor || "amber");
      }
    };
    mq.addEventListener("change", handler);

    const storageHandler = (e: StorageEvent) => {
      if (e.key === "app_settings") applyAllSettings();
    };
    window.addEventListener("storage", storageHandler);

    return () => {
      mq.removeEventListener("change", handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, []);
}

/** Hook: auto-logout after inactivity based on sessionTimeout setting */
export function useSessionTimeout(onTimeout: () => void) {
  useEffect(() => {
    const s = getAppSettings();
    const minutes = s.sessionTimeout || 30;
    const ms = minutes * 60 * 1000;
    
    let timer: ReturnType<typeof setTimeout>;
    
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        onTimeout();
      }, ms);
    };
    
    const events = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"];
    events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();
    
    return () => {
      clearTimeout(timer);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [onTimeout]);
}
