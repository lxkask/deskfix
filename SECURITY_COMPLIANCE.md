# DeskFix - Bezpečnost a Compliance

## Datum vytvoření: 24. prosince 2025
## Verze dokumentu: 1.0 (MVP)

---

## 1. ZDRAVOTNÍ DISCLAIMER (Medical Disclaimer)

### 1.1 Text pro zobrazení v aplikaci

**Umístění:** Onboarding (první spuštění) + Nastavení (kdykoliv přístupné)

```
⚠️ DŮLEŽITÉ UPOZORNĚNÍ

DeskFix je aplikace pro prevenci a úlevu od nepohodlí spojených se sedavým
zaměstnáním. Aplikace NENÍ lékařský prostředek a NEPOSKYTUJE lékařské rady,
diagnostiku ani léčbu.

Cvičební programy a doporučení v této aplikaci slouží pouze pro všeobecné
informační a vzdělávací účely. Nejsou určeny k nahrazení odborné lékařské
péče, konzultace, diagnostiky nebo léčby od kvalifikovaného zdravotnického
pracovníka.

PŘED ZAHÁJENÍM jakéhokoli cvičebního programu:
• Konzultujte své zdravotní potíže s lékařem nebo fyzioterapeutem
• Pokud trpíte chronickou bolestí, zraněním nebo akutním onemocněním,
  nepoužívajte tuto aplikaci bez schválení lékařem
• Pokud během cvičení pociťujete akutní bolest, závratě nebo jiné
  neobvyklé příznaky, okamžitě přestaňte a vyhledejte lékařskou pomoc

Používáním této aplikace berete na vědomí, že:
• Cvičíte na vlastní riziko a zodpovědnost
• Provozovatel aplikace nenese odpovědnost za případná zranění nebo
  zdravotní komplikace vzniklé používáním aplikace
• Aplikace negarantuje žádné konkrétní zdravotní výsledky

V případě vážných nebo dlouhodobých zdravotních potíží vždy vyhledejte
odbornou lékařskou pomoc.
```

**Délka textu:** ~1 500 znaků
**Povinná akce uživatele:** Zaškrtnutí "Rozumím a souhlasím" + pokračování

---

### 1.2 Text pro App Store / Google Play

**Apple App Store - Description:**

```
DeskFix - Rychlá úleva od bolesti pro office workers

ZDRAVOTNÍ UPOZORNĚNÍ:
Tato aplikace není lékařský prostředek a neposkytuje lékařské rady.
Cviky slouží pouze k prevenci a obecné úlevě od nepohodlí. Před použitím
konzultujte své zdravotní potíže s lékařem, zejména pokud trpíte
chronickou bolestí nebo zraněními.

[...zbytek popisu aplikace...]
```

**Google Play - Description:**

```
⚠️ Aplikace neposkytuje lékařskou péči ani diagnostiku. Vždy konzultujte
zdravotní potíže s odborníkem.

DeskFix je preventivní aplikace s cvičením pro office workers...

[...zbytek popisu...]
```

**Kategorie:**
- Apple: Health & Fitness (NOT Medical)
- Google: Health & Fitness (NOT Medical)

---

## 2. GDPR COMPLIANCE CHECKLIST

### 2.1 Osobní údaje - Co aplikace sbírá

| Typ údaje | Příklad | Účel | Právní základ |
|-----------|---------|------|---------------|
| **Nastavení uživatele** | Pracovní doba (09:00-17:00), bolavé partie | Funkčnost aplikace | Legitimní zájem (čl. 6 odst. 1 písm. f GDPR) |
| **Historie cvičení** | Datum, čas, dokončené cviky, subjektivní hodnocení bolesti | Zobrazení statistik, streak | Legitimní zájem |
| **ID zařízení** | Expo Push Token (pro lokální notifikace) | Doručení notifikací | Legitimní zájem |
| **In-App Purchase data** | Stav předplatného (free/pro) | Odemykání Pro funkcí | Plnění smlouvy (čl. 6 odst. 1 písm. b) |
| **Analytics (volitelné)** | Anonymní usage data (pokud implementováno) | Zlepšení aplikace | Souhlas (čl. 6 odst. 1 písm. a) |

**NESBÍRÁME:**
- Jméno, příjmení, e-mail (není potřeba pro funkčnost)
- Fotografie nebo biometrické údaje
- Přesnou GPS lokaci
- Kontakty nebo přístup ke kameře/mikrofonu

