# DeskFix - Dokumentace Bezpečnosti a Compliance

## 📚 Přehled dokumentů

Připravil jsem kompletní sadu dokumentů pro GDPR compliance a bezpečnost zdravotnické aplikace DeskFix. Zde je návod, jak s nimi pracovat.

---

## 🗂️ Struktura dokumentace

### 1. **SECURITY_COMPLIANCE.md** (Hlavní dokument)
**Účel:** Kompletní compliance příručka pro MVP

**Obsah:**
- ✅ Zdravotní disclaimer (texty pro app + App Store)
- ✅ GDPR Compliance Checklist (co sbíráme, právní základ)
- ✅ Privacy Policy outline (8 sekcí)
- ✅ Terms of Service outline (freemium model)
- ✅ App Store requirements (iOS + Android)
- ✅ Implementation recommendations
- ✅ Risk assessment
- ✅ Email templates pro support

**Kdy použít:**
- Při přípravě právních dokumentů
- Při vyplňování App Store metadata
- Při odpovídání na GDPR requests
- Pro pochopení celkové compliance strategie

**Klíčové sekce:**
- Sekce 1: Medical Disclaimer → copy-paste ready text
- Sekce 2: GDPR checklist → co implementovat
- Sekce 3-4: Privacy Policy + ToS templates
- Sekce 6: Kde zobrazit disclaimer, jak implementovat GDPR funkce

---

### 2. **COMPLIANCE_IMPLEMENTATION.md** (Code snippets)
**Účel:** Praktické code examples pro implementaci

**Obsah:**
- ✅ Onboarding screen s disclaimerem (TypeScript/React Native)
- ✅ Privacy Settings screen (GDPR UI)
- ✅ Data Management utils (export, delete, view data)
- ✅ Exercise warning modal (optional)
- ✅ Analytics s opt-in (privacy-first)
- ✅ App Store metadata templates
- ✅ Support email templates

**Kdy použít:**
- Při implementaci disclaimer obrazovky
- Při vytváření GDPR funkcí (smazat/exportovat data)
- Při integraci analytics
- Při vyplňování App Store Connect / Play Console

**Klíčové části:**
- Code snippet 1-2: Disclaimer + Privacy screens → copy-paste ready
- Code snippet 3: Data management → `deleteAllUserData()`, `exportUserData()`
- Code snippet 6: App Store metadata → Privacy Nutrition Label

---

### 3. **COMPLIANCE_CHECKLIST.md** (Quick reference)
**Účel:** Rychlá kontrola před launch

**Obsah:**
- ✅ Pre-launch checklist (právní docs, in-app, testing)
- ✅ Red flags (co NEDĚLAT v marketingu)
- ✅ Testing scenarios (disclaimer flow, GDPR features)
- ✅ App Store submission checklist
- ✅ Decision trees (jsme medical device? potřebujeme consent?)

**Kdy použít:**
- Těsně před submitem do App Store
- Pro kontrolu, že nic nechybí
- Pro QA testing (GDPR features)
- Pro quick reference během vývoje

**Klíčové sekce:**
- "Testing" → před každým releasem
- "Red Flags" → při psaní marketingových textů
- "Final Pre-Launch Check" → před submitem

---

## 🚀 Jak začít (Krok za krokem)

### FÁZE 1: Pochopení (První den)

1. **Přečti:** `SECURITY_COMPLIANCE.md` → Sekce 1-2
   - Zjistíš, co musí obsahovat disclaimer
   - Pochopíš, co sbíráš a proč (GDPR)

2. **Rozhodnutí:**
   - [ ] Chceme analytics? → Pokud ano, bude opt-in (sekce 6.3)
   - [ ] Máme právníka? → Pokud ne, použij templates (riziko acknowledged)
   - [ ] Kdy launch? → Podle toho prioritizuj

### FÁZE 2: Právní dokumenty (Den 2-3)

3. **Vytvoř Privacy Policy:**
   - Použij template z `SECURITY_COMPLIANCE.md` → Sekce 3
   - Uprav kontaktní údaje (IČO, adresa, email)
   - Publikuj na webu (např. `https://deskfix.app/privacy`)

4. **Vytvoř Terms of Service:**
   - Použij template z `SECURITY_COMPLIANCE.md` → Sekce 4
   - Uprav ceny a předplatné detaily
   - Publikuj na webu (`https://deskfix.app/terms`)

5. **Zkontroluj disclaimer text:**
   - Zkopíruj z `SECURITY_COMPLIANCE.md` → Sekce 1.1
   - Uprav podle produktu (pokud potřeba)

### FÁZE 3: Implementace v aplikaci (Den 4-7)

