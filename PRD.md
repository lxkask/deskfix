# PRD: DeskFix MVP

## 1. Vize produktu

DeskFix je "mikro-fyzioterapeut do kapsy" pro office workers s chronickou bolestí z dlouhého sezení u počítače. Appka poskytuje okamžitou úlevu skrz 3minutové cílené cvičební rutiny, které se dají provést přímo v kanceláři bez převlékání. Core value proposition: Cítím bolest → 3 kliky → cvičím 3 minuty → úleva.

## 2. Cílová skupina

**Primární persona: "Vyčerpaný vývojář" (25-45 let)**
- Tráví 8+ hodin denně u PC (office/remote)
- Trpí "tech neck", bolestí beder, karpály nebo napjatými rameny
- Nemá čas na hodinové tréninky, chce rychlý fix přímo u stolu
- Potřebuje diskrétní řešení bez hlasitých zvuků v open-space
- Ochotný platit 3-5 EUR/měsíc za prevenci a rozšířený obsah

**Pain points:**
- Bolest narušuje produktivitu, ale není čas chodit k fyzioterapeutovi
- Stávající fitness appky jsou příliš komplexní nebo nevhodné pro kancelář
- Zapomíná na aktivní přestávky během práce

## 3. Core Features (MVP)

### F1: Body Map Dashboard (Home Screen)
Interaktivní vizualizace těla (nebo seznam) s 6 zónami: Krk, Ramena, Záda horní/dolní, Zápěstí, Kyčle. Uživatel klikne na bolavou část → zobrazí se 2-3 ready-made rutiny (např. "Quick Relief 3min", "Deep Stretch 5min"). Jedna karta na rutinu s délkou a náhledem.

### F2: Routine Player
Full-screen přehrávač série cviků. Pro každý cvik: video smyčka (GIF/MP4), název, countdown timer (30-60s), vizuální progress bar (X/Y cviků), tlačítka Skip/Pause. Audio cue na konci cviku (nebo pouze vibrace v Office Mode). Při dokončení rutiny: "Well done" feedback + log do historie.

### F3: Exercise Library (Data Layer)
JSON-based content management. Struktura: Exercise ID, name, description, video_url, duration_default, target_body_part[], tags (office-friendly, standing, sitting). Pro MVP: 15 cviků pokrývajících 3 partie (Krk, Zápěstí, Záda). Remote config ready pro OTA updates bez nové verze appky.

### F4: Hourly Nudge (Prevention Mode) - PRO Feature
Uživatel nastaví work hours (default 09:00-17:00). Appka naplánuje local notifications každých 60 minut. Po tapnutí na notifikaci se otevře jeden náhodný micro-drill (30-60s), ne celá rutina. Anti-repeat logic: neposílat stejný cvik víc než 1x za den. Integrace s OS notification permissions.

### F5: Progress & Relief Log
Jednoduchá denní statistika: "Dnes jsi cvičil 2x, ulehčil jsi si Krk + Záda". Streak counter (dny v řadě s alespoň 1 dokončenou rutinou). Vizualizace jako kalendář s tečkami nebo simple number badge. Data v SQLite.

### F6: Settings & Onboarding
- Onboarding (first launch): 3 screens - Welcome, "Co tě nejvíc bolí?" (multi-select body parts → nastaví defaults), Permission request (notifications)
- Settings: Office Mode (vypne audio cues, jen vibrace), Work Hours picker pro Hourly Nudge, Notification opt-out
- Soft paywall screen: zobrazí Pro features (All body parts, Hourly Nudge, Stats) + pricing (zatím placeholder, real IAP v post-MVP)

## 4. User Stories

**Akutní úleva:**
1. Jako office worker s bolestí krku chci vidět seznam rychlých cviků na krk, abych mohl okamžitě začít cvičit bez hledání.
2. Jako uživatel chci během přehrávání rutiny vidět countdown timer a vizuální progress, abych věděl, kolik mi zbývá.
3. Jako uživatel v open-space chci mít možnost vypnout audio pokyny, abych nerušil kolegy.

**Prevence:**
4. Jako vývojář zapomínající na pauzy chci dostávat hodinové notifikace s jedním krátkým cvikem, abych si pravidelně protáhl zatuhnuté partie.
5. Jako uživatel chci, aby mi appka neposílala stále stejné cviky, abych se nenudil a zůstal motivovaný.

**Motivace a tracking:**
6. Jako uživatel chci vidět svůj streak (kolik dní v řadě cvičím), abych měl motivaci pokračovat.
7. Jako uživatel chci rychle zlogovat, kterou partii jsem dnes cvičil, abych viděl progress.

**Monetizace:**
8. Jako free user s bolestí beder chci vidět, co dostanu v Pro verzi, abych se mohl rozhodnout o upgradu.
9. Jako Pro user chci přístup ke všem rutinám (Kyčle, Oči, Ramena) a detailním statistikám, abych měl komplexní řešení.

**Onboarding:**
10. Jako first-time user chci být v onboardingu dotázán na mé hlavní bolesti, aby mi appka rovnou ukázala relevantní rutiny.

## 5. Metriky úspěchu

**Engagement (klíčové pro MVP validaci):**
- **Notification CTR**: Kolik % Hourly Nudge notifikací vede k otevření appky a dokončení micro-drillu (target: >25%)
- **Daily Active Users (DAU)**: Podíl uživatelů, kteří appku otevřou alespoň 1x denně (target: >15% z MAU)
- **Session completion rate**: Kolik % spuštěných rutin je dokončeno do konce (target: >70%)