**Všechna data jsou uložena lokálně na zařízení uživatele** (SQLite/AsyncStorage).

---

### 2.2 Právní základ zpracování

1. **Legitimní zájem** (čl. 6 odst. 1 písm. f GDPR):
   - Ukládání nastavení a historie pro funkčnost aplikace
   - Plánování notifikací podle preferencí uživatele
   - Není nutný explicitní souhlas (data lokální, nezbytná pro službu)

2. **Plnění smlouvy** (čl. 6 odst. 1 písm. b GDPR):
   - Zpracování plateb přes Apple/Google (zpracovává Apple/Google, ne DeskFix)
   - Ukládání stavu předplatného

3. **Souhlas** (čl. 6 odst. 1 písm. a GDPR) - pouze pokud:
   - Implementujeme volitelnou analytiku (např. Firebase Analytics)
   - Vyžaduje explicitní opt-in při onboardingu

---

### 2.3 Data Retention Policy (Zásady uchovávání dat)

| Typ údaje | Doba uchovávání | Způsob mazání |
|-----------|-----------------|---------------|
| Historie cvičení | Do smazání aplikace nebo manuálního vymazání uživatelem | Tlačítko "Smazat historii" v nastavení |
| Nastavení | Do smazání aplikace | Automaticky při odinstalaci |
| Expo Push Token | Do vypnutí notifikací nebo smazání aplikace | Automaticky |
| In-App Purchase stav | Uchovává Apple/Google (ne DeskFix) | Přes Apple/Google账户 |

**Automatické mazání:**
Data jsou uložena pouze lokálně → odinstalace aplikace = automatické smazání všech dat.

---

### 2.4 Práva uživatele dle GDPR

| Právo | Jak to implementovat v MVP |
|-------|---------------------------|
| **Právo na přístup** (čl. 15) | Obrazovka "Moje data" v nastavení - zobrazí všechna uložená data |
| **Právo na opravu** (čl. 16) | Uživatel si může upravit nastavení kdykoliv |
| **Právo na výmaz** (čl. 17) | Tlačítko "Smazat všechna data" v nastavení (vymaže SQLite databázi) |
| **Právo na přenositelnost** (čl. 20) | Tlačítko "Exportovat data" → export do JSON souboru |
| **Právo na omezení zpracování** (čl. 18) | Vypnutí analytics (pokud implementováno), vypnutí notifikací |
| **Právo odvolat souhlas** (čl. 7 odst. 3) | Přepínač "Analytics" v nastavení (pokud implementováno) |

**Implementace v MVP:**

```
Nastavení > Soukromí a data
├── Zobrazit moje data (read-only view)
├── Exportovat data jako JSON
├── Smazat historii cvičení
└── Smazat všechna data a resetovat aplikaci
```

---

### 2.5 Povinné UI prvky pro GDPR

**1. Onboarding (první spuštění):**
```
[ ] Přečetl/a jsem a souhlasím se zdravotním disclaimerem
[ ] Souhlasím se zpracováním osobních údajů (odkaz na Privacy Policy)
[Volitelné] [ ] Souhlasím s anonymní analytkou pro zlepšení aplikace
```

**2. Nastavení - sekce "Soukromí":**
- Odkaz na Privacy Policy (in-app webview nebo external browser)
- Odkaz na Terms of Service
- Tlačítko "Zobrazit moje data"
- Tlačítko "Exportovat data"
- Tlačítko "Smazat všechna data"
- Verze aplikace + verze Privacy Policy

**3. Footer každé obrazovky (nebo v menu):**
- Malý link "Ochrana soukromí" → Privacy Policy

---

## 3. PRIVACY POLICY - Osnova (Zásady ochrany osobních údajů)

**Povinné sekce pro GDPR:**

### 3.1 Identifikace správce

```markdown
## 1. Správce osobních údajů

[Vaše firma/jméno]
IČO: [XXX]
Sídlo: [adresa]
E-mail: privacy@deskfix.app
```

### 3.2 Jaké údaje sbíráme