6. **Onboarding s disclaimerem:**
   - Zkopíruj code z `COMPLIANCE_IMPLEMENTATION.md` → Snippet 1
   - Vytvoř `app/(onboarding)/disclaimer.tsx`
   - Testuj: nelze skip bez checkboxu

7. **Privacy Settings screen:**
   - Zkopíruj code z `COMPLIANCE_IMPLEMENTATION.md` → Snippet 2
   - Vytvoř `app/(tabs)/settings/privacy.tsx`
   - Testuj všechna tlačítka

8. **Data Management utils:**
   - Zkopíruj code z `COMPLIANCE_IMPLEMENTATION.md` → Snippet 3
   - Vytvoř `utils/dataManagement.ts`
   - Implementuj:
     - `deleteAllUserData()`
     - `exportUserData()`
     - `getUserDataSummary()`

9. **Linkuj Privacy Policy:**
   - Vytvoř webview nebo external link
   - Přidej do onboardingu, settings, footer

### FÁZE 4: App Store Metadata (Den 8)

10. **Apple App Store Connect:**
    - Kategorie: **Health & Fitness**
    - Privacy Policy URL: `https://deskfix.app/privacy`
    - Vyplň Privacy Nutrition Label (template: `COMPLIANCE_IMPLEMENTATION.md` → Snippet 6)
    - App Review Notes: "NOT a medical device" (template included)

11. **Google Play Console:**
    - Kategorie: **Health & Fitness**
    - Vyplň Data Safety section
    - Privacy Policy URL: `https://deskfix.app/privacy`

12. **App Description:**
    - Přidej disclaimer na začátek (template: `SECURITY_COMPLIANCE.md` → Sekce 1.2)

### FÁZE 5: Testing (Den 9)

13. **Projdi checklist:**
    - Otevři `COMPLIANCE_CHECKLIST.md`
    - Projdi "Testing" sekci
    - Zaškrtni každý test

14. **Kritické testy:**
    - [ ] Disclaimer nelze přeskočit
    - [ ] "Smazat data" skutečně vymaže SQLite + AsyncStorage
    - [ ] Export vytvoří validní JSON
    - [ ] Odinstalace + reinstalace = čistá data

### FÁZE 6: Support Readiness (Den 10)

15. **Připrav emaily:**
    - Vytvoř `privacy@deskfix.app` (Gmail nebo custom)
    - Vytvoř `support@deskfix.app`
    - Ulož email templates z `COMPLIANCE_IMPLEMENTATION.md` → Sekce 8

16. **Final check:**
    - Projdi `COMPLIANCE_CHECKLIST.md` → "Final Pre-Launch Check"
    - Všechny checkboxy zaškrtnuté? → **READY TO SUBMIT** 🚀

---

## 📖 Nejčastější otázky (FAQ)

### Q: Musíme mít právníka?
**A:** Ne pro MVP. Templates jsou dostatečné pro start. Doporučujeme právníka, až budete mít traction (např. 10k+ downloads). Náklady: ~10 000 Kč jednorázově.

### Q: Co když Apple/Google odmítnou kvůli "health claims"?
**A:** Použij response template z `COMPLIANCE_IMPLEMENTATION.md` → Sekce 9. Zdůrazni: "NOT medical device", máme disclaimer, kategorie Health (ne Medical).

### Q: Jak často updatovat Privacy Policy?
**A:** Každých 6 měsíců review. Update povinný, když:
- Přidáváš nové funkce (analytics, server)
- Změna legislativy (GDPR updates)
- Změna datového modelu

### Q: Co když uživatel požádá o výmaz dat?
**A:** Použij email template z `COMPLIANCE_IMPLEMENTATION.md` → Sekce 8, Template 2. Vysvětli, že data jsou lokální → návod na smazání in-app.

### Q: Potřebujeme consent pro lokální data?
**A:** Ne pro funkčnost (legitimní zájem). Ano pro analytics (opt-in povinný).

### Q: Můžeme říct "DeskFix léčí bolest"?
**A:** ❌ **NE!** To je medical claim. ✅ Správně: "DeskFix pomůže ulevit od napětí". Viz `COMPLIANCE_CHECKLIST.md` → Red Flags.

### Q: Co když implementujeme server v budoucnu?
**A:** Musíš:
1. Update Privacy Policy (nová verze 2.0)
2. Přidat consent screen ("Souhlasím se zasíláním dat na server")
3. Re-submit App Store metadata (Data Safety změna)
4. Implementovat server-side GDPR (export/delete API endpoints)

---

## 🎯 Priority pro MVP

**MUST HAVE (před launchem):**
1. ✅ Disclaimer v onboardingu (nelze skip)
2. ✅ Privacy Policy online + link in-app
3. ✅ "Smazat všechna data" funkční
4. ✅ App Store metadata vyplněna (kategorie, Privacy Label)
5. ✅ Disclaimer v App Store description

