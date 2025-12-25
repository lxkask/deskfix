# DeskFix - Compliance Checklist (Rychlá kontrola před spuštěním)

## ✅ PRE-LAUNCH COMPLIANCE CHECKLIST

### 📋 PRÁVNÍ DOKUMENTY

| Úkol | Status | Poznámky |
|------|--------|----------|
| ☐ Zdravotní disclaimer napsán v češtině | | Min. 1500 znaků, jasný text |
| ☐ Privacy Policy napsána (CZ + EN) | | Viz šablona v SECURITY_COMPLIANCE.md |
| ☐ Terms of Service napsány (CZ + EN) | | Zahrnout freemium model |
| ☐ Dokumenty publikovány na webu | | URL: _________________ |
| ☐ Privacy Policy URL pro App Store | | URL: _________________ |
| ☐ ToS URL pro App Store | | URL: _________________ |
| ☐ Právník zkontroloval (optional) | | Doporučeno, ale ne povinné pro MVP |

---

### 🔧 IN-APP IMPLEMENTACE

#### Onboarding
| Úkol | Status | Soubor |
|------|--------|--------|
| ☐ Disclaimer screen vytvořen | | `app/(onboarding)/disclaimer.tsx` |
| ☐ Nelze přeskočit disclaimer | | Must scroll to bottom + checkbox |
| ☐ Checkbox "Souhlasím s disclaimerem" | | Povinný |
| ☐ Checkbox "Souhlasím s Privacy Policy" | | Povinný |
| ☐ Link na Privacy Policy funguje | | In-app webview nebo browser |
| ☐ Data uložena do AsyncStorage | | `disclaimer_accepted: true` |

#### Nastavení - Soukromí
| Úkol | Status | Soubor |
|------|--------|--------|
| ☐ Screen "Soukromí a data" vytvořen | | `app/(tabs)/settings/privacy.tsx` |
| ☐ Tlačítko "Zobrazit moje data" | | Read-only view všech dat |
| ☐ Tlačítko "Exportovat data" | | JSON export přes Share API |
| ☐ Tlačítko "Smazat historii" | | Potvrzovací dialog |
| ☐ Tlačítko "Smazat všechna data" | | Destruktivní akce s potvrzením |
| ☐ Link na Privacy Policy | | In-app nebo browser |
| ☐ Link na Terms of Service | | In-app nebo browser |
| ☐ Link na Zdravotní upozornění | | Read-only text |
| ☐ Verze Privacy Policy zobrazena | | Např. "v1.0" |

#### Data Management Utils
| Úkol | Status | Soubor |
|------|--------|--------|
| ☐ `deleteAllUserData()` implementována | | `utils/dataManagement.ts` |
| ☐ Vymaže SQLite databázi | | `db.dropAllTables()` |
| ☐ Vymaže AsyncStorage | | `AsyncStorage.clear()` |
| ☐ Zruší notifikace | | `cancelAllScheduledNotifications()` |
| ☐ Resetuje Zustand store | | `useAppStore.getState().resetState()` |
| ☐ `exportUserData()` implementována | | JSON + Share API |
| ☐ `getUserDataSummary()` implementována | | Pro "Zobrazit data" |

---

### 🔒 DATA PROTECTION

| Úkol | Status | Implementace |
|------|--------|--------------|
| ☐ SQLite databáze šifrována | | iOS Keychain / Android Keystore |
| ☐ AsyncStorage používá šifrování | | expo-secure-store pro citlivá data |
| ☐ Žádná health data na server | | 100% local-first |
| ☐ Notifikace bez citlivých dat | | Text: "Čas na cvičení" (ne bolest) |
| ☐ Export zahrnuje VŠE | | Settings + historie + stats |
| ☐ Smazání vymaže VŠE | | Včetně cache a temp files |

---

### 📱 APP STORE METADATA

#### Apple App Store Connect
| Úkol | Status | Hodnota |
|------|--------|---------|
| ☐ Kategorie: Health & Fitness | | NE Medical! |
| ☐ Věková hranice: 12+ | | Bez medical content 17+ |
| ☐ Privacy Policy URL vyplněna | | https://deskfix.app/privacy |
| ☐ Terms of Use URL vyplněna | | https://deskfix.app/terms |
| ☐ Privacy Nutrition Label vyplněn | | Health data: collected locally |
| ☐ Disclaimer v App Description | | ⚠️ Not medical advice |
| ☐ App Review Notes napsány | | "NOT a medical device" |
| ☐ Screenshot s disclaimerem | | Optional, ale doporučeno |