```markdown
## 2. Jaké údaje zpracováváme

DeskFix zpracovává následující osobní údaje:

a) **Nastavení aplikace**: pracovní doba, preferované cviky, zapnutí Office Mode
b) **Historie cvičení**: datum a čas cvičení, dokončené cviky, subjektivní hodnocení
   bolesti (1-10)
c) **Stav předplatného**: zda máte aktivní Pro verzi (zpracovává Apple/Google)
d) **Technická data**: ID zařízení pro doručení lokálních notifikací

Všechna data jsou uložena POUZE na vašem zařízení. DeskFix neposílá vaše data
na žádný server.
```

### 3.3 Právní základ a účel

```markdown
## 3. Proč vaše údaje zpracováváme

| Údaj | Účel | Právní základ |
|------|------|---------------|
| Nastavení | Funkčnost aplikace (notifikace, doporučení cviků) | Legitimní zájem |
| Historie | Zobrazení statistik, streak counter | Legitimní zájem |
| ID zařízení | Doručení lokálních notifikací | Legitimní zájem |
| Stav předplatného | Odemykání Pro funkcí | Plnění smlouvy |
```

### 3.4 Sdílení dat

```markdown
## 4. Komu vaše data předáváme

DeskFix NESDÍLÍ vaše osobní údaje s třetími stranami, kromě:

- **Apple/Google**: In-App Purchase transakce (řídí se jejich Privacy Policy)
- **Expo (Push notifikace)**: Pouze anonymní token pro doručení lokálních notifikací

Vaše data nejsou prodávána ani pronajímána reklamním společnostem.
```

### 3.5 Vaše práva

```markdown
## 5. Vaše práva

Máte právo:
- Zobrazit všechna uložená data (Nastavení > Moje data)
- Exportovat data jako JSON soubor
- Smazat historii nebo všechna data
- Odvolat souhlas s analytics (pokud byl udělen)

Pro dotazy kontaktujte: privacy@deskfix.app
```

### 3.6 Zabezpečení

```markdown
## 6. Zabezpečení dat

Všechna data jsou uložena lokálně na vašem zařízení v šifrované formě
(iOS Keychain/Android Keystore pro citlivá nastavení). DeskFix neposílá
vaše zdravotní údaje přes internet.
```

### 3.7 Děti

```markdown
## 7. Údaje o dětech

Aplikace je určena osobám starším 16 let. Pokud je uživatel mladší 16 let,
je vyžadován souhlas zákonného zástupce.
```

### 3.8 Změny Privacy Policy

```markdown
## 8. Změny těchto zásad

O změnách budete informováni prostřednictvím aplikace. Aktuální verze: 1.0
(Platnost od: 1. 1. 2026)
```

### 3.9 Kontakt na DPO (pokud je vyžadováno)

```markdown
## 9. Kontakt

Pro dotazy ohledně ochrany osobních údajů:
E-mail: privacy@deskfix.app
```

**Celková délka:** ~2-3 stránky A4
**Formát:** In-app webview (HTML) nebo PDF ke stažení

---

## 4. TERMS OF SERVICE - Osnova (Obchodní podmínky)

### 4.1 Struktura ToS pro freemium health app

