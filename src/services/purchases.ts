// Seam for a real purchase library (react-native-iap / RevenueCat). Wiring
// one up needs a 'dotted_pro_unlock' product configured in App Store Connect
// and Google Play Console, plus a real native build to test against — neither
// of which is available from this environment, so this stays a stub until
// that setup happens. PaywallScreen only depends on this shape, so swapping
// in a real implementation later doesn't touch any UI code.
export type PurchaseResult = { ok: true } | { ok: false; reason: 'unavailable' | 'cancelled' | 'error'; message: string };

export async function purchasePro(): Promise<PurchaseResult> {
  return {
    ok: false,
    reason: 'unavailable',
    message: "Purchases aren't set up in this build yet — this screen previews what Pro unlocks.",
  };
}
