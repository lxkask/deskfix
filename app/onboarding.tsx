import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useThemeColors } from '@/providers/ThemeProvider';
import { Button } from '@/components';
import { secureStorage } from '@/services/secureStorage';

const BODY_PARTS = [
  { id: 'neck', name: 'Krk', emoji: '🦒' },
  { id: 'shoulders', name: 'Ramena', emoji: '💪' },
  { id: 'upper_back', name: 'Horní záda', emoji: '🔙' },
  { id: 'lower_back', name: 'Dolní záda', emoji: '🦴' },
  { id: 'wrists', name: 'Zápěstí', emoji: '🤚' },
  { id: 'hips', name: 'Kyčle', emoji: '🦵' },
];

// Total steps: 0=Disclaimer, 1=Welcome, 2=BodyParts, 3=Notifications
const TOTAL_STEPS = 4;

export default function OnboardingScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [step, setStep] = useState(0);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  const toggleBodyPart = (id: string) => {
    setSelectedParts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    if (step === 0) {
      // Disclaimer accepted, move to welcome
      setStep(1);
    } else if (step === 1) {
      // Welcome seen, move to body parts
      setStep(2);
    } else if (step === 2) {
      // Request notification permission
      const { status } = await Notifications.requestPermissionsAsync();
      // Notification permission request completed
      setStep(3);
    } else {
      // Complete onboarding
      await saveOnboardingData();
      router.replace('/(tabs)');
    }
  };

  const saveOnboardingData = async () => {
    try {
      const settings = {
        onboarding_completed: true,
        selected_pain_areas: selectedParts,
        office_mode: true,
        hourly_nudge_enabled: false,
        work_hours_start: '09:00',
        work_hours_end: '17:00',
      };
      await AsyncStorage.setItem('user_settings', JSON.stringify(settings));
      await AsyncStorage.setItem('onboarding_completed', 'true');
      // Save disclaimer acceptance securely
      await secureStorage.setDisclaimerAccepted(true);
    } catch {
      // Silently fail - onboarding will work without secure storage
    }
  };

  const handleSkip = () => {
    saveOnboardingData();
    router.replace('/(tabs)');
  };

  // Can only skip after disclaimer is accepted
  const canSkip = step > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Skip Button - hidden on disclaimer step */}
      {canSkip && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>Přeskočit</Text>
        </TouchableOpacity>
      )}

      {/* Progress Dots */}
      <View style={styles.progressDots}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: colors.cardBorder },
              step === i && [styles.dotActive, { backgroundColor: colors.primary }],
            ]}
          />
        ))}
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Step 0: Medical Disclaimer (REQUIRED - cannot skip) */}
        {step === 0 && (
          <>
            <Text style={styles.emoji}>⚕️</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Důležité upozornění</Text>
            <View style={[styles.disclaimerBox, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
              <Text style={[styles.disclaimerText, { color: colors.textPrimary }]}>
                DeskFix není náhradou za profesionální lékařskou péči.
              </Text>
              <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
                {'\n'}Cvičení v této aplikaci jsou navržena pro obecnou prevenci a úlevu od běžného nepohodlí způsobeného sedavým zaměstnáním.
              </Text>
              <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
                {'\n'}Pokud máte chronické bolesti, zranění nebo jiné zdravotní problémy, poraďte se před použitím aplikace s lékařem nebo fyzioterapeutem.
              </Text>
              <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
                {'\n'}Při cvičení naslouchejte svému tělu. Pokud cítíte bolest, přestaňte.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setDisclaimerAccepted(!disclaimerAccepted)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: disclaimerAccepted }}
            >
              <View style={[
                styles.checkbox,
                { borderColor: colors.primary },
                disclaimerAccepted && { backgroundColor: colors.primary }
              ]}>
                {disclaimerAccepted && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.checkboxLabel, { color: colors.textPrimary }]}>
                Rozumím a souhlasím
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Step 1: Welcome */}
        {step === 1 && (
          <>
            <Text style={styles.emoji}>👋</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Vítej v DeskFix!</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Mikro-fyzioterapeut do kapsy pro office workers
            </Text>
            <View style={[styles.benefits, { backgroundColor: colors.secondary + '20' }]}>
              <Text style={[styles.benefitItem, { color: colors.secondary }]}>✓ 3minutové rutiny přímo u stolu</Text>
              <Text style={[styles.benefitItem, { color: colors.secondary }]}>✓ Žádné převlékání, žádné pocení</Text>
              <Text style={[styles.benefitItem, { color: colors.secondary }]}>✓ Okamžitá úleva od bolesti</Text>
            </View>
          </>
        )}

        {/* Step 2: Body Parts */}
        {step === 2 && (
          <>
            <Text style={styles.emoji}>🎯</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Co tě nejvíc bolí?</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Vyber oblasti, které chceš ošetřit
            </Text>
            <View style={styles.bodyPartsGrid}>
              {BODY_PARTS.map((part) => (
                <TouchableOpacity
                  key={part.id}
                  style={[
                    styles.bodyPartButton,
                    { backgroundColor: colors.cardBackground, borderColor: 'transparent' },
                    selectedParts.includes(part.id) && { backgroundColor: colors.primary + '20', borderColor: colors.primary },
                  ]}
                  onPress={() => toggleBodyPart(part.id)}
                >
                  <Text style={styles.bodyPartEmoji}>{part.emoji}</Text>
                  <Text style={[
                    styles.bodyPartName,
                    { color: colors.textPrimary },
                    selectedParts.includes(part.id) && { color: colors.primary },
                  ]}>
                    {part.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Step 3: Notifications */}
        {step === 3 && (
          <>
            <Text style={styles.emoji}>🔔</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Hourly Nudge</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Připomínky na protažení každou hodinu
            </Text>
            <View style={styles.nudgeInfo}>
              <View style={[styles.nudgeFeature, { backgroundColor: colors.cardBackground }]}>
                <Text style={styles.nudgeEmoji}>⏰</Text>
                <Text style={[styles.nudgeText, { color: colors.textPrimary }]}>Diskrétní připomínky během práce</Text>
              </View>
              <View style={[styles.nudgeFeature, { backgroundColor: colors.cardBackground }]}>
                <Text style={styles.nudgeEmoji}>🎲</Text>
                <Text style={[styles.nudgeText, { color: colors.textPrimary }]}>Náhodný micro-drill (30s)</Text>
              </View>
              <View style={[styles.nudgeFeature, { backgroundColor: colors.cardBackground }]}>
                <Text style={styles.nudgeEmoji}>🔇</Text>
                <Text style={[styles.nudgeText, { color: colors.textPrimary }]}>Office Mode - pouze vibrace</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Next Button */}
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Button
          variant="primary"
          fullWidth
          onPress={handleNext}
          disabled={step === 0 && !disclaimerAccepted}
        >
          {step === 0 ? 'Souhlasím' : step === 3 ? 'Začít používat DeskFix' : 'Pokračovat'}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  skipButtonText: {
    fontSize: 16,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    alignItems: 'center',
    paddingTop: 48,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  benefits: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
  },
  benefitItem: {
    fontSize: 16,
    paddingVertical: 8,
  },
  disclaimerBox: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  disclaimerText: {
    fontSize: 15,
    lineHeight: 22,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    minHeight: 48,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  bodyPartsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  bodyPartButton: {
    width: '45%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
  },
  bodyPartEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  bodyPartName: {
    fontSize: 16,
    fontWeight: '600',
  },
  nudgeInfo: {
    width: '100%',
    gap: 16,
  },
  nudgeFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
  },
  nudgeEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  nudgeText: {
    fontSize: 16,
    flex: 1,
  },
  footer: {
    padding: 24,
  },
});