```markdown
# Obchodní podmínky aplikace DeskFix

Platnost od: 1. 1. 2026
Verze: 1.0

## 1. Úvodní ustanovení

1.1 Tyto obchodní podmínky upravují používání mobilní aplikace DeskFix
    (dále jen "Aplikace")
1.2 Provozovatelem je: [Vaše firma], IČO: [XXX]
1.3 Instalací a používáním Aplikace vyjadřujete souhlas s těmito podmínkami

## 2. Popis služby

2.1 Aplikace poskytuje cvičební programy pro prevenci a úlevu od nepohodlí
    spojeného se sedavým zaměstnáním
2.2 Aplikace NENÍ lékařský prostředek a neposkytuje lékařské rady
2.3 Obsah je pouze informativní a nevyžaduje lékařskou konzultaci (viz Disclaimer)

## 3. Registrace a účet

3.1 Pro základní funkce není nutná registrace (local-first přístup)
3.2 Pro aktivaci Pro předplatného je nutný Apple ID / Google Account

## 4. Předplatné a platby (Freemium model)

4.1 **Bezplatná verze** zahrnuje:
    - Cviky pro 2 partie těla (Krk, Zápěstí)
    - Základní timer a přehrávač

4.2 **Pro verze** (měsíční/roční předplatné nebo jednorázová platba):
    - Všechny partie těla
    - Hourly Nudge (preventivní notifikace)
    - Vlastní rutiny a statistiky

4.3 **Platební podmínky**:
    - Platby jsou zpracovány přes Apple App Store / Google Play
    - Měsíční předplatné se automaticky obnovuje
    - Zrušení: přes nastavení Apple/Google účtu (ne v aplikaci)
    - Refundace: dle pravidel Apple/Google (prvních 14 dní v EU)

4.4 **Zkušební období** (pokud nabídnuto):
    - 7 dní zdarma, poté automatický přechod na placené předplatné
    - Zrušit lze kdykoliv před koncem zkušebního období

## 5. Zdravotní disclaimer a omezení odpovědnosti

5.1 Aplikace není náhradou lékařské péče (viz sekce 1 tohoto dokumentu)
5.2 Uživatel cvičí na vlastní riziko
5.3 Provozovatel nenese odpovědnost za:
    - Zranění vzniklá nesprávným provedením cviků
    - Škody vzniklé používáním aplikace v rozporu s doporučeními
    - Výpadky služby nebo technické problémy

## 6. Duševní vlastnictví

6.1 Veškerý obsah (videa, texty, grafika) je chráněn autorským právem
6.2 Uživatel získává nevýhradní licenci pro osobní nekomerční použití
6.3 Zakazuje se:
    - Kopírování a distribuce obsahu mimo aplikaci
    - Reverzní inženýrství aplikace
    - Komerční využití obsahu bez souhlasu

## 7. Ochrana osobních údajů

7.1 Zpracování osobních údajů se řídí Privacy Policy (viz sekce 3)
7.2 Data jsou uložena lokálně na zařízení uživatele

## 8. Ukončení služby

8.1 Uživatel může kdykoliv aplikaci odinstalovat
8.2 Provozovatel si vyhrazuje právo ukončit službu s 30denní výpovědní lhůtou
8.3 Při ukončení předplatného zůstává přístup k bezplatné verzi

## 9. Změny podmínek

9.1 Provozovatel může změnit tyto podmínky s 14denním předstihem
9.2 O změnách budete informováni v aplikaci
9.3 Pokračující používání = souhlas se změnami

## 10. Řešení sporů

10.1 Řídí se právem České republiky
10.2 Spotřebitel má právo obrátit se na mimosoudní řešení sporů (ČOI)
10.3 Příslušný soud: [Vaše sídlo]

## 11. Kontakt

E-mail: support@deskfix.app
Adresa: [Vaše adresa]
```

**Celková délka:** ~3-4 stránky A4

---

## 5. APP STORE COMPLIANCE

### 5.1 Apple App Store - Health & Fitness Requirements

**Kategorie:** Health & Fitness (NOT Medical)

**Povinné disclaimery v App Store Description:**

```
⚠️ ZDRAVOTNÍ UPOZORNĚNÍ
Tato aplikace neposkytuje lékařskou péči, diagnostiku ani léčbu.
Před zahájením cvičení konzultujte své zdravotní potíže s lékařem.

Kategorie: Health & Fitness
Věková hranice: 12+ (bez zdravotního obsahu vyžadujícího 17+)
```

**App Store Review Guidelines - Compliance:**

1. **Guideline 5.1.1 (Data Collection)**:
   - ✅ Žádná data mimo zařízení
   - ✅ Privacy Policy dostupná in-app a na webu
   - ✅ Transparentní popis sběru dat

2. **Guideline 2.5.13 (Health Apps)**:
   - ✅ Není medical device → není nutná certifikace FDA/MDR
   - ✅ Disclaimer jasně uveden v onboardingu
   - ⚠️ **DŮLEŽITÉ**: Nepoužívat slova jako "léčba", "diagnóza", "terapie"
     → Místo toho: "úleva", "prevence", "cvičení", "wellness"

3. **Guideline 3.1.2 (Subscriptions)**:
   - ✅ Jasný popis free vs pro funkcí
   - ✅ Cena viditelná před nákupem
   - ✅ Možnost zrušení uvedena v nastavení

**Metadata pro App Store Connect:**

```yaml
App Name: DeskFix - Cvičení proti bolesti
Subtitle: Rychlá úleva pro office workers
Category: Health & Fitness
Age Rating: 12+
Privacy Policy URL: https://deskfix.app/privacy
Terms of Use URL: https://deskfix.app/terms

App Review Notes:
"Aplikace neposkytuje lékařské rady. Všechna data jsou ukládána lokálně.
Pro testování Pro funkcí použijte test account [...]"
```

