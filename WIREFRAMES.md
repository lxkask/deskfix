
# DeskFix - Detailní Wireframe Popisy

## Design Principy

- **Velké dotykové cíle**: Minimální velikost tlačítek 48x48dp (ideálně 56x56dp) kvůli možné bolesti zápěstí/karpálního tunelu
- **Uklidňující barvy**: Modrá (#4A90E2), zelená (#7ED321), pastelové tóny. Červená pouze pro indikátory bolesti
- **Diskrétní v kanceláři**: Žádné hlasité animace, čistý minimalistický design
- **Frictionless UX**: Bolest → 3 kliknutí → cvičení

---

## 1. BODY MAP HOME (Domovská obrazovka s mapou těla)

### Layout Structure

```
┌─────────────────────────────────┐
│  [Profil]    DeskFix    [⚙️]   │  <- Header (60dp výška)
├─────────────────────────────────┤
│                                  │
│   Dobrý den, [Jméno]! 👋       │  <- Personalizované pozdravení (32dp padding)
│   Kde vás dnes bolí?            │     (font: 24sp, medium weight)
│                                  │
│   ┌─────────────────────────┐  │
│   │                          │  │
│   │    [Vizualizace těla]   │  │  <- Interaktivní mapa těla
│   │                          │  │     (viz detaily níže)
│   │      🧍 Silueta          │  │
│   │                          │  │
│   └─────────────────────────┘  │
│                                  │
│   RYCHLÉ AKCE:                  │  <- Sekce rychlých akcí
│   ┌──────────┐  ┌──────────┐  │
│   │ 🎯 Dnešní│  │ 📊 Pokrok│  │  <- Velké karty (min 120dp výška)
│   │  rutina  │  │          │  │
│   └──────────┘  └──────────┘  │
│                                  │
│   POSLEDNÍ ÚLEVA:               │  <- Historie
│   • Krk - před 2 hodinami       │
│                                  │
├─────────────────────────────────┤
│ [🏠] [📚] [⏰] [👤]            │  <- Bottom Navigation (64dp)
└─────────────────────────────────┘
```

### Vizualizace Těla (Body Map)

**Přístup: Hybridní - Ilustrace + Seznam**

**Hlavní View (200dp výška):**
- Stylizovaná silueta těla (frontální pohled)
- Interaktivní oblasti s popisky:
  - Krk (neck)
  - Ramena (shoulders) - obě strany
  - Horní záda (upper_back)
  - Dolní záda (lower_back)
  - Zápěstí (wrists) - obě strany
  - Kyčle (hips)
  - Oči (eyes) - ikona vedle hlavy

**Interaktivní stavy:**
- **Default**: Oblast v pastelové modré (#E3F2FD), outline 2dp
- **Hover/Press**: Zvětšení na 105%, světle zelená (#F1F8E9)
- **Aktivní bolest**: Červená gradient (#FFCDD2 → #EF5350), pulzující animace (subtilní, 1s cyklus)
- **Nedávno cvičeno**: Zelená s checkmark badge (#C8E6C9)

**Indikátory bolesti:**
- Každá oblast obsahuje malý badge s číslem 1-10 (škála bolesti)
- Uživatel může nastavit při dlouhém stisku
- Vizuální intensita barvy odpovídá úrovni bolesti

**Accessibility:**
- Oblasti mají min 48x48dp touch target
- Text labels viditelné (ne jen ikony)
- VoiceOver popisky: "Krk - aktuální bolest 7 z 10"

### Seznam pod mapou (collapsible)

```
┌─────────────────────────────────┐
│ 📍 VŠECHNY OBLASTI              │  <- Tappable header
├─────────────────────────────────┤
│ [🔴●●●] Krk              [>]   │  <- Řádek s visualizací bolesti
│ [🟡●●○] Dolní záda       [>]   │     3 tečky = úroveň bolesti (high/med/low)
│ [🟢●○○] Zápěstí         [>]   │
│ [⚪○○○] Ramena          [>]   │  <- Žádná bolest = šedá
└─────────────────────────────────┘
```

### Quick Access Elements

**Dnešní rutina karta:**
- Zobrazuje doporučenou rutinu na základě:
  - Nejvyšší aktuální bolesti
  - Denní doby (ráno = aktivace, večer = relaxace)
  - Historie (co fungovalo minule)
- CTA tlačítko: "Začít 3 min" (56dp výška, zelené)

**Pokrok karta:**
- Dnešní streak
- Počet dokončených cviků dnes
- Mini graf týdenního pokroku

### Bottom Navigation (Tab Bar)

```
┌──────┬──────┬──────┬──────┐
│ 🏠   │ 📚   │ ⏰   │ 👤   │
│ Domů │Cviky │Budík │ Já   │
└──────┴──────┴──────┴──────┘
```

- Ikony: 24x24dp, padding 8dp, celkem 64dp výška
- Active state: Primary color (#4A90E2), bold label
- Inactive: Grey (#757575), regular weight
- Accessibility: Min 48x48dp touch target (expanding padding)

---

## 2. ROUTINE PREVIEW (Náhled rutiny)

### Layout Structure

```
┌─────────────────────────────────┐
│ [←]  Rychlá úleva - Krk    [♡] │  <- Header bar (64dp)
├─────────────────────────────────┤
│                                  │
│ ┌─────────────────────────────┐ │
│ │                              │ │
│ │   [Thumbnail / Video]       │ │  <- Preview obrázek (16:9, 240dp)
│ │                              │ │     (Loop GIF prvního cviku)
│ └─────────────────────────────┘ │
│                                  │
│ ⏱️  3 minuty  │  💪 Začátečník  │  <- Metadata bar
│ 🎯 Krk, Ramena                  │
│                                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  <- Divider
│                                  │
│ O TÉTO RUTINĚ:                  │
│ Série 3 cviků pro okamžitou     │  <- Popis (16sp, line height 24sp)
│ úlevu od bolesti krku. Ideální  │     Max 3 řádky
│ po dlouhém sezení u počítače.   │
│                                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                  │
│ CVIKY V RUTINĚ (3):             │  <- Seznam cviků
│                                  │
│ ┌─────────────────────────────┐ │
│ │ 1. [📷] Protažení šíje      │ │  <- Exercise card (72dp výška)
│ │    60s │ Začátečník          │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ 2. [📷] Krouživé pohyby     │ │
│ │    45s │ Začátečník          │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ 3. [📷] Uvolnění ramen      │ │
│ │    60s │ Začátečník          │ │
│ └─────────────────────────────┘ │
│                                  │
│                                  │
│ ┌─────────────────────────────┐ │
│ │   🎬 ZAČÍT RUTINU (3 min)   │ │  <- Primary CTA (64dp výška)
│ └─────────────────────────────┘ │  <- Sticky na spodku (nebo floating)
│                                  │
└─────────────────────────────────┘
```

### Header Information

**Levý horní roh:**
- Zpět šipka (48x48dp touch target)
- Název rutiny (18sp, bold)

**Pravý horní roh:**
- Srdíčko ikona pro oblíbené (48x48dp)
- Animace při tapnutí (scale + color change)

### Duration & Difficulty Indicators

**Metadata bar (horizontální, centered icons + text):**
- ⏱️ Ikona + "3 minuty" (modrá barva)
- 💪 Ikona + "Začátečník/Středně pokročilý" (zelená/oranžová)
- 🎯 Ikona + "Cílové partie" (šedá)

**Visual style:**
- Semi-bold font (16sp)
- Icons 20x20dp
- 16dp spacing mezi elementy
- Background: Light grey card (#F5F5F5), 8dp padding

### Exercise List Preview

**Každá karta obsahuje:**
- Pořadové číslo (velké, 24sp, primary color)
- Thumbnail 64x64dp (zaoblené rohy 8dp)
- Název cviku (16sp, medium weight)
- Metadata: Doba trvání | Obtížnost
- Tap anywhere → detail cviku (optional preview)

**Interaction:**
- Tap na kartu → rozbalí detail s plným popisem
- Swipe → možnost odstranit z rutiny (Pro verze)

### Start Button Placement

**Design:**
- Fixed na spodku obrazovky (nebo floating nad bottom nav)
- Výška: 64dp (velký touch target)
- Šířka: Plná šířka minus 32dp (16dp margin each side)
- Primary color gradient (#4A90E2 → #357ABD)
- White text, 18sp, bold
- Drop shadow: 4dp elevation
- Icon play button na levé straně textu

**States:**
- Default: Gradient + shadow
- Pressed: Darker shade, scale 98%
- Loading: Spinner icon místo play
- Disabled (locked content): Grey + 🔒 ikona

**Accessibility:**
- Clear label "Začít rutinu - 3 minuty"
- Haptic feedback při tapnutí
- VoiceOver: "Tlačítko - Začít rutinu, doba trvání 3 minuty"

---

## 3. ACTIVE PLAYER (Aktivní přehrávač cvičení)

### Layout Structure

```
┌─────────────────────────────────┐
│ [X]           1 / 3        [🔇] │  <- Slim header (48dp)
│                                  │     Progress indicator
├─────────────────────────────────┤
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  <- Progress bar (4dp výška)
│                                  │     (60% zelená, 40% šedá)
│                                  │
│                                  │
│ ┌─────────────────────────────┐ │
│ │                              │ │
│ │                              │ │
│ │   [VIDEO / ANIMATION]       │ │  <- Main video area
│ │                              │ │     (Full width, 16:9 nebo 4:3)
│ │       Loop cyklu             │ │     Min 300dp výška
│ │                              │ │
│ │                              │ │
│ └─────────────────────────────┘ │
│                                  │
│        ⏰ 00:35                  │  <- Countdown timer
│                                  │     (Velký, 48sp, bold)
│                                  │
│  Protažení šíje do stran        │  <- Exercise name (20sp)
│                                  │
│ ┌─────────────────────────────┐ │
│ │ Pomalu nakloňte hlavu k     │ │  <- Instructions card
│ │ rameni. Zadržte 15 sekund.  │ │     (Scrollable pokud dlouhé)
│ │ Opakujte na druhou stranu.  │ │     Background: #F5F5F5
│ └─────────────────────────────┘ │     Padding: 16dp
│                                  │
│                                  │
│   ┌─────┐  ┌─────┐  ┌─────┐   │  <- Control buttons
│   │ ⏮️  │  │ ⏸️  │  │ ⏭️  │   │     (Velké, 64x64dp každé)
│   │Zpět │  │Pauza│  │Další│   │
│   └─────┘  └─────┘  └─────┘   │
│                                  │
│        [  UKONČIT  ]            │  <- Stop button (secondary)
│                                  │     (48dp výška, outline style)
└─────────────────────────────────┘
```

### Video/Animation Area

**Specifikace:**
- Aspect ratio: 16:9 preferovaný (fallback 4:3)
- Loop playback: Seamless, auto-restart
- No controls overlay (čisté)
- Background: Černá nebo branded color
- Loading state: Skeleton screen s pulzující animací

**Accessibility:**
- Video popisek pro screen reader
- Možnost vypnout video (jen instrukce) pro motion sensitivity

### Timer Display (Countdown)

**Design:**
- Centrovaný pod videem
- Font: Monowidth (lepší čitelnost), 48sp
- Color:
  - 30+ sekund: Zelená (#7ED321)
  - 10-29 sekund: Oranžová (#F5A623)
  - 0-9 sekund: Červená (#E74C3C)
- Animace: Pulzující při posledních 5 sekundách
- Formát: MM:SS (např. 00:35)

**Haptic feedback:**
- Při přechodu na poslední 10 sekund: Light haptic
- Každou sekundu v posledních 5: Medium haptic (pokud není office mode)
- Konec cviku: Heavy haptic pulse

### Progress Indicator

**Top bar:**
- Text: "1 / 3" (aktuální cvik / celkem)
- Font: 16sp, medium
- Position: Centered v header
- Color: Primary (#4A90E2)

**Progress bar:**
- Plná šířka pod headerem
- Výška: 4dp
- Completed: Zelená (#7ED321)
- Remaining: Světle šedá (#E0E0E0)
- Animated transition mezi cviky (300ms ease)

**Visual cue pro silent mode:**
- Ikona zvuku vpravo nahoře
- 🔇 = Silent mode ON (office mode)
- 🔊 = Zvuk ON
- Tap to toggle

### Control Buttons

**Layout:**
- 3 tlačítka v řadě, equally spaced
- Velikost: 64x64dp (velký touch target)
- Style: Circular, material design elevation
- Spacing: 24dp mezi tlačítky

**Tlačítka:**
1. **⏮️ Zpět (Previous):**
   - Skočí na předchozí cvik
   - Disabled pokud je první cvik (30% opacity)

2. **⏸️ Pauza (Pause) / ▶️ Play:**
   - Toggle stav
   - Icon swap animace
   - Timer zamrzne při pauze

3. **⏭️ Další (Skip):**
   - Přeskočí na další cvik
   - Poslední cvik → Summary screen

**Accessibility:**
- Large touch targets (minimálně 64x64dp)
- Clear labels
- Visual + haptic feedback
- High contrast icons

### Exercise Name & Instructions

**Název cviku:**
- Font: 20sp, semi-bold
- Color: Dark grey (#212121)
- Centered
- Max 2 řádky (ellipsis)

**Instrukce karta:**
- Background: Light grey (#F5F5F5)
- Padding: 16dp
- Border radius: 8dp
- Font: 16sp, regular
- Line height: 24sp (dobré čtení)
- Max výška: 120dp, scrollable pokud delší
- Icon: 💡 na začátku (optional)

### Silent Mode Visual Cues

**Indikátory při vypnutém zvuku:**
1. **Timer color shift:**
   - Barevné přechody (zelená→oranžová→červená) jsou výraznější

2. **Visual countdown:**
   - Circular progress ring kolem timeru

3. **Flash notifications:**
   - Krátký flash celé obrazovky při přechodu mezi cviky (subtle white flash, 200ms)

4. **Vibration pattern:**
   - Office mode: Light vibrace při přechodu
   - Normal mode: Medium vibrace + optional sound

5. **Next exercise preview:**
   - Poslední 5 sekund: Malý preview thumbnail dalšího cviku fade in dole
   - Text: "Další: [název cviku]"

---

## 4. PREVENTION SETTINGS (Nastavení preventivních připomínek)

### Layout Structure

```
┌─────────────────────────────────┐
│ [←]  Hodinové připomínky        │  <- Header (56dp)
├─────────────────────────────────┤
│                                  │
│ ┌─────────────────────────────┐ │
│ │ 💡 Pravidelné micro-cviky   │ │  <- Info card (collapsible)
│ │ pomáhají předcházet bolesti │ │
│ │ a udržují vás aktivní       │ │
│ └─────────────────────────────┘ │
│                                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                  │
│ AKTIVACE                         │  <- Section header
│                                  │
│ ┌─────────────────────────────┐ │
│ │ Povolit připomínky     [🟢] │ │  <- Master toggle (64dp výška)
│ └─────────────────────────────┘ │     Switch vpravo, large (48dp)
│                                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                  │
│ PRACOVNÍ DOBA                    │  <- Section (disabled pokud OFF)
│                                  │
│ ┌─────────────────────────────┐ │
│ │ Začátek pracovní doby       │ │
│ │                              │ │
│ │      [  09:00  ] [⌄]        │ │  <- Time picker (56dp výška)
│ └─────────────────────────────┘ │     Tappable → wheel picker
│                                  │
│ ┌─────────────────────────────┐ │
│ │ Konec pracovní doby         │ │
│ │                              │ │
│ │      [  17:00  ] [⌄]        │ │
│ └─────────────────────────────┘ │
│                                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                  │
│ FREKVENCE                        │
│                                  │
│ ┌─────────────────────────────┐ │
│ │ ( ) Každých 30 minut        │ │  <- Radio buttons (56dp každý)
│ │ (●) Každou hodinu ✓         │ │     Large touch targets
│ │ ( ) Každé 2 hodiny          │ │
│ └─────────────────────────────┘ │
│                                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                  │
│ DALŠÍ NASTAVENÍ                  │
│                                  │
│ ┌─────────────────────────────┐ │
│ │ Office Mode            [🟢] │ │  <- Toggle switch
│ │ (pouze vibrace, bez zvuku)  │ │     Subtitle 14sp, grey
│ └─────────────────────────────┘ │
│                                  │
│ ┌─────────────────────────────┐ │
│ │ Připomínat o víkendu   [⚪] │ │
│ └─────────────────────────────┘ │
│                                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                  │
│ NÁHLED                           │
│                                  │
│ ┌─────────────────────────────┐ │
│ │ 📱 Další připomínka:        │ │  <- Preview card (rounded)
│ │                              │ │     Background: #E3F2FD
│ │    🕐 14:00 (za 23 minut)   │ │     Icon + time
│ │                              │ │
│ │    "Protažení zápěstí"      │ │     Exercise name
│ └─────────────────────────────┘ │
│                                  │
│                                  │
│ ┌─────────────────────────────┐ │
│ │     ULOŽIT NASTAVENÍ        │ │  <- Save button (optional)
│ └─────────────────────────────┘ │     Pokud není auto-save
│                                  │
└─────────────────────────────────┘
```

### Work Hours Picker

**Design:**
- Dva velké input fieldy (56dp výška každý)
- Label nad fieldem (14sp, grey)
- Aktuální čas zobrazen ve fieldu (20sp, bold)
- Dropdown ikona vpravo (⌄)

**Interaction:**
- Tap → otevře native time picker wheel (iOS) nebo dialog (Android)
- Default hodnoty: 09:00 - 17:00
- Validace: End time musí být po Start time
- Error state: Červený outline + helper text

**Accessibility:**
- Clear labels "Začátek pracovní doby" / "Konec pracovní doby"
- VoiceOver čte aktuální hodnotu
- Min 48dp touch target

### Frequency Setting

**Radio button skupina:**
- 3 možnosti vertikálně stacknuté
- Každá řádka: 56dp výška
- Radio button vlevo (24dp průměr)
- Text vpravo (16sp, medium)
- Celá řádka je tappable area

**Možnosti:**
- ⏱️ Každých 30 minut (Pro feature - 🔒 pokud Free)
- ⏱️ Každou hodinu ✓ (Default, Free)
- ⏱️ Každé 2 hodiny

**Visual feedback:**
- Selected: Primary color fill + checkmark
- Hover: Light grey background
- Disabled (Pro only): Grey + lock icon

### Toggle Switches

**Master toggle design:**
- Velký switch (48x28dp)
- Label vlevo (18sp, semi-bold)
- ON: Zelená (#7ED321)
- OFF: Šedá (#BDBDBD)
- Smooth animation (300ms)

**Cascade behavior:**
- Když Master OFF → všechna ostatní nastavení disabled (30% opacity)
- Clear visual hierarchy

**Office Mode toggle:**
- Subtitle pod label: "(pouze vibrace, bez zvuku)"
- Font: 14sp, grey (#757575)
- Icon: 🔇 vlevo od textu

**Víkendový režim toggle:**
- Subtitle: "Připomínky i v sobotu a neděli"
- Default: OFF (většina lidí nechce)

### Preview of Next Notification

**Design:**
- Card s rounded corners (12dp)
- Background: Light blue (#E3F2FD) pro info card
- Padding: 16dp
- Border: 1dp solid #90CAF9

**Content:**
- Header: "📱 Další připomínka:" (14sp, medium)
- Time: "🕐 14:00 (za 23 minut)" (18sp, bold)
  - Relative time v závorce (lidsky čitelné)
- Exercise preview: "Protažení zápěstí" (16sp, regular)
  - Thumbnail 48x48dp (optional)

**Live update:**
- Countdown se aktualizuje každou minutu
- Název cviku se mění (rotace podle algoritmu)

**Empty state:**
- Pokud připomínky OFF: "Zapněte připomínky pro náhled"
- Pokud mimo pracovní dobu: "Žádné připomínky dnes naplánované"

---

## 5. PAYWALL (Předplatné obrazovka)

### Layout Structure

```
┌─────────────────────────────────┐
│              [X]                 │  <- Close button (48x48dp) top-right
│                                  │
│     🚀                           │  <- Hero icon (64dp)
│                                  │
│   Odemkněte plný potenciál      │  <- Headline (24sp, bold)
│        DeskFix Pro              │     Centered
│                                  │
│  Investujte do zdravé budouc-   │  <- Subheadline (16sp, regular)
│  nosti bez bolesti               │     Max 2 řádky
│                                  │
├─────────────────────────────────┤
│                                  │
│ ✅ Všechny partie těla          │  <- Feature list (scrollable)
│    (ne jen Krk a Zápěstí)       │     Každá 56dp výška
│                                  │
│ ✅ Hodinové preventivní         │
│    připomínky                    │
│                                  │
│ ✅ Vlastní rutiny               │
│    (vytvoř si svou)              │
│                                  │
│ ✅ Detailní statistiky          │
│    a pokrok                      │
│                                  │
│ ✅ Offline režim                │
│    (bez internetu)               │
│                                  │
│ ✅ Prioritní podpora            │
│                                  │
├─────────────────────────────────┤
│                                  │
│ VYBERTE PLÁN:                    │  <- Plan selector section
│                                  │
│ ┌─────────────────────────────┐ │
│ │  💎 ROK                      │ │  <- Recommended plan (highlighted)
│ │                              │ │     Border: 2dp primary color
│ │  990 Kč / rok               │ │     Background: #E3F2FD
│ │  (82 Kč/měsíc)              │ │
│ │                              │ │
│ │  🏆 Ušetříte 340 Kč         │ │  <- Savings badge
│ └─────────────────────────────┘ │
│                                  │
│ ┌─────────────────────────────┐ │
│ │  📅 MĚSÍC                    │ │  <- Alternative plan
│ │                              │ │     Border: 1dp grey
│ │  99 Kč / měsíc              │ │
│ └─────────────────────────────┘ │
│                                  │
│ ┌─────────────────────────────┐ │
│ │  ⚡ LIFETIME                 │ │  <- Lifetime option (if offered)
│ │                              │ │     Background: Gold gradient
│ │  2 490 Kč                   │ │
│ │  jednorázově                 │ │
│ └─────────────────────────────┘ │
│                                  │
│ ┌─────────────────────────────┐ │
│ │  🎁 POKRAČOVAT S PRO        │ │  <- Primary CTA (64dp výška)
│ └─────────────────────────────┘ │     Gradient button, bold
│                                  │
│   7 dní zdarma, pak 990 Kč/rok  │  <- Trial info (14sp, centered)
│   Zrušte kdykoliv               │     Grey text
│                                  │
│   [Obnovit nákupy]              │  <- Restore purchases link
│                                  │     (14sp, underline, tappable)
│                                  │
│   Podmínky | Soukromí           │  <- Legal links (12sp)
│                                  │
└─────────────────────────────────┘
```

### Value Proposition

**Hero section:**
- Icon: 🚀 nebo custom Pro logo (64x64dp)
- Headline: "Odemkněte plný potenciál DeskFix Pro"
  - Font: 24sp, bold
  - Color: Dark grey (#212121)
  - Centered

- Subheadline: "Investujte do zdravé budoucnosti bez bolesti"
  - Font: 16sp, regular
  - Color: Medium grey (#757575)
  - Centered, max 2 řádky

**Emotional hooks:**
- Pozitivní framing (ne "Nemáte přístup", ale "Odemkněte")
- Health-focused messaging
- Value over price

### Feature Comparison (Free vs Pro)

**Seznam funkcí (vertikální scrollable):**

Každá feature je row s:
- ✅ Checkmark (zelená, 24dp)
- Název funkce (16sp, medium)
- Subtitle vysvětlující hodnotu (14sp, grey)
- Spacing: 16dp mezi řádky

**Pro features:**
1. ✅ **Všechny partie těla**
   - (ne jen Krk a Zápěstí)

2. ✅ **Hodinové preventivní připomínky**
   - Automatické micro-cviky během dne

3. ✅ **Vlastní rutiny**
   - Vytvoř si své oblíbené sestavy

4. ✅ **Detailní statistiky**
   - Sleduj pokrok a pain-free streak

5. ✅ **Offline režim**
   - Cvič i bez internetu

6. ✅ **Prioritní podpora**
   - Email podpora do 24 hodin

**Optional: Comparison table (collapsible)**
```
┌─────────────────────────────────┐
│ [ Porovnat plány ⌄ ]           │  <- Expandable section
├─────────────────────────────────┤
│ Funkce        │ Free  │ Pro ✓  │
├───────────────┼───────┼────────┤
│ Krk & Zápěstí │  ✅   │   ✅   │
│ Všechny partie│  ❌   │   ✅   │
│ Připomínky    │  ❌   │   ✅   │
│ ...           │       │        │
└─────────────────────────────────┘
```

### Pricing Display

**Plan cards:**
- 3 možnosti (ročně, měsíčně, lifetime)
- Každá karta: Min 80dp výška
- Selected state: Primary color border (2dp)
- Tap anywhere na kartě vybere plán

**Recommended plan (Annual):**
- Background: Light blue (#E3F2FD)
- Border: 2dp primary color (#4A90E2)
- Badge "🏆 Ušetříte 340 Kč" v rohu (optional)
- Highlighted text "Nejoblíbenější" nahoře

**Card content:**
- Icon (💎/📅/⚡) vlevo
- Plan name (18sp, bold)
- Price (24sp, extra bold) - main focus
- Billing period (14sp, grey)
- Savings calculation (16sp, green) pokud applicable

**Psychological pricing:**
- Annual: "990 Kč/rok (82 Kč/měsíc)" - break down na měsíc
- Monthly: "99 Kč/měsíc"
- Lifetime: "2 490 Kč jednorázově" - emphasize one-time

### CTA Buttons

**Primary CTA:**
- Text: "🎁 POKRAČOVAT S PRO" nebo "ZAČÍT ZDARMA"
- Výška: 64dp (velký touch target)
- Šířka: Full width minus 32dp margin
- Background: Gradient (#4A90E2 → #357ABD)
- Text: White, 18sp, bold
- Position: Fixed na spodku (nebo sticky)
- Shadow: 4dp elevation

**States:**
- Default: Gradient + shadow
- Pressed: Darker shade, scale 98%
- Loading: Spinner + "Načítám..."
- Success: Checkmark animation

**Trial messaging pod CTA:**
- "7 dní zdarma, pak 990 Kč/rok"
- "Zrušte kdykoliv"
- Font: 14sp, centered, grey
- Spacing: 8dp pod tlačítkem

### Skip/Close Option

**Close button:**
- Position: Top right (16dp margin)
- Size: 48x48dp (min touch target)
- Icon: X nebo ← (zpět)
- Color: Grey (#757575)
- No background (transparent)

**Alternative: "Pokračovat zdarma" link**
- Position: Centered dole pod CTA
- Font: 16sp, underline
- Color: Medium grey
- Text: "Zatím ne, pokračovat se základní verzí"

**Restore purchases:**
- Small text link (14sp)
- Position: Pod CTA, centered
- Color: Primary (#4A90E2)
- Text: "[Obnovit nákupy]"
- Important pro uživatele co přeinstalovali app

**Legal links:**
- Tiny font (12sp), grey
- Bottom: "Podmínky používání | Zásady soukromí"
- Tappable, opens in-app browser

**Accessibility:**
- VoiceOver: "Zavřít předplatné, pokračovat zdarma"
- Musí být snadné dismiss paywall (ne dark pattern)

---

## 6. ONBOARDING (Úvodní průvodce - 4 obrazovky)

### 6.1 WELCOME SCREEN (Uvítací obrazovka)

```
┌─────────────────────────────────┐
│                                  │
│                                  │
│         [Logo DeskFix]          │  <- App logo (120dp)
│                                  │     Animace: fade in + scale
│     🧍💪 Ilustrace               │  <- Hero illustration (200dp)
│     Office worker relaxed        │     Calming colors
│                                  │
│   Váš osobní fyzioterapeut      │  <- Main headline (26sp, bold)
│        do kapsy                  │     Centered, 2 řádky max
│                                  │
│   3 minuty denně pro život      │  <- Subheadline (18sp, regular)
│   bez bolesti                    │     Grey color
│                                  │
│                                  │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐       │  <- Page indicators (dots)
│  │ ● │ │ ○ │ │ ○ │ │ ○ │       │     Active: Primary color
│  └───┘ └───┘ └───┘ └───┘       │     Inactive: Light grey
│                                  │
│                                  │
│ ┌─────────────────────────────┐ │
│ │     ZAČÍNÁME! →              │ │  <- Primary CTA (64dp)
│ └─────────────────────────────┘ │
│                                  │
│     [Přeskočit průvodce]        │  <- Skip link (optional)
│                                  │     14sp, grey, underline
└─────────────────────────────────┘
```

**Design principy:**
- Jednoduché, nekřičivé
- Ilustrace: Flat design, pastelové barvy
- Focus na value proposition
- Large text pro čitelnost
- Swipeable (gesto doleva → další screen)

**Interaction:**
- Swipe left: Další obrazovka
- Tap CTA: Další obrazovka
- Tap Skip: Jump to finish (save settings, go to home)

---

### 6.2 PAIN AREA SELECTION (Výběr bolestivých partií)

```
┌─────────────────────────────────┐
│                                  │
│   Co vás nejvíc trápí?          │  <- Question (24sp, bold)
│                                  │
│   Vyberte všechny oblasti,      │  <- Helper text (16sp, grey)
│   které vás bolí                 │
│                                  │
│ ┌─────────────────────────────┐ │
│ │                              │ │
│ │    [Body Map Ilustrace]     │ │  <- Simplified body map (240dp)
│ │                              │ │     Tappable areas
│ │        🧍                    │ │
│ │                              │ │
│ └─────────────────────────────┘ │
│                                  │
│  Nebo vyberte ze seznamu:       │  <- Alternative selector
│                                  │
│ ┌────────────┐ ┌────────────┐  │
│ │ 🦴 Krk     │ │ 💪 Ramena  │  │  <- Chip buttons (multiselect)
│ └────────────┘ └────────────┘  │     56dp výška, rounded
│ ┌────────────┐ ┌────────────┐  │     Selected: Primary fill
│ │ 🔙 Záda    │ │ 🤲 Zápěstí │  │     Unselected: Outline
│ └────────────┘ └────────────┘  │
│ ┌────────────┐ ┌────────────┐  │
│ │ 🦴 Kyčle   │ │ 👀 Oči     │  │
│ └────────────┘ └────────────┘  │
│                                  │
│  Vybrané (3): Krk, Záda,        │  <- Selected summary (14sp)
│               Zápěstí            │     Updates live
│                                  │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐       │  <- Page indicators
│  │ ○ │ │ ● │ │ ○ │ │ ○ │       │
│  └───┘ └───┘ └───┘ └───┘       │
│                                  │
│ ┌─────────────────────────────┐ │
│ │       POKRAČOVAT →           │ │  <- CTA (enabled když >0 selected)
│ └─────────────────────────────┘ │
│                                  │
│        [← Zpět]                 │  <- Back link
└─────────────────────────────────┘
```

**Functionality:**
- Multi-select (minimálně 1, doporučeno 2-3)
- Visual feedback: Selected chip má fill + checkmark
- Body map OR chip buttons (nebo oboje)
- Data uložena do UserSettings.selected_pain_areas
- Použito pro personalizaci home screen doporučení

**Accessibility:**
- Large chips (min 56dp výška)
- Clear selected state (color + icon)
- VoiceOver: "Krk, vybraný" / "Ramena, nevybraný"

---

### 6.3 NOTIFICATION PERMISSION (Povolení notifikací)

```
┌─────────────────────────────────┐
│                                  │
│                                  │
│      📱                          │  <- Icon (64dp)
│      🔔                          │     Bell with subtle animation
│                                  │
│   Zůstaňte bez bolesti          │  <- Headline (24sp, bold)
│   celý den                       │
│                                  │
│   Pošleme vám jemné připomínky  │  <- Explanation (16sp, regular)
│   během pracovní doby. Žádný    │     Multi-line, centered
│   spam, jen krátké cviky pro    │     Max 4 řádky
│   okamžitou úlevu.               │
│                                  │
│ ┌─────────────────────────────┐ │
│ │ ✅ Každou hodinu během       │ │  <- Benefits list
│ │    pracovní doby              │ │     (64dp per row)
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ ✅ Tiché v kanceláři         │ │
│ │    (office mode)              │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ ✅ Zrušte kdykoliv           │ │
│ │    v nastavení                │ │
│ └─────────────────────────────┘ │
│                                  │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐       │  <- Page indicators
│  │ ○ │ │ ○ │ │ ● │ │ ○ │       │
│  └───┘ └───┘ └───┘ └───┘       │
│                                  │
│ ┌─────────────────────────────┐ │
│ │   🔔 POVOLIT NOTIFIKACE      │ │  <- Primary CTA (64dp)
│ └─────────────────────────────┘ │     Triggers OS permission
│                                  │
│   [Teď ne, nastavím později]    │  <- Skip option (14sp)
│                                  │     Grey, underline
│                                  │
│        [← Zpět]                 │
└─────────────────────────────────┘
```

**Functionality:**
- CTA trigger: `Notifications.requestPermissionsAsync()`
- Pokud povoleno: Aktivuje hourly_nudge_enabled = true
- Pokud odmítnuto: Nastaví false, show info jak povolit v Settings
- Skip: Pokračuj bez notifikací (lze zapnout později)

**Copy strategy:**
- Pozitivní messaging (benefits, not pressure)
- Jasně vysvětlit frequency ("každou hodinu")
- Emphasize kontrolu ("zrušte kdykoliv")
- Office-friendly mention (silent mode)

---

### 6.4 QUICK START (Rychlý start)

```
┌─────────────────────────────────┐
│                                  │
│      🎉                          │  <- Celebration icon (64dp)
│                                  │
│   Vše je připraveno!            │  <- Success headline (26sp, bold)
│                                  │
│   Vaše první rutina na míru:    │  <- Personalized intro (18sp)
│                                  │
│ ┌─────────────────────────────┐ │
│ │ [Thumbnail]                  │ │  <- Suggested routine card
│ │                              │ │     Based on pain areas selected
│ │ Rychlá úleva - Krk & Záda   │ │     (Rounded, shadow, 160dp)
│ │                              │ │
│ │ ⏱️ 3 minuty │ 💪 Začátečník  │ │
│ └─────────────────────────────┘ │
│                                  │
│  💡 Tip: Cvičte 2x denně        │  <- Helpful tip (16sp, grey)
│     (ráno a odpoledne) pro      │     Background: Light yellow
│     nejlepší výsledky           │     Padding: 16dp, rounded
│                                  │
│                                  │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐       │  <- Page indicators
│  │ ○ │ │ ○ │ │ ○ │ │ ● │       │
│  └───┘ └───┘ └───┘ └───┘       │
│                                  │
│ ┌─────────────────────────────┐ │
│ │   🚀 ZAČÍT CVIČIT!           │ │  <- Primary CTA (64dp)
│ └─────────────────────────────┘ │     → Start first routine
│                                  │
│   [Nejdřív se chci podívat]     │  <- Skip to home (14sp)
│                                  │     Grey, underline
│                                  │
└─────────────────────────────────┘
```

**Functionality:**
- Display personalized routine based on:
  - Selected pain areas (screen 2)
  - Beginner level
  - Short duration (3-5 min)

- CTA "ZAČÍT CVIČIT" → Jump directly to Active Player
- Skip link → Go to Home screen
- Save `onboarding_completed = true`

**Data persistence:**
```typescript
UserSettings = {
  onboarding_completed: true,
  selected_pain_areas: ['neck', 'lower_back'],
  hourly_nudge_enabled: true/false,
  work_hours_start: "09:00",
  work_hours_end: "17:00",
  office_mode: true, // default
  is_pro: false
}
```

---

## Accessibility Considerations (Across All Screens)

### Touch Targets
- **Minimální velikost**: 48x48dp (WCAG guideline)
- **Doporučená velikost**: 56x56dp pro primary actions
- **Spacing**: Minimálně 8dp mezi touch targets

### Color Contrast
- **Text na pozadí**: Min 4.5:1 ratio (WCAG AA)
- **Large text (18sp+)**: Min 3:1 ratio
- **Ikony**: Min 3:1 contrast
- **Test tools**: Použít Figma Contrast Plugin nebo WebAIM

### Typography
- **Minimální font**: 14sp pro body text
- **Line height**: 1.5x font size (24sp for 16sp text)
- **Max line length**: 60-70 characters
- **Headings**: Clear hierarchy (26sp → 20sp → 16sp)

### VoiceOver / TalkBack Support
- Všechna tlačítka mají jasné labels
- Images mají alt text descriptions
- Progress indicators mají textové ekvivalenty
- Form fields mají labels (ne jen placeholders)

### Motion & Animation
- **Reduce motion support**: Respektovat system preference
- **Animation duration**: Max 300ms pro UI feedback
- **Optional disable**: Settings toggle pro motion sensitivity

### Error States & Feedback
- **Visual**: Color + icon (ne jen color)
- **Haptic**: Light/Medium feedback pro errors
- **Text**: Clear error messages v češtině

---

## Interaction Patterns Summary

### Navigation
- **Bottom Tab Bar**: Hlavní navigace (Home, Library, Reminders, Profile)
- **Stack Navigation**: Detail screens with back button
- **Modal**: Paywall, Settings pickers
- **Gestures**: Swipe back (iOS), swipe between onboarding

### Feedback Patterns
- **Tap**: Scale down 98% + haptic light
- **Long press**: Show tooltip/context menu
- **Success**: Green checkmark + haptic medium
- **Error**: Red shake animation + haptic heavy

### Loading States
- **Skeleton screens**: For content loading
- **Spinners**: For actions (save, load)
- **Progress bars**: For timed activities (exercise countdown)

### Empty States
- **Friendly messaging**: "Zatím žádné cviky. Začněte na Home!"
- **CTA button**: Akce k vyplnění stavu
- **Illustration**: Subtle, on-brand graphic

---

## Design Tokens (Pro implementaci)

### Colors
```
Primary: #4A90E2 (blue)
Secondary: #7ED321 (green)
Accent: #F5A623 (orange)
Error: #E74C3C (red - jen pro pain indicators)
Success: #27AE60 (dark green)

Backgrounds:
- Background: #FFFFFF
- Surface: #F5F5F5
- Card: #FAFAFA

Text:
- Primary: #212121
- Secondary: #757575
- Disabled: #BDBDBD
- Inverse: #FFFFFF
```

### Spacing Scale
```
xs: 4dp
sm: 8dp
md: 16dp
lg: 24dp
xl: 32dp
xxl: 48dp
```

### Border Radius
```
Small: 4dp (chips, badges)
Medium: 8dp (cards, buttons)
Large: 12dp (modals, sheets)
Round: 50% (circular buttons)
```

### Elevation (Shadows)
```
Level 1: 1dp (subtle lift)
Level 2: 4dp (cards)
Level 3: 8dp (floating buttons)
Level 4: 16dp (modals)
```

### Typography Scale
```
Display: 26sp, bold
Headline: 24sp, bold
Title: 20sp, semibold
Body: 16sp, regular
Caption: 14sp, regular
Label: 12sp, medium
```

---

## Závěrečné poznámky

Tyto wireframe popisy slouží jako základ pro:
1. **Design mockupy** v Figma/Sketch
2. **Developer handoff** s přesnými spec
3. **User testing** prototypů
4. **Stakeholder alignment** na UX flow

Další kroky:
- Vytvořit high-fidelity mockupy
- Prototypovat v Figma/InVision
- User testing s cílovou skupinou (office workers)
- Iterovat na základě feedbacku
- Developer handoff s design tokens

**Priorita pro MVP:**
- Screens 1-4 jsou kritické (Home, Routine, Player, Settings)
- Paywall může být simplified (single plan)
- Onboarding může být zkrácen na 2 screens (Welcome + Pain selection)