**SHOULD HAVE (doporučeno):**
6. ✅ "Exportovat data" funkce
7. ✅ "Zobrazit moje data" screen
8. ✅ Terms of Service online
9. ✅ Support email ready

**NICE TO HAVE (post-launch):**
10. Analytics opt-in screen (pokud potřebujete)
11. Právník review (po 10k downloads)
12. A/B testing disclaimer texts

---

## 🔧 Technical Stack pro Compliance

**Potřebné dependencies:**
```bash
npm install @react-native-async-storage/async-storage
npm install expo-file-system
npm install expo-sharing
npm install expo-notifications
npm install expo-checkbox
```

**Soubory k vytvoření:**
```
app/
  (onboarding)/
    disclaimer.tsx          # ← Snippet 1
  (tabs)/
    settings/
      privacy.tsx           # ← Snippet 2
  (legal)/
    privacy-policy.tsx      # WebView nebo Markdown
    terms-of-service.tsx
    health-disclaimer.tsx

utils/
  dataManagement.ts         # ← Snippet 3

constants/
  ComplianceVersion.ts      # ← Snippet 10 (tracking)
```

---

## 📞 Support Contacts

**GDPR Úřad (ČR):**
- Web: uoou.cz
- Tel: +420 234 665 111

**App Store:**
- developer.apple.com/contact

**Google Play:**
- play.google.com/console/about/contact

**ČOI (spotřebitelské spory):**
- coi.cz

---

## 📅 Maintenance Schedule

| Úkol | Frekvence | Odpovědná osoba |
|------|-----------|-----------------|
| Review Privacy Policy | 6 měsíců | Product Owner |
| Test GDPR functions | Před každým release | QA |
| Check GDPR compliance | Ročně | CTO/Legal |
| Odpověď na GDPR requests | Do 30 dnů | Support Team |
| Update disclaimers (pokud legislativa) | Podle potřeby | Legal |

---

## ✅ Quick Win Tips

1. **Copy-paste ready:**
   - Disclaimer text → `SECURITY_COMPLIANCE.md` → Sekce 1.1
   - Privacy Policy → Sekce 3 (uprav kontakty)
   - Onboarding code → `COMPLIANCE_IMPLEMENTATION.md` → Snippet 1

2. **Zjednodušení pro MVP:**
   - Bez analytics = méně compliance práce
   - Local-only data = žádné GDPR serverové komplikace
   - Freemium přes Apple/Google = oni řeší platby

3. **Nejčastější chyba:**
   - ❌ Říct "medical advice" v app description
   - ✅ Vždy zdůrazňuj "wellness", "prevention", "NOT medical device"

4. **Hidden gem:**
   - Decision trees v `COMPLIANCE_CHECKLIST.md` → instant clarity

---

## 🚨 Red Alert Situations

**OKAMŽITĚ PŘESTAT když:**
1. Někdo chce přidat "diagnostiku" → medical device territory!
2. Marketing píše "léčba" → App Store rejection
3. Někdo chce posílat health data na server bez consent → GDPR violation
4. QA najde, že "Smazat data" nemaže vše → GDPR breach risk

**Eskalace:**
→ Přečti `SECURITY_COMPLIANCE.md` → Sekce 8 (Risk Assessment)
→ Případně konzultuj právníka

---

## 📊 Success Metrics

**Compliance je úspěšné, když:**
- ✅ Disclaimer acceptance rate >95%
- ✅ Zero App Store rejections kvůli health claims
- ✅ <5 GDPR requests měsíčně
- ✅ Zero data breaches (local-only = low risk)

---

## 🎓 Další vzdělávání

**Doporučené zdroje:**
- GDPR checklist: gdprchecklist.io
- Apple Health Guidelines: developer.apple.com/health-fitness
- Google Health Policy: support.google.com/googleplay (policy overview)
- ÚOOU (ČR): uoou.cz/gdpr

---

## 📝 Version History

| Verze | Datum | Změny |
|-------|-------|-------|
| 1.0 | 24. 12. 2025 | Initial compliance documentation pro MVP |

---

## 🙏 Credits

**Připravil:** Security Auditor & Compliance Expert
**Pro:** DeskFix MVP Launch
**Kontext:** Freemium health & fitness app, local-first data, EU/US markets

---

**🚀 Ready to launch compliant app? Start with FÁZE 1 výše!**

**⚠️ REMINDER:** Tato dokumentace nenahrazuje právní poradenství. Pro production
launch doporučujeme konzultaci s právníkem (náklady: ~10 000 Kč).

---

**Máte otázky? Kontaktujte autora nebo začněte s implementací podle FÁZE 2!**