#### Google Play Console
| Úkol | Status | Hodnota |
|------|--------|---------|
| ☐ Kategorie: Health & Fitness | | NE Medical! |
| ☐ Věková skupina: Dospělí | | 12+ OK |
| ☐ Privacy Policy URL vyplněna | | https://deskfix.app/privacy |
| ☐ Data Safety section vyplněna | | Health data: local only |
| ☐ "Can delete data": Yes | | In-app settings |
| ☐ "Data encrypted": Yes | | At rest (Keystore) |
| ☐ Disclaimer v Play Description | | ⚠️ Not medical advice |

---

### 🧪 TESTING (KRITICKÉ!)

#### Disclaimer Flow
| Test | Status | Expected Result |
|------|--------|-----------------|
| ☐ První spuštění → disclaimer | | Objeví se onboarding |
| ☐ Nelze skip bez checkboxu | | Tlačítko disabled |
| ☐ Nelze pokračovat bez scroll | | Musí scrollovat na konec |
| ☐ Po souhlasu → dashboard | | Ukáže se body map |
| ☐ Re-launch → bez disclaimeru | | Souhlas uložen v AsyncStorage |

#### GDPR Features
| Test | Status | Expected Result |
|------|--------|-----------------|
| ☐ "Zobrazit data" → všechna data | | Nastavení, historie, stats |
| ☐ "Exportovat" → JSON stažen | | Validní JSON, všechna data |
| ☐ "Smazat historii" → vymazáno | | Historie prázdná, nastavení zůstává |
| ☐ "Smazat vše" → úplné vymazání | | SQLite + AsyncStorage prázdné |
| ☐ Po "Smazat vše" → onboarding | | Vrátí se na první spuštění |
| ☐ Odinstalace + reinstalace | | Čistá aplikace (žádná stará data) |

#### Data Safety
| Test | Status | Expected Result |
|------|--------|-----------------|
| ☐ Network monitor: žádný traffic | | Kromě IAP validace |
| ☐ SQLite file šifrován | | iOS: Keychain, Android: Keystore |
| ☐ Export obsahuje citlivá data | | Pain levels, notes, atd. |
| ☐ Notifikace text není citlivý | | "Čas na cvičení", ne "Bolí vás krk?" |

#### Analytics (pokud implementováno)
| Test | Status | Expected Result |
|------|--------|-----------------|
| ☐ Default: analytics OFF | | Opt-in required |
| ☐ Toggle analytics → zapne/vypne | | Events logují jen když ON |
| ☐ Žádné PII v events | | Bez email, jména, health notes |
| ☐ Revoke consent → stop logging | | Okamžitě přestane |

---

### 📧 SUPPORT READINESS

| Úkol | Status | Šablona |
|------|--------|---------|
| ☐ Email privacy@deskfix.app aktivní | | Gmail nebo custom domain |
| ☐ Email support@deskfix.app aktivní | | Pro obecné dotazy |
| ☐ Health query template připraven | | Viz COMPLIANCE_IMPLEMENTATION.md |
| ☐ GDPR deletion template připraven | | "Data jsou lokální, jak smazat" |
| ☐ Data export template připraven | | Návod na in-app export |
| ☐ Refund policy jasná | | "Kontaktujte Apple/Google" |

---

### 🎯 APP REVIEW SUBMISSION

#### Apple App Store
| Úkol | Status |
|------|--------|
| ☐ App Review Notes vyplněny | |
| ☐ Zdůraznit: "NOT medical device" | |
| ☐ Test account vytvořen (optional) | |
| ☐ Screenshots neobsahují medical claims | |
| ☐ Keywords bez "therapy", "treatment" | |
| ☐ Description jasný disclaimer | |

#### Google Play
| Úkol | Status |
|------|--------|
| ☐ Review Notes vyplněny | |
| ☐ Data Safety kompletně vyplněná | |
| ☐ Store listing bez medical claims | |
| ☐ Screenshots s disclaimerem (optional) | |

---

### 🚨 RED FLAGS - CO NEDĚLAT