---

### 5.2 Google Play Store - Health & Fitness Requirements

**Kategorie:** Health & Fitness

**Povinné disclaimery v Play Store Description:**

```
⚠️ Aplikace neposkytuje lékařskou péči ani diagnostiku. Vždy konzultujte
zdravotní potíže s odborníkem.

Kategorie: Zdraví a fitness
Věková skupina: Dospělí (neobsahuje citlivý zdravotní obsah)
```

**Google Play Policy Compliance:**

1. **Health Policy**:
   - ✅ Není medical device → není nutná certifikace
   - ✅ Disclaimer v aplikaci i na Play Store
   - ⚠️ Netvrdíme, že aplikace "léčí" nebo "diagnostikuje"

2. **User Data Policy**:
   - ✅ Data Safety section vyplněna (viz níže)
   - ✅ Žádná data mimo zařízení
   - ✅ Privacy Policy link

3. **Subscription Policy**:
   - ✅ Jasný popis free vs paid
   - ✅ Možnost zrušení přes Google Play

**Data Safety Section (Google Play Console):**

```
Data Collection: ANO (ukládáme lokálně)

Collected Data Types:
☑️ Health and fitness
   - Exercise data (stored locally only)
   - Pain level ratings (stored locally only)

☑️ App activity
   - App interactions (stored locally only)

☑️ Device or other IDs
   - Device ID for local notifications only

Data Sharing: NE
Data Encrypted in Transit: N/A (local only)
Data Encrypted at Rest: ANO (iOS Keychain / Android Keystore)
Can Users Request Data Deletion: ANO (in-app button)
```

---

### 5.3 Srovnání požadavků iOS vs Android

| Požadavek | iOS (Apple) | Android (Google) |
|-----------|-------------|------------------|
| **Privacy Policy** | Povinná (URL in-app + web) | Povinná (URL in-app + web) |
| **Health Disclaimer** | Doporučené (v description) | Doporučené (v description) |
| **Data Safety/Nutrition Label** | Privacy Nutrition Label | Data Safety Section |
| **Medical Certification** | Ne (nejsme medical device) | Ne (nejsme medical device) |
| **Age Rating** | 12+ | Dospělí (Teen OK) |
| **Subscription Info** | V metadata + in-app | V metadata + in-app |

---

## 6. IMPLEMENTATION RECOMMENDATIONS (MVP)

### 6.1 Kde zobrazit Disclaimer

**1. První spuštění (Onboarding):**

```typescript
// Screens: OnboardingScreen.tsx

Screen 1: Vítejte v DeskFix
Screen 2: Co vás bolí? (výběr partií)
Screen 3: ⚠️ ZDRAVOTNÍ DISCLAIMER (full text)
  → Checkbox "Přečetl/a jsem a souhlasím"
  → Bez zaškrtnutí nelze pokračovat
Screen 4: Nastavení notifikací
Screen 5: Hotovo → Dashboard
```

**2. Nastavení (vždy přístupné):**

```
Nastavení > O aplikaci
├── Zdravotní upozornění (full text, read-only)
├── Ochrana osobních údajů (Privacy Policy)
└── Obchodní podmínky (ToS)
```

**3. Před každým cvičením (volitelné pro MVP):**

```
// V PlayerScreen před startem rutiny
"⚠️ Přestaňte cvičit, pokud pociťujete bolest."
[Rozumím] → Start
```

---

### 6.2 Jak implementovat "Smazání dat" (GDPR Right to Erasure)

**UI Flow:**

```
Nastavení > Soukromí a data > Smazat všechna data

Confirmation Dialog:
"Opravdu chcete smazat všechna data?
- Historie cvičení
- Nastavení
- Statistiky

Tato akce je nevratná."

[Zrušit] [Smazat vše]
```

**Technická implementace:**

```typescript
// utils/dataManagement.ts

export async function deleteAllUserData() {
  try {
    // 1. Smazat SQLite databázi (historie)
    await db.dropAllTables();

    // 2. Vymazat AsyncStorage (nastavení)
    await AsyncStorage.clear();

    // 3. Zrušit všechny naplánované notifikace
    await Notifications.cancelAllScheduledNotificationsAsync();

    // 4. Reset Zustand store
    useAppStore.getState().resetState();

    // 5. Přesměrování na onboarding
    router.replace('/onboarding');

    Alert.alert('Hotovo', 'Všechna data byla smazána.');
  } catch (error) {
    Alert.alert('Chyba', 'Nepodařilo se smazat data.');
  }
}
```

