import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRO_FEATURES = [
  { emoji: '🔓', text: 'Všechny partie těla (Kyčle, Oči, Ramena)' },
  { emoji: '🔔', text: 'Hourly Nudge - automatické připomínky' },
  { emoji: '📊', text: 'Detailní statistiky a grafy' },
  { emoji: '🎯', text: 'Vlastní rutiny' },
  { emoji: '📴', text: 'Bez reklam' },
  { emoji: '⬇️', text: 'Offline přístup' },
];

export default function PaywallScreen() {
  const router = useRouter();

  const handlePurchase = (plan: string) => {
    // TODO: Implement IAP with RevenueCat or similar
    // For MVP: Mock purchase success
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
        accessibilityLabel="Zavřít"
        accessibilityRole="button"
      >
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>⭐</Text>
          <Text style={styles.heroTitle}>DeskFix Pro</Text>
          <Text style={styles.heroSubtitle}>Kompletní péče o tvé tělo</Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          {PRO_FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Text style={styles.featureEmoji}>{feature.emoji}</Text>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>

        {/* Pricing */}
        <View style={styles.pricing}>
          <TouchableOpacity
            style={[styles.priceCard, styles.priceCardHighlight]}
            onPress={() => handlePurchase('yearly')}
            accessibilityLabel="Roční předplatné, 799 korun za rok"
            accessibilityRole="button"
          >
            <View style={styles.bestValueBadge}>
              <Text style={styles.bestValueText}>NEJVÝHODNĚJŠÍ</Text>
            </View>
            <Text style={styles.priceName}>Ročně</Text>
            <Text style={styles.priceAmount}>799 Kč/rok</Text>
            <Text style={styles.priceNote}>= 67 Kč/měsíc</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.priceCard}
            onPress={() => handlePurchase('monthly')}
            accessibilityLabel="Měsíční předplatné, 99 korun za měsíc"
            accessibilityRole="button"
          >
            <Text style={styles.priceName}>Měsíčně</Text>
            <Text style={styles.priceAmount}>99 Kč/měsíc</Text>
            <Text style={styles.priceNote}>Bez závazku</Text>
          </TouchableOpacity>
        </View>

        {/* Trial CTA */}
        <TouchableOpacity
          style={styles.trialButton}
          onPress={() => handlePurchase('trial')}
          accessibilityLabel="Vyzkoušet zdarma 7 dní"
          accessibilityRole="button"
        >
          <Text style={styles.trialButtonText}>Vyzkoušet zdarma 7 dní</Text>
        </TouchableOpacity>
        <Text style={styles.trialNote}>
          Poté 99 Kč/měsíc. Zrušíš kdykoliv.
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Obnovit nákupy</Text>
          </TouchableOpacity>
          <Text style={styles.footerDivider}>|</Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Podmínky</Text>
          </TouchableOpacity>
          <Text style={styles.footerDivider}>|</Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Soukromí</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A5F',
  },
  closeButton: {
    position: 'absolute',
    top: 56,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 80,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#93C5FD',
  },
  features: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  pricing: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  priceCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  priceCardHighlight: {
    backgroundColor: '#4A90E2',
    borderWidth: 2,
    borderColor: '#93C5FD',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bestValueText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  priceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 8,
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  priceNote: {
    fontSize: 12,
    color: '#93C5FD',
  },
  trialButton: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  trialButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  trialNote: {
    fontSize: 14,
    color: '#93C5FD',
    textAlign: 'center',
    marginBottom: 32,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  footerLink: {
    fontSize: 12,
    color: '#93C5FD',
  },
  footerDivider: {
    color: '#4B5563',
  },
});