#### ❌ Marketing / Communication
- [ ] "DeskFix vyléčí vaši bolest"
- [ ] "Alternativa k fyzioterapii"
- [ ] "Diagnostikujeme vaše bolesti"
- [ ] "Léčba karpálního tunelu"
- [ ] "Klinicky testováno" (bez důkazů)

#### ✅ Správně
- [ ] "DeskFix pomůže ulevit od napětí"
- [ ] "Prevence nepohodlí ze sezení"
- [ ] "Cvičení pro office workers"
- [ ] "Doplněk k péči od odborníka"

#### ❌ Data Handling
- [ ] Posílat health data na server bez consent
- [ ] Sdílet data s třetími stranami (ads)
- [ ] Ukládat data bez informování uživatele
- [ ] Analytics bez opt-in

#### ❌ App Store
- [ ] Kategorie "Medical" (vyžaduje certifikace!)
- [ ] Skrývat disclaimer
- [ ] Medical claims v keywords
- [ ] Screenshot s "cures pain"

---

### 📊 METRICS (Pro monitoring compliance)

| Metrika | Cíl | Kde sledovat |
|---------|-----|--------------|
| Disclaimer acceptance rate | >95% | Analytics (onboarding completion) |
| GDPR data deletion requests | <1% měsíčně | Support email |
| App Store rejections (health) | 0 | App Store Connect |
| Privacy Policy views | Track | In-app analytics |
| "Smazat data" usage | Monitor | Analytics events |

---

### 🗓️ POST-LAUNCH MAINTENANCE

| Úkol | Frekvence | Datum posledního |
|------|-----------|------------------|
| ☐ Review Privacy Policy | Každých 6 měsíců | _____________ |
| ☐ Update disclaimer (pokud legislativa) | Podle potřeby | _____________ |
| ☐ Check GDPR compliance | Ročně | _____________ |
| ☐ Audit data storage | Před každým major update | _____________ |
| ☐ Review App Store guidelines | Před každým update | _____________ |
| ☐ Test GDPR features | Před každým release | _____________ |

---

### 📞 EMERGENCY CONTACTS

```
GDPR Úřad (ČR): +420 234 665 111 | uoou.cz
Apple Developer Support: developer.apple.com/contact
Google Play Support: play.google.com/console/about/contact
Právník (pokud máte): _______________________
```

---

## QUICK DECISION TREE

### "Jsme medical device?"

```
Poskytujeme diagnostiku? → NE
Poskytujeme léčbu? → NE
Vyžaduje předpis lékaře? → NE
Regulováno FDA/MDR? → NE

→ NEJSME medical device ✓
→ Kategorie: Health & Fitness
→ Disclaimer povinný!
```

### "Potřebujeme consent pro data?"

```
Data zůstávají na zařízení? → ANO
→ Legitimní zájem (čl. 6 odst. 1 písm. f GDPR)
→ Consent NENÍ povinný pro funkčnost
→ Ale musíme umožnit výmaz/export

Data posíláme na server? → NE (v MVP)
→ Pokud ano v budoucnu → Consent POVINNÝ

Analytics? → Pokud implementováno
→ Consent POVINNÝ (opt-in)
```

### "Můžeme použít slovo X v marketingu?"

```
"Léčba" → ❌ NE
"Terapie" → ❌ NE
"Diagnóza" → ❌ NE
"Kurací" → ❌ NE

"Úleva" → ✅ ANO
"Prevence" → ✅ ANO
"Cvičení" → ✅ ANO
"Wellness" → ✅ ANO
```

---

## FINAL PRE-LAUNCH CHECK

```
☐ Všechny checkboxy výše zaškrtnuty
☐ Disclaimer nelze přeskočit (tested)
☐ GDPR funkce fungují (tested)
☐ Privacy Policy online a funkční
☐ App Store metadata vyplněna
☐ Support email ready
☐ Legal docs reviewed (nebo acknowledged risk)

→ READY TO SUBMIT ✅
```

---

**Verze dokumentu:** 1.0
**Poslední update:** 24. prosince 2025
**Další review:** Červen 2026

---

## POZNÁMKY

- Tento checklist je pro **MVP launch**
- Pro production s analytics/server features → extended checklist
- Při změně funkcí → re-review compliance
- Při legislativních změnách → update Privacy Policy

**Disclaimer:** Tento checklist nenahrazuje právní poradenství. Pro produkční
launch doporučujeme konzultaci s právníkem.