**Export dat (GDPR Data Portability):**

```typescript
export async function exportUserData() {
  const data = {
    settings: await AsyncStorage.getItem('userSettings'),
    history: await db.getAllHistory(),
    stats: await db.getStats(),
    exportDate: new Date().toISOString()
  };

  const json = JSON.stringify(data, null, 2);

  // Uložit do Downloads nebo sdílet přes Share API
  await Sharing.shareAsync({
    mimeType: 'application/json',
    uri: FileSystem.documentDirectory + 'deskfix_data.json',
    dialogTitle: 'Exportovat moje data'
  });
}
```

---

### 6.3 Analytics - Privacy-First Approach

**Doporučení pro MVP:**

1. **Bez analytics** v první verzi (nejjednodušší GDPR compliance)

2. **Pokud potřebujete analytiku:**

**Option A: Lokální analytics (100% GDPR compliant)**
```typescript
// Ukládat anonymní události lokálně, bez serveru
await db.logEvent('exercise_completed', { bodyPart: 'neck' });
// Použití pouze pro vnitřní statistiky v aplikaci
```

**Option B: Firebase Analytics s opt-in**
```typescript
// Onboarding
"Chcete nám pomoci zlepšit aplikaci sdílením anonymních dat o používání?"
[ ] Ano, souhlasím s anonymní analytkou
[Info] Co sdílíme: typy cviků, časy používání (NE zdravotní data)

// V kódu
if (userSettings.analyticsEnabled) {
  Analytics.logEvent('exercise_completed', { type: 'neck' });
}

// Nastavení
Toggle "Anonymní analytika" → zapnout/vypnout kdykoliv
```

**Co NESBÍRAT (health data sensitivity):**
- ❌ Subjektivní hodnocení bolesti (1-10)
- ❌ Konkrétní zdravotní potíže
- ❌ Frekvence cvičení svázaná s identifikátorem uživatele

**Co lze sbírat (anonymně):**
- ✅ Počet dokončených cviků (aggregate)
- ✅ Nejpoužívanější partie těla (aggregate)
- ✅ Retention rate
- ✅ Konverze free → pro

---

### 6.4 Notifikace a GDPR

**Expo Push Notifications - Co se děje:**

1. **Lokální notifikace** (používáme pro Hourly Nudge):
   - ✅ GDPR compliant (žádná data mimo zařízení)
   - Token zůstává na zařízení
   - Není potřeba souhlas (kromě iOS system prompt)

2. **Remote notifikace** (nepoužíváme v MVP):
   - ⚠️ Vyžaduje Expo Push Token odeslat na server
   - → Nutný souhlas v Privacy Policy

**Best practice:**
```typescript
// Při prvním zapnutí notifikací (iOS system prompt)
const { status } = await Notifications.requestPermissionsAsync();

if (status !== 'granted') {
  Alert.alert(
    'Notifikace zakázány',
    'Pro funkci Hourly Nudge povolte notifikace v nastavení.'
  );
}
```

**Nastavení:**
```
Hourly Nudge
[ ] Zapnuto
Pracovní doba: 09:00 - 17:00
Frekvence: Každou hodinu

[Info] Notifikace jsou pouze lokální a neopouštějí vaše zařízení.
```

---

### 6.5 In-App Purchases a GDPR

**Apple/Google zpracovává platby → jejich Privacy Policy:**

V Privacy Policy uvést:

```markdown
## Platby a předplatné

Pro zpracování plateb používáme Apple App Store / Google Play Store.
Při nákupu předplatného:

- DeskFix neukládá vaše platební údaje (karty, bankovní účty)
- Apple/Google zpracovává platbu podle svých podmínek
- DeskFix obdrží pouze informaci "uživatel má aktivní předplatné"
- Vaše transakční historie je dostupná v Apple/Google účtu

Pro refundaci kontaktujte Apple/Google podporu.
```

**V aplikaci:**
```
Nastavení > Předplatné
Stav: Pro - aktivní do 15. 1. 2026
Spravovat předplatné: [Otevře Apple/Google nastavení]
```

