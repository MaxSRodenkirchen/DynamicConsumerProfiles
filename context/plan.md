Mein Plan ist aktuell:

### Wahrnehmungsmodule

Die Basis der Anwendung sind 6 Bewertungmodule:

1. Reinheit und Sicherheit
2. Authentizität und Vertrauen in Organisationen
3. Geschmack und Sensorischer Beleg
4. Formatvertrautheit und Verpackung
5. Prestige und Exklusivität
6. Informationsbewertung und Alltagshürden

Innerhalb dieser Module kann ein Konsument Bewertungen abgeben:

- -1 / Barriere / Hemmnis
- 0 / Legitimation / Ausgleich / Entkräftung
- 1 / Treiber / Motivator

Eine Legitimation kann nur abgegebn werden wenn eine Barriere vorhanden ist!

### Personenbezogener Kontext

1. Proxydaten (Name, ID, Foto, demografische Daten,...) sind nur zum ausschmücken da
2. Kontext-Fragen (Bewertungen -1 und 1 gehen direkt mit in die Bewertungsmodule ein)
3. Akzeptanz: "Willing to Try", "Willing to Buy", oder "Willing to Adopt" - Davon kann, muss aber keins ausgewählt sein

### Reize / Signale / Informationen

Werden Personen gezeigt und müssen bewertet werden.

Ein Reiz enthält:

- Name und ID
- Den Reiz (also die zu bewertendende Information oder Informationen, z.b. als Bild, oder Text, oder irgendein Medium)
- Primäre Funktion (wert-mindernd (unwahrscheinlich, sollte aber mitbedacht werden), legitimierend, wert-schaffend, widerstands-mindernd)
- Primäres Modul (Modul 1-6, beliebig viele) - soll nicht sichtbar sein, sondern mehr als eine Stütze für den Algorithmus dienen

## Ziel

Ziel ist vorherzusagen welcher Reiz einer Person als nächstes gezeigt werden müsste um ihre Akzeptanz weiter voranzubringen.

## Ablauf

1. Person erstellt ihr Profil un bewertet die ersten Fragen
2. Der Algorithmus wertet direkt die Bewertungen aus und
3. zeigt als nächstes einen Reiz der am besten passt

Dafür gibt es Regeln:

1. Wenn es eine Barriere in einem Modul gibt, muss ein Reiz gezeigt werden der auf das Modul abzielt und die primäre funktion ligitmierung hat
2. wenn es keine Barrieren mehr gibt kann in den Modulen wo noch kein Treiber bewertet wurde ein wert-schaffender reiz aus dem modul gespielt werden

Mehr Regeln können später folgen und auch die allgemeine Akzeptanz mitbetrachten!

## Das MVP-Tool

Was wir hier gerade entwickeln ist erstmal nur zum Testen der Funktionalitäten!!! Also kein Styling!

Wir testen verschiedene Sachen, welche man über buttons im header wechseln kann.

1. Profilseite, auf der man alle Profile sieht und ein neues erstellen kann! (Das haben wir gerade schon mit den Proxydaten gemacht)
2. Eine Reizbewertungsseite: Zweispaltig: Links der Reiz, Rechts ein Grid mit den 6 Modulen. in jedem modul befindet sich ein button für Barriere, Legitimation (nur sichtbar wenn Barriere vorhanden), und Treiber

## Wichtig

Schaue dir auch mal die Notizen im Ordner "/src/notes" an. Da sind wichtige Daten drinnen. Das Tool was wir entwickeln orientiert sich an dem IPS-Framework