**Retention:**
- **D1/D7/D30 retention**: Kolik uživatelů se vrátí následující den/týden/měsíc (target: D1 >40%, D7 >20%, D30 >10%)
- **Streak persistence**: Průměrná délka streaku aktivních uživatelů (target: >5 dní)

**Monetizace (soft paywall MVP):**
- **Paywall impression rate**: Kolik % uživatelů klikne na locked Pro feature (měří zájem)
- **Free-to-Pro conversion intent**: Kolik uživatelů klikne na pricing screen (target: >10% za první týden)

**Product-market fit indikátory:**
- **Time to first routine**: Čas od instalace do prvního dokončeného cvičení (target: <3 minuty)
- **Weekly exercise frequency**: Průměrný počet dokončených rutin na aktivního uživatele týdně (target: >4)

## 6. Out of Scope (MVP)

**Explicitně NE:**
- Diagnostika bolesti nebo health assessment (právní risk, není to lékařská appka)
- Komplexní jógové sessions nebo workout programy (to dělají jiné appky)
- Integrace s Apple Health / Google Fit (post-MVP nice-to-have)
- Sociální features (sdílení streaku, community)
- Custom exercise builder (uživatel si vytváří vlastní rutiny) - Pro feature v post-MVP
- Real-time video instruktor nebo live sessions
- Offline download videí (v MVP předpokládáme Wi-Fi dostupnost na pracovišti)
- Multi-language support (MVP pouze CZ/EN)

**Odloženo do post-MVP:**
- Skutečné IAP platby (MVP = soft paywall s pricing screen)
- Advanced analytics (heatmapa bolesti přes týden, korelace s produktivitou)
- Personalizace rutin na základě ML (které cviky uživateli nejlépe pomáhají)
- Integration s posture tracking (kamera detekce špatného držení těla)

## 7. Rizika a předpoklady

**Technická rizika:**
- **Notification delivery spolehlivost**: iOS/Android agresivně omezují background scheduling. Mitigation: Používáme Expo Notifications scheduled triggers (not background tasks), testujeme real devices, ne jen simulátory. Fallback: V settings upozorníme uživatele, aby měli appku v allowlistu pro notifikace.
- **Video playback performance**: Video smyčky můžou žrát baterii. Mitigation: MVP začne s optimalizovanými GIFy nebo krátké MP4 loopy (max 10s, compressované), testujeme na mid-tier Android zařízeních.
- **Wake lock během cvičení**: Displej se musí držet zapnutý. Mitigation: `expo-keep-awake`, ale musíme správně uvolnit při opuštění playeru (memory leak risk).

**Produktová rizika:**
- **Předpoklad #1: Uživatelé zapnou notifikace**: Bez toho Hourly Nudge (core value) nefunguje. Mitigation: V onboardingu jasně vysvětlíme hodnotu notifikací, nabídneme test notification hned po povolení.
- **Předpoklad #2: 3minutové cviky stačí na úlevu**: Pokud rutiny budou příliš krátké, uživatelé neucítí benefit. Mitigation: Před launchem validujeme rutiny s 5 beta testery (office workers), měříme subjektivní úlevu 1-5 stars po každé rutině.
- **Předpoklad #3: Lidé budou cvičit u stolu v oblečení**: Pokud cviky vyžadují prostornost nebo převlečení, selhává "office-friendly" premise. Mitigation: V content creation tagujeme cviky jako sitting/standing/no-equipment a filtrujeme podle kontextu.

**Business rizika:**
- **Competitive differentiation**: Trh má spoustu fitness/stretch appek. Mitigation: DeskFix je laser-focused na office context (diskrétnost, rychlost, micro-routines). Marketing zdůrazní "3 kliky → 3 minuty → úleva".
- **Monetizace uncertainty**: Freemium může selhát, pokud free tier dá příliš mnoho hodnoty. Mitigation: Free tier omezený na 2 partie je dost limitující (většina lidí má >2 bolestivé zóny). Měříme paywall impression rate už v MVP.
- **Content creation bottleneck**: Kvalitní videa cviků vyžadují fyzioterapeuta + videografa. Mitigation: Pro MVP použijeme stock videa nebo jednoduchá animace (GIFy), post-MVP investujeme do profesionální produkce.

**Compliance & Legal:**
- **Medical disclaimer povinný**: Appka nesmí dávat diagnostické rady. Mitigation: Při first launch zobrazíme disclaimer (uložíme consent do SQLite). Text typu: "DeskFix není náhrada lékařské péče. Při vážné bolesti konzultujte odborníka."
- **GDPR**: Lokální data (SQLite), žádné externí tracking v MVP. Mitigation: Privacy-first přístup, v budoucnu pokud přidáme analytics (Firebase), implementujeme opt-in consent.

**Execution risk:**
- **Scope creep**: Je lákavé přidávat features (gamifikace, AI coach). Mitigation: Držíme se této PRD, launch za 10 dní s těmito 6 features, zbytek do backlogu.
- **Cross-platform edge cases**: RN notifikace se chovají jinak na iOS vs Android. Mitigation: Od začátku testujeme obě platformy, připravíme platform-specific conditional logic kde je třeba.

---

**Approval & Next Steps:**
Po schválení PRD pokračuj na:
1. UX Flow & Navigation architecture
2. Wireframe description (textové)
3. Data model (TypeScript interfaces)
4. Technical design (Notification Engine + Player Architecture)