---

### 6.6 Checklist před spuštěním MVP

**Legal & Compliance:**
- [ ] Zdravotní disclaimer schválen právníkem (doporučeno)
- [ ] Privacy Policy publikována na webu + in-app
- [ ] Terms of Service publikovány na webu + in-app
- [ ] Disclaimer zobrazen při onboardingu (nelze přeskočit)
- [ ] Kategorie App Store: Health & Fitness (NE Medical)

**GDPR Implementation:**
- [ ] Tlačítko "Zobrazit moje data" funkční
- [ ] Tlačítko "Exportovat data" funkční (JSON export)
- [ ] Tlačítko "Smazat všechna data" funkční + potvrzení
- [ ] Privacy Policy verze 1.0 publikována
- [ ] Consent checkbox pro disclaimer v onboardingu

**App Store Metadata:**
- [ ] Privacy Policy URL vyplněná v App Store Connect
- [ ] Terms of Use URL vyplněná
- [ ] Data Safety / Privacy Nutrition Label vyplněna
- [ ] App Review Notes: "Nejsme medical device"
- [ ] Screenshot obsahující disclaimer (doporučeno)

**Technical:**
- [ ] SQLite data šifrována (iOS Keychain / Android Keystore)
- [ ] Žádná data odesílána na server (kromé IAP)
- [ ] Analytics opt-in implementován (pokud používáno)
- [ ] Lokální notifikace nezahrnují citlivá data

**Testing:**
- [ ] Test "Smazat všechna data" → ověřit, že vše je vymazáno
- [ ] Test export dat → ověřit, že JSON obsahuje všechny uživatelská data
- [ ] Test disclaimer flow → nelze aplikaci použít bez souhlasu

---

## 7. USEFUL TEMPLATES & TEXTS

### 7.1 Email template pro support (health-related)

```
Předmět: Zdravotní dotaz k DeskFix

Dobrý den,

Děkujeme za váš dotaz ohledně aplikace DeskFix.

⚠️ DŮLEŽITÉ: DeskFix není lékařský prostředek a neposkytujeme lékařské rady.

Pokud trpíte:
- Chronickou bolestí (delší než 6 týdnů)
- Akutním zraněním
- Neurologickými příznaky (brnění, necitlivost)
- Závažnou bolestí ovlivňující běžné aktivity

Důrazně doporučujeme konzultovat váš stav s lékařem nebo fyzioterapeutem.

Naše aplikace je určena pouze pro:
- Prevenci nepohodlí ze sedavého zaměstnání
- Obecnou úlevu od lehkého svalového napětí
- Zvýšení pohybové aktivity během práce

Pro konkrétní zdravotní doporučení prosím kontaktujte:
- Vašeho praktického lékaře
- Fyzioterapeuta
- Ortopeda

S pozdravem,
DeskFix Support Team
```

---

### 7.2 App Store rejection response (pokud odmítnou kvůli health claims)

```
Dear App Review Team,

Thank you for your feedback regarding DeskFix.

We would like to clarify that DeskFix is NOT a medical device and does NOT
provide medical advice, diagnosis, or treatment. The app is categorized as
Health & Fitness (not Medical) and serves as a wellness tool for office workers.

Compliance measures implemented:
1. Medical disclaimer shown during onboarding (mandatory acceptance)
2. Clear statement in App Description: "This is not medical advice"
3. Recommendation to consult healthcare provider before use
4. No medical claims (we use "relief", "prevention", "exercise" - not "treatment")
5. Privacy Policy available in-app and at [URL]

We have also updated the App Description to make the disclaimer more prominent.

Please let us know if any additional changes are required.

Best regards,
[Your name]
```

---

### 7.3 GDPR Request Response Template

```
Předmět: Žádost o výmaz osobních údajů

Dobrý den,

Vaše žádost o výmaz osobních údajů dle čl. 17 GDPR byla přijata.

Protože DeskFix ukládá všechna data POUZE lokálně na vašem zařízení:

1. Veškerá vaše data jsou uložena pouze ve vašem telefonu/tabletu
2. Neukládáme žádná data na našich serverech
3. Pro výmaz použijte funkci v aplikaci:
   → Nastavení > Soukromí a data > Smazat všechna data

Případně odinstalováním aplikace vymažete všechna data automaticky.

Pokud jste provedli nákup přes Apple/Google:
- Historie plateb je uložena u Apple/Google (ne u nás)
- Pro výmaz kontaktujte Apple/Google support

Pokud máte další dotazy, neváhejte nás kontaktovat.

S pozdravem,
DeskFix Privacy Team
privacy@deskfix.app
```

---

## 8. RISK ASSESSMENT & MITIGATION

### 8.1 Identifikované rizika

| Riziko | Pravděpodobnost | Dopad | Mitigace |
|--------|----------------|-------|----------|
| **Uživatel se zraní při cvičení** | Střední | Vysoký | Disclaimer + doporučení konzultace, jasné instrukce ve videích |
| **Zdravotní data uniknou** | Nízká (local-only) | Vysoký | Šifrování SQLite, žádná data na serveru |
| **GDPR non-compliance** | Nízká | Střední | Privacy Policy, právo na výmaz, transparentnost |
| **App Store rejection** | Střední | Střední | Jasný disclaimer, kategorie Health (ne Medical) |
| **Uživatel si myslí, že je to lékařská péče** | Střední | Vysoký | Opakovaný disclaimer, žádné medical claims v marketingu |

---

### 8.2 Red Flags - Co NEDĚLAT

**Marketing & Communication:**
- ❌ "DeskFix vyléčí vaši bolest zad"
- ❌ "Alternativa k fyzioterapii"
- ❌ "Diagnostikujeme vaše bolesti"
- ❌ "Léčba karpálního tunelu"

**Správně:**
- ✅ "DeskFix pomůže ulevit od napětí"
- ✅ "Prevence nepohodlí ze sezení"
- ✅ "Cvičení pro office workers"
- ✅ "Doplněk k péči od odborníka"

**Data Handling:**
- ❌ Posílat health data na server bez šifrování
- ❌ Sdílet data s třetími stranami (reklama)
- ❌ Ukládat data bez informování uživatele

**App Store:**
- ❌ Kategorie "Medical" (vyžaduje certifikace)
- ❌ Skrývat disclaimer
- ❌ Tvrzení o "klinicky testováno" bez důkazů

---

## 9. CONTACTS & RESOURCES

### 9.1 Užitečné kontakty

- **GDPR dotazy (ČR)**: Úřad pro ochranu osobních údajů (ÚOOU) - uoou.cz
- **Spotřebitelské spory**: Česká obchodní inspekce (ČOI) - coi.cz
- **Apple App Review**: developer.apple.com/contact/app-store
- **Google Play Support**: play.google.com/console/about/contact

### 9.2 Doporučené právní kontroly

**Před spuštěním (MVP):**
1. Právník zkontroluje disclaimer (optional, ale doporučeno)
2. Privacy Policy review (template lze použít, ale ověřit specifika firmy)

**Náklady:**
- Právní konzultace: ~5 000 - 15 000 Kč (jednorázově)
- Privacy Policy template: zdarma (použít tento dokument + upravit kontakty)

### 9.3 Další zdroje

- **GDPR compliance checker**: gdprchecklist.io
- **Apple Health Guidelines**: developer.apple.com/app-store/review/guidelines/#health-and-health-research
- **Google Health Policy**: support.google.com/googleplay/android-developer/answer/9878510
- **Medical Device Regulation (MDR)**: ec.europa.eu/health/md_sector/overview_en (pro ověření, že NEJSME medical device)

---

## 10. CHANGELOG & UPDATES

| Verze | Datum | Změny |
|-------|-------|-------|
| 1.0 | 24. 12. 2025 | Initial version pro MVP |

**Doporučená frekvence review:** Každých 6 měsíců nebo při změně legislativy (GDPR updates)

---

## DISCLAIMER TOHOTO DOKUMENTU

⚠️ Tento dokument je šablona pro účely MVP compliance a nenahrazuje právní
poradenství. Před spuštěním aplikace doporučujeme konzultaci s právníkem
specializujícím se na GDPR a zdravotnické technologie.

Autor dokumentu nenese odpovědnost za případné právní důsledky použití
těchto šablon bez odborné revize.

---

**Připravil:** Security Auditor & Compliance Expert
**Verze:** 1.0 MVP
**Platnost:** 24. prosince 2025
**Kontakt pro otázky:** [Vaše kontaktní údaje]
