/**
 * Geschichtliche Ausschmückungen (Hypertext-Szenen) und vorformulierte Gedanken-Links
 * (Legitimation [0], Barriere [-1], Enabler [+1]) für den Prototyp Decision Tree.
 */

export const MODULE_DEFAULT_RESPONSES = {
  1: {
    legit: (stimName) => `Durch „${stimName}“ fühle ich mich sicher: Meine gesundheitlichen Bedenken und Zweifel an der Reinheit sind damit ausgeräumt.`,
    barrier: (stimName) => `Trotz „${stimName}“ bleibt für mich ein unnatürliches, künstliches Gefühl – ich traue der Sicherheit im Körper nicht.`,
    driver: (stimName) => `„${stimName}“ überzeugt mich, dass das Produkt besonders sauber, kontrolliert und frei von Schadstoffen ist.`
  },
  2: {
    legit: (stimName) => `„${stimName}“ nimmt mir meine Skepsis gegenüber den Herstellern – diese Instanz wirkt auf mich glaubwürdig.`,
    barrier: (stimName) => `Hinter „${stimName}“ vermute ich bloß geschicktes Marketing und Profitinteresse statt echter Ehrlichkeit.`,
    driver: (stimName) => `„${stimName}“ schafft für mich echtes Vertrauen in die Herkunft und Verantwortlichkeit hinter dem Produkt.`
  },
  3: {
    legit: (stimName) => `Meine Befürchtung, dass es fad oder künstlich schmeckt, wird durch „${stimName}“ entkräftet.`,
    barrier: (stimName) => `Bei „${stimName}“ kann ich mir trotzdem nicht vorstellen, dass Biss, Saftigkeit und Geschmack an echtes Fleisch herankommen.`,
    driver: (stimName) => `„${stimName}“ macht mir richtig Appetit – geschmacklich und sensorisch klingt das nach vollem Genuss.`
  },
  4: {
    legit: (stimName) => `Durch „${stimName}“ wirkt das Produkt optisch und im Format nicht mehr fremdartig auf mich.`,
    barrier: (stimName) => `Die Aufmachung bei „${stimName}“ schreckt mich eher ab und passt nicht zu dem, wonach ich im Regal greife.`,
    driver: (stimName) => `Das Format und die Präsentation bei „${stimName}“ sprechen mich sofort an und passen perfekt auf meinen Teller.`
  },
  5: {
    legit: (stimName) => `Meine Sorge, mich vor Freunden oder Familie dafür rechtfertigen zu müssen, löst sich durch „${stimName}“ auf.`,
    barrier: (stimName) => `„${stimName}“ wirkt auf mich abgehoben oder befremdlich – in meinem Umfeld käme das sicher nicht gut an.`,
    driver: (stimName) => `Mit „${stimName}“ verbindet sich ein moderner, verantwortungsbewusster Lebensstil, den ich gerne teile.`
  },
  6: {
    legit: (stimName) => `Meine praktischen Bedenken im Alltag (Preis, Aufwand oder Verfügbarkeit) werden durch „${stimName}“ gelöst.`,
    barrier: (stimName) => `Für meinen normalen Wocheneinkauf und Geldbeutel bleibt „${stimName}“ im Alltag zu kompliziert oder unpraktisch.`,
    driver: (stimName) => `„${stimName}“ macht es mir im Alltag leicht, das Produkt unkompliziert in meine Routine einzubauen.`
  }
};

export const STIMULUS_STORY_DATA = {
  'S-020': {
    story: 'Du schlenderst am Samstagnachmittag durch deinen vertrauten Bio-Supermarkt. Zwischen regionalem Gemüse und streng kontrollierten Naturprodukten entdeckst du in der Kühltheke eine Packung kultiviertes Fleisch – versehen mit dem offiziellen Listungshinweis des Bio-Fachmarkts nach strenger Prüfung auf ökologische Standards und Gentechnikfreiheit.',
    modules: {
      1: {
        legit: 'Ich vertraue Biomärkten, dass sie nur streng geprüfte und gesundheitlich sichere Produkte in ihr Sortiment lassen.',
        barrier: 'Selbst im Biomarkt bleibt es für mich ein im Reaktor gezüchtetes Produkt – das passt für mich nicht zu natürlicher Reinheit.',
        driver: 'Dass ein Bio-Fachmarkt das Produkt führt, unterstreicht für mich höchste Sauberkeit und Schadstofffreiheit.'
      },
      2: {
        legit: 'Wenn ein etablierter Bio-Händler dafür bürgt, löst das mein Misstrauen gegenüber den Herstellern auf.',
        barrier: 'Verkaufen jetzt selbst Bioläden hochtechnologische Laborprodukte aus reinem Umsatzinteresse?',
        driver: 'Die strenge Auswahl durch den Bio-Handel schafft für mich sofort hohes Vertrauen und Glaubwürdigkeit.'
      },
      3: {
        legit: 'In einem guten Biomarkt erwarte ich vernünftige kulinarische Qualität – meine Geschmackszweifel treten zurück.',
        barrier: 'Bio-Siegel hin oder her: Ob das in der Pfanne wirklich wie ein saftiges Stück Fleisch schmeckt, bezweifle ich.',
        driver: 'Produkte aus dem Bio-Feinkostbereich stehen für mich meist für bewussten, hochwertigen Genuss.'
      },
      4: {
        legit: 'In der gewohnten Holz- und Natur-Optik der Bio-Kühltheke verliert die Packung für mich alles Laborhafte.',
        barrier: 'Zwischen frischem Bio-Gemüse wirkt eine Packung Zellkultur-Fleisch auf mich wie ein stilistischer Fremdkörper.',
        driver: 'Die Einbettung ins vertraute Bio-Regal lässt das Produkt direkt zugänglich und ansprechend wirken.'
      },
      5: {
        legit: 'Wenn ich erzähle, dass ich es aus dem Biomarkt habe, muss ich mich im Freundeskreis sicher nicht rechtfertigen.',
        barrier: 'Gerade in meinem ökologisch orientierten Umfeld würde man über „Laborfleisch aus dem Bioladen“ die Nase rümpfen.',
        driver: 'Ein innovatives Produkt aus dem Bio-Fachmarkt passt perfekt zu einem bewussten, zukunftsorientierten Lebensstil.'
      },
      6: {
        legit: 'Da ich ohnehin regelmäßig im Biomarkt einkaufe, fällt die Hürde der Beschaffung für mich weg.',
        barrier: 'Im Bio-Fachmarkt ist das Produkt bestimmt noch teurer als normales Fleisch und nichts für jeden Tag.',
        driver: 'Praktisch: Ich kann es direkt bei meinem gewohnten Bio-Wocheneinkauf unkompliziert mitnehmen.'
      }
    }
  },
  'S-028': {
    story: 'Beim Einkaufen fällt dein Blick auf ein neues Schild an der Kühltheke deines Biomarkts: Kultiviertes Fleisch ist hier nun offiziell gelistet. Der Markt betont, dass jedes gelistete Produkt strengsten internen Qualitäts- und Sicherheitsrichtlinien unterliegt.',
    modules: {
      1: {
        legit: 'Ich vertraue Biomärkten, dass sie nur sichere und unbedenkliche Produkte verkaufen.',
        barrier: 'Auch ein Biomarkt-Schild ändert nichts daran, dass mir Zellzüchtung im Labor unheimlich bleibt.',
        driver: 'Die Biomarkt-Kontrolle gibt mir ein starkes Gefühl von Reinheit und geprüfter Lebensmittelsicherheit.'
      },
      2: {
        legit: 'Die Listung im Biomarkt nimmt mir die Skepsis gegenüber den Produzenten hinter dem Produkt.',
        barrier: 'Ich bin skeptisch, ob Bioläden hier ihre ursprünglichen Werte für einen modernen Food-Tech-Trend aufweichen.',
        driver: 'Ich vertraue der Vorauswahl des Biomarkts – das bürgt für echte Transparenz und Seriosität.'
      },
      3: {
        legit: 'Was im Biomarkt gelistet wird, wurde bestimmt auch geschmacklich ordentlich getestet.',
        barrier: 'Nur weil es im Biomarkt liegt, heißt das noch lange nicht, dass Textur und Aroma überzeugen.',
        driver: 'Im Biomarkt habe ich schon oft geschmacklich tolle Neuentdeckungen gemacht – das weckt meine Neugier.'
      },
      4: {
        legit: 'Die Präsentation in der vertrauten Biomarkt-Theke nimmt dem Produkt den sterilen Labor-Charakter.',
        barrier: 'Optisch passt dieses Produkt für mich einfach nicht ins gewohnte Bild einer natürlichen Frischetheke.',
        driver: 'So ansprechend in der Kühltheke platziert, greife ich viel lieber zu.'
      },
      5: {
        legit: 'Ein Produkt aus dem Biomarkt genießt in meinem Umfeld hohes Ansehen – das hebt meine Bedenken auf.',
        barrier: 'Für mich wirkt das wie ein elitäres Nischenprodukt für Trend-Käufer.',
        driver: 'Beim gemeinsamen Kochen mit Freunden ist eine Neuheit aus dem Biomarkt ein spannendes Gesprächsthema.'
      },
      6: {
        legit: 'Damit ist das Produkt endlich im normalen Einkaufsalltag angekommen und leicht erreichbar.',
        barrier: 'Für den schnellen Alltagseinkauf gehe ich selten extra in den Biomarkt – und der Preis schreckt mich ab.',
        driver: 'Super unkompliziert, dass ich es direkt beim Einkaufen im Biomarkt in den Korb legen kann.'
      }
    }
  },
  'S-001': {
    story: 'Beim Scrollen durch ein Wissensmagazin stößt du auf eine anschauliche Infografik: Schritt für Schritt wird gezeigt, wie aus einer winzigen Gewebeprobe in einem Edelstahl-Bioreaktor mithilfe einer reinen Nährlösung aus Aminosäuren, Vitaminen und Glukose echte Muskelfasern heranwachsen.',
    modules: {
      1: {
        legit: 'Die genaue Erklärung der reinen Nährlösung aus Vitaminen und Aminosäuren nimmt mir die Angst vor bedenklichen Chemikalien.',
        barrier: 'Begriffe wie „Bioreaktor“ und „Zellisolierung“ klingen für mich erst recht nach künstlichem Chemie-Labor.',
        driver: 'Ein geschlossener, sauber gesteuerter Bioreaktor klingt für mich hygienischer als jeder herkömmliche Stall.'
      },
      2: {
        legit: 'Dass das Verfahren so offen und wissenschaftlich nachvollziehbar erklärt wird, baut mein Misstrauen ab.',
        barrier: 'Auf dem Papier klingt die High-Tech-Erklärung glatt, aber ich bezweifle, dass in der Massenproduktion alles so sauber abläuft.',
        driver: 'Diese wissenschaftliche Präzision und Offenheit weckt in mir großes Vertrauen in die Technologie.'
      },
      6: {
        legit: 'Jetzt verstehe ich endlich nüchtern, wie das Produkt entsteht – meine Verunsicherung im Alltag verschwindet.',
        barrier: 'Mir ist dieses hochtechnische Verfahren zu kompliziert; beim Essen möchte ich keine Wissenschaft studieren müssen.',
        driver: 'Das leuchtet mir sofort ein – eine smarte, ressourcenschonende Lösung für unsere zukünftige Ernährung.'
      }
    }
  },
  'S-002': {
    story: 'Auf einer Verkostungsmesse spricht dich ein Produktentwickler an: „Verwechseln Sie es nicht mit pflanzlichem Ersatz aus Erbsen oder Soja. Auf Zellebene ist es zu 100 % echtes tierisches Fleisch – nur ohne Aufzucht und Schlachtung gewachsen.“',
    modules: {
      3: {
        legit: 'Wenn es auf Zellebene identisch mit echtem Fleisch ist, verschwindet meine Sorge vor einem typischen Ersatzprodukt-Nachgeschmack.',
        barrier: 'Auch wenn die Zellen gleich heißen: Ohne natürliches Muskelwachstum am Tier glaube ich nicht an denselben Geschmack.',
        driver: '100 % echtes Fleisch auf Zellebene bedeutet für mich echten Fleischgenuss ohne Kompromisse!'
      },
      4: {
        legit: 'Zu wissen, dass es kein hochverarbeiteter Gemüse-Mix ist, macht das Produkt für mich als echtes Fleisch akzeptabel.',
        barrier: 'Fleisch ohne Tier bleibt für meine Vorstellungskraft ein Widerspruch, egal wie man es nennt.',
        driver: 'Dass ich echtes Fleisch in gewohnter Form bekomme, überzeugt mich sofort.'
      },
      6: {
        legit: 'Da es sich wie normales Fleisch verhält, muss ich meine gewohnten Rezepte beim Kochen nicht umstellen.',
        barrier: 'Im Alltag bleibe ich lieber bei dem Fleisch, das ich seit Jahrzehnten kenne.',
        driver: 'Perfekt für den Alltag: Ich kann meine Lieblingsgerichte genau wie immer zubereiten – nur ohne Tierleid.'
      }
    }
  },
  'S-007': {
    story: 'Du hältst eine minimalistische, reinweiße Vakuumverpackung in den Händen. Auf der Vorderseite steht klar gedruckt: „Kultiviertes Rindfleisch – 100 % frei von Antibiotika, Krankheitserregern und Kontamination.“',
    modules: {
      1: {
        legit: 'Das Versprechen „100 % frei von Antibiotika und Krankheitserregern“ räumt meine gesundheitlichen Sicherheitsbedenken aus.',
        barrier: 'Die reinweiße, medizinisch wirkende Packung verstärkt mein Gefühl, ein steriles Laborpräparat statt Essen vor mir zu haben.',
        driver: 'Frei von Antibiotika und Keimen – das ist für meine Gesundheit ein klarer Vorteil gegenüber konventionellem Fleisch!'
      },
      4: {
        legit: 'Die aufgeräumte, saubere Vakuumverpackung zeigt mir, dass hier ordentlich und hygienisch gearbeitet wird.',
        barrier: 'Das klinische Verpackungsdesign spricht mich im Supermarktregal überhaupt nicht an und wirkt kalt.',
        driver: 'Das klare, moderne Design vermittelt sofort höchste Reinheit und Qualität.'
      }
    }
  },
  'S-010': {
    story: 'Beim Blick auf das elektronische Preisschild an der Kühltheke stellst du überrascht fest: Die Packung kultiviertes Fleisch kostet 4,99 € – auf den Cent genau so viel wie das konventionelle Marken-Fleisch direkt daneben.',
    modules: {
      6: {
        legit: 'Bei gleichem Preis wie herkömmliches Fleisch fällt mein finanzielles Gegenargument im Alltag komplett weg.',
        barrier: 'Für ein völlig neues Produkt ohne Langzeiterfahrung sind mir selbst 4,99 € für einen Fehlkauf zu schade.',
        driver: 'Gleicher Preis bei besserer Umwelt- und Tierwohlbilanz – da greife ich im Alltag sofort zu!'
      },
      2: {
        legit: 'Dass kein überzogener Mondpreis verlangt wird, lässt die Anbieter fair und bodenständig wirken.',
        barrier: 'Wenn hochkomplexe Labortechnik plötzlich so billig angeboten wird, frage ich mich, wo bei der Qualität gespart wurde.',
        driver: 'Ein fairer Marktpreis zeigt mir, dass die Technologie ausgereift und alltagstauglich ist.'
      }
    }
  },
  'S-014': {
    story: 'In einer Kochshow im Abendfernsehen serviert ein bekannter 3-Sterne-Koch ein Filet aus kultiviertem Fleisch. Begeistert erklärt er, warum er es auf die Karte seines Spitzenrestaurants gesetzt hat und für die kulinarische Qualität bürgt.',
    modules: {
      3: {
        legit: 'Wenn ein 3-Sterne-Koch für Geschmack und Textur bürgt, löst das meine Zweifel an der Genussqualität auf.',
        barrier: 'Ein Spitzenkoch kann mit raffinierten Saucen alles kaschieren – bei mir zu Hause in der Pfanne schmeckt es bestimmt anders.',
        driver: 'Das Urteil eines Sternekochs macht mich richtig neugierig auf dieses besondere Geschmackserlebnis!'
      },
      5: {
        legit: 'Wenn das Produkt in der gehobenen Sternegastronomie gefeiert wird, muss man sich dafür gesellschaftlich keinesfalls schämen.',
        barrier: 'Das bestätigt mein Gefühl, dass es bloß ein abgehobener Schickimicki-Trend für Luxusrestaurants ist.',
        driver: 'Ein Produkt aus der Spitzengastronomie selbst zu Hause zu servieren, hat für mich echten Prestige-Charakter.'
      }
    }
  },
  'S-022': {
    story: 'Auf der Rückseite der Packung sticht dir das offizielle Prüfsiegel der Europäischen Behörde für Lebensmittelsicherheit (EFSA) ins Auge: „Nach mehrjähriger toxikologischer und ernährungsphysiologischer Prüfung offiziell in der EU zugelassen.“',
    modules: {
      1: {
        legit: 'Die mehrjährige toxikologische Prüfung durch die europäische Lebensmittelbehörde EFSA nimmt mir meine Sicherheitsbedenken.',
        barrier: 'Auch Behörden haben sich in der Vergangenheit schon geirrt – Langzeitfolgen über Jahrzehnte kennt noch niemand.',
        driver: 'Die strengen EU-Zulassungsstandards gehören zu den härtesten der Welt – das gibt mir maximale Sicherheit.'
      },
      2: {
        legit: 'Eine unabhängige staatliche EU-Prüfung ersetzt mein Misstrauen gegenüber privaten Herstellern durch offizielle Kontrolle.',
        barrier: 'Ich bin skeptisch, wie stark große Lobbyverbände auf solche Zulassungsverfahren Einfluss nehmen.',
        driver: 'Das offizielle EFSA-Siegel schafft für mich verlässliches institutionelles Vertrauen.'
      }
    }
  },
  'S-003': {
    story: 'Nach einem langen Arbeitstag stehst du vor der Truhe: Dort liegen knusprig panierte Chicken Nuggets und fertige Burger-Patties aus kultiviertem Fleisch – bereit, in fünf Minuten in der Pfanne gebraten zu werden.',
    modules: {
      4: {
        legit: 'Als vertraute Nuggets oder Burger-Patty wirkt das Produkt auf mich völlig normal und überhaupt nicht mehr fremdartig.',
        barrier: 'In Panade und Fast-Food-Form versteckt man doch nur, dass die eigentliche Fleischstruktur nicht überzeugt.',
        driver: 'Knusprige Nuggets und Burger sind genau das unkomplizierte Format, auf das ich abends Lust habe!'
      },
      3: {
        legit: 'Bei gewohnten Nuggets oder Burgern weiß ich, dass Würzung und Knusprigkeit für einen guten Geschmack sorgen.',
        barrier: 'Fast-Food-Fertigformate schmecken für mich oft fad und austauschbar.',
        driver: 'Ein saftiger Burger oder knusprige Nuggets klingen für mich nach unbeschwertem Genuss.'
      }
    }
  },
  'S-004': {
    story: 'In einer gläsernen Frischetheke liegt ein rohes, im Bioreaktor gewachsenes Steak-Filetstück mit deutlich sichtbarer, kultivierter Faserstruktur.',
    modules: {
      4: {
        legit: 'Dass man sogar eine echte Steak-Faserstruktur hinbekommt, nimmt mir den Eindruck eines künstlichen Breis.',
        barrier: 'Ein rohes, im Reaktor gezüchtetes Gewebestück anzusehen und anzufassen, löst bei mir Unbehagen aus.',
        driver: 'Ein echtes Filetstück statt bloß Hackfleisch zeigt mir, wie weit die Qualität bereits ist.'
      },
      1: {
        legit: 'Die saubere, gleichmäßige Faserstruktur ohne Sehnen oder Knorpel wirkt auf mich kontrolliert und rein.',
        barrier: 'Rohes gezüchtetes Zellgewebe wirkt auf mich unnatürlich und biologisch befremdlich.',
        driver: 'Reines Muskelfilet ohne Rückstände aus der Massentierhaltung überzeugt mich.'
      }
    }
  },
  'S-005': {
    story: 'Beim Wocheneinkauf siehst du kultiviertes Fleisch integriert in vertraute Alltagsprodukte: als klassische Bratwurst, feine Salami und fertige Bolognese-Sauce im Glas.',
    modules: {
      4: {
        legit: 'In einer gewohnten Bratwurst oder Bolognese fällt mir der Unterschied optisch gar nicht mehr schwer.',
        barrier: 'In Wurst und Fertigsauce merkt man gar nicht mehr, was man eigentlich isst – das ist mir zu intransparent.',
        driver: 'Bolognese und Bratwurst sind genau die vertrauten Klassiker, die ich gerne kaufe.'
      },
      6: {
        legit: 'Ein fertiges Alltagsprodukt nimmt mir jede Unsicherheit bei der Zubereitung in meiner Küche.',
        barrier: 'Für einfache Wurst oder Sauce im Alltag greife ich lieber zu bewährten Originalen.',
        driver: 'Ideal für den schnellen Feierabend – einfach aufwärmen oder anbraten und fertig!'
      }
    }
  },
  'S-006': {
    story: 'Eine Packung in warmen Erdtönen fällt dir auf. Ein Nachhaltigkeits-Label zeigt transparent die Umweltbilanz: „Klimaneutral produziert – bis zu 80 % weniger CO2 und 90 % weniger Flächenverbrauch.“',
    modules: {
      4: {
        legit: 'Die warme, natürliche Öko-Verpackung nimmt dem Produkt den kalten Technik-Look.',
        barrier: 'Grüne Erdtöne auf der Packung wirken auf mich wie typisches Greenwashing für ein Industrieprodukt.',
        driver: 'Das umweltfreundliche Design mit klarer Klimabilanz spricht mich im Regal sofort an.'
      },
      6: {
        legit: 'Mit 80 % weniger CO2 löst sich mein täglicher Gewissenskonflikt beim Fleischeinkauf endlich auf.',
        barrier: 'Öko-Versprechen auf Packungen machen den Einkauf für mich meistens nur teurer.',
        driver: 'So kann ich im Alltag aktiv Klima und Ressourcen schonen, ohne auf Fleisch zu verzichten.'
      }
    }
  },
  'S-008': {
    story: 'Du liest den Bericht einer unabhängigen Verbraucher-Blindverkostung: Unter 200 Testpersonen konnte niemand das kultivierte Rinderfilet in Geschmack, Saftigkeit und Röstaromen von konventionellem Filet unterscheiden.',
    modules: {
      3: {
        legit: 'Ein unabhängiges Blind-Tasting-Ergebnis räumt meine Sorge aus, dass es künstlich oder fad schmeckt.',
        barrier: 'Geschmackstests im Labor sind das eine – ob es mir zu Hause wirklich schmeckt, glaube ich erst, wenn ich es selbst probiere.',
        driver: 'Wenn selbst in einer Blindverkostung volle Saftigkeit und Röstaromen bestätigt werden, will ich es unbedingt probieren!'
      }
    }
  },
  'S-009': {
    story: 'Vor dir siehst du einen frisch gebratenen, saftigen Burger aus kultiviertem Rindfleisch mit geschmolzenem Cheddar, knusprigem Brioche-Bun und goldbrauner Kruste – es duftet nach Röstaromen.',
    modules: {
      3: {
        legit: 'Dieser appetitliche Anblick und die goldbraune Kruste lassen meine Geschmackszweifel sofort verschwinden.',
        barrier: 'Auf Werbefotos sieht jeder Burger perfekt aus – in der Realität ist die Konsistenz bestimmt enttäuschend.',
        driver: 'Das sieht unglaublich saftig und lecker aus – da läuft mir direkt das Wasser im Mund zusammen!'
      },
      4: {
        legit: 'Als klassischer Gourmet-Burger präsentiert, wirkt das Produkt vollkommen vertraut.',
        barrier: 'Auch ein schönes Burger-Foto täuscht mich nicht über die ungewohnte Herkunft hinweg.',
        driver: 'Genau so muss ein perfekter Burger aussehen!'
      }
    }
  },
  'S-011': {
    story: 'An der Kühltheke siehst du das Preisschild: Das kultivierte Fleisch ist 30 % teurer als herkömmliches Fleisch – begründet mit „technologischer Innovation und 100 % Tierwohl ohne Schlachtung“.',
    modules: {
      6: {
        legit: 'Für 100 % Tierwohl ohne Schlachtung sehe ich ein, warum der Preis in der Einführungsphase etwas höher liegt.',
        barrier: '30 % Aufpreis sprengen mein normales Haushaltsbudget – das ist im Alltag viel zu teuer.',
        driver: 'Für echtes Tierwohl gebe ich beim bewussten Sonntagsessen gerne etwas mehr aus.'
      },
      5: {
        legit: 'Der höhere Preis signalisiert mir, dass es sich um ein hochwertiges Premium-Produkt und keine Billigware handelt.',
        barrier: 'Durch den hohen Preis wird nachhaltige Ernährung wieder zum elitären Privileg für Besserverdienende.',
        driver: 'Als besonderes Qualitätsprodukt für Gäste ist es mir diesen Aufpreis wert.'
      }
    }
  },
  'S-012': {
    story: 'Ein Schild vor einem modernen Feinkost-Bistro verkündet: „Streng limitierte Edition aus unserer Manufaktur – heute exklusiv in ausgewählten Flagship-Restaurants verfügbar.“',
    modules: {
      5: {
        legit: 'Dass man sich um die limitierte Charge reißt, nimmt mir die Sorge, damit sozial anzuecken.',
        barrier: 'Künstliche Verknappung und Hype-Marketing stoßen mich eher ab.',
        driver: 'Zu den Ersten zu gehören, die diese limitierte kulinarische Neuheit probieren dürfen, reizt mich sehr!'
      }
    }
  },
  'S-013': {
    story: 'In deinem Social-Media-Feed teilt ein bekannter Food-Blogger ein ungeschnittenes Alltagsvideo: Er brät das kultivierte Fleisch in seiner eigenen Küche an und zeigt sich vom Geschmack ehrlich begeistert.',
    modules: {
      3: {
        legit: 'Das ehrliche Alltagsvideo beim Anbraten nimmt mir die Sorge, dass es in der Pfanne seltsam riecht oder schmeckt.',
        barrier: 'Influencer werden für solche Videos doch bezahlt – auf deren Geschmacksurteil verlasse ich mich nicht.',
        driver: 'Zu sehen, wie knusprig es in einer ganz normalen Küche gelingt, macht mir sofort Lust aufs Nachkochen!'
      },
      5: {
        legit: 'Wenn bekannte Food-Creators das ganz selbstverständlich kochen, wird es für mich gesellschaftlich völlig normal.',
        barrier: 'Ein typischer Social-Media-Modetrend, der genauso schnell wieder verschwindet.',
        driver: 'Spannend und modern – das würde ich beim nächsten Kochabend mit Freunden auch gerne ausprobieren.'
      }
    }
  },
  'S-015': {
    story: 'Im ganz normalen Supermarkt um die Ecke liegt das kultivierte Fleisch selbstverständlich direkt in der regulären Kühltheke neben Rinderhackfleisch und Hähnchenbrust.',
    modules: {
      4: {
        legit: 'Direkt neben dem normalen Fleisch in der Kühltheke verliert das Produkt für mich jede Sonderstellung.',
        barrier: 'Wenn es direkt neben normalem Fleisch liegt, befürchte ich Verwechslungen beim schnellen Einkauf.',
        driver: 'Die Platzierung mitten im vertrauten Fleischregal macht den Griff zur Packung völlig natürlich.'
      },
      6: {
        legit: 'Ich muss in keinen Spezialladen mehr gehen – meine Hürde bei der Verfügbarkeit im Alltag ist gelöst.',
        barrier: 'Aus Gewohnheit greife ich im Regal daneben doch wieder zum altbekannten Original.',
        driver: 'Super praktisch: Direkt beim normalen Wocheneinkauf im Supermarkt verfügbar!'
      }
    }
  },
  'S-016': {
    story: 'In einem Porträt lernst du das Team hinter dem Produkt kennen: Ein unabhängiges Spin-off junger Universitätsforschender, die aus Überzeugung für Tierwohl und Klimaschutz forschen.',
    modules: {
      2: {
        legit: 'Unabhängige Universitätsforschende statt eines anonymen Großkonzerns bauen mein Misstrauen gegenüber der Industrie ab.',
        barrier: 'Einem kleinen Start-up fehlt vielleicht die jahrzehntelange Erfahrung in großtechnischer Lebensmittelsicherheit.',
        driver: 'Die wissenschaftliche Leidenschaft und ehrliche Mission des Forschungsteams schaffen bei mir großes Vertrauen.'
      },
      5: {
        legit: 'Ein engagiertes Wissenschafts-Start-up zu unterstützen, kommt in meinem Freundeskreis definitiv positiv an.',
        barrier: 'Start-up-Storytelling klingt für mich oft nach hipper Marketing-Blase.',
        driver: 'Ich unterstütze gerne mutige Pioniere, die unsere Ernährung sinnvoll voranbringen.'
      }
    }
  },
  'S-017': {
    story: 'Hinter dem Produkt steht ein traditionsreicher, seit Jahrzehnten bekannter Lebensmittelhersteller mit etablierten Qualitätskontrollen und strengen Sicherheitsstandards.',
    modules: {
      2: {
        legit: 'Ein bekannter Traditionshersteller mit einem Ruf, den er nicht riskieren darf, nimmt mir meine Skepsis.',
        barrier: 'Großen Lebensmittelkonzernen geht es am Ende vor allem um Gewinnmargen und Marktmacht.',
        driver: 'Jahrzehntelange Erfahrung in der Lebensmittelproduktion gibt mir ein verlässliches Gefühl von Kompetenz.'
      },
      1: {
        legit: 'Die professionellen Qualitäts- und Hygienekontrollen eines großen Herstellers räumen meine Sicherheitsbedenken aus.',
        barrier: 'Industrielle Großproduktion weckt bei mir immer Zweifel an der Natürlichkeit.',
        driver: 'Erprobte Lebensmittelsicherheit auf höchstem Industriestandard überzeugt mich.'
      }
    }
  },
  'S-018': {
    story: 'Du scannst den QR-Code auf der Packung mit deinem Smartphone: Sofort siehst du alle Laborwerte der aktuellen Charge, die komplette Lieferkette und die genaue Zusammensetzung der pflanzlichen Nährlösung.',
    modules: {
      2: {
        legit: 'Wer wirklich jede Zutat und jeden Laborwert per QR-Code offenlegt, hat nichts zu verbergen – meine Skepsis verschwindet.',
        barrier: 'Digitale Daten auf einer Webseite lassen sich vom Hersteller doch beliebig schönfärben.',
        driver: 'Diese lückenlose Offenlegung schafft für mich vorbildliche Transparenz und Glaubwürdigkeit!'
      },
      1: {
        legit: 'Der direkte Blick in die geprüften Laborwerte der Charge nimmt mir meine gesundheitlichen Bedenken.',
        barrier: 'Die lange Liste an Nährlösungs-Komponenten erinnert mich erst recht an ein Laborprodukt.',
        driver: 'Jede Charge einzeln geprüft und einsehbar – sicherer geht es kaum.'
      },
      6: {
        legit: 'Mit einem schnellen Scan beim Einkaufen habe ich sofort alle Infos parat, ohne lange suchen zu müssen.',
        barrier: 'Ich habe im Alltag keine Lust, beim Einkaufen erst QR-Codes und Tabellen am Handy zu studieren.',
        driver: 'Praktisch und modern: Alle Fakten in Sekundenschnelle auf dem Smartphone.'
      }
    }
  },
  'S-019': {
    story: 'Beim schnellen Einkauf im bekannten Discounter (Aldi / Lidl / Rewe) entdeckst du das Produkt fest gelistet im Wochensortiment zu familienfreundlichen Konditionen.',
    modules: {
      6: {
        legit: 'Wenn es sogar im normalen Discounter um die Ecke liegt, ist es endgültig alltagstauglich und bezahlbar.',
        barrier: 'Im Discounter-Regal wirkt es auf mich wie anonyme Massenware.',
        driver: 'Perfekt für den täglichen Einkauf ohne Umwege und ohne Aufpreis!'
      },
      4: {
        legit: 'Die vertraute Umgebung meines Alltags-Supermarkts nimmt dem Produkt jede Fremdartigkeit.',
        barrier: 'Zwischen Billigangeboten verliert diese Innovation für mich ihren Wert.',
        driver: 'Bodenständig und für jeden zugänglich präsentiert – das gefällt mir.'
      }
    }
  },
  'S-021': {
    story: 'In der berühmten Feinkostabteilung eines Traditionskaufhauses wie dem KaDeWe wird das kultivierte Fleisch an der Frischetheke als besondere kulinarische Delikatesse präsentiert.',
    modules: {
      5: {
        legit: 'Die Aufnahme in eine legendäre Feinkostabteilung adelt das Produkt und hebt jede soziale Skepsis auf.',
        barrier: 'In einer Luxus-Feinkostabteilung fühle ich mich als normaler Käufer fehl am Platz.',
        driver: 'Eine echte Delikatesse mit Prestige – ideal für einen besonderen Anlass!'
      },
      3: {
        legit: 'Feinkost-Einkäufer lassen nur geschmacklich herausragende Produkte in ihre Theke.',
        barrier: 'Nur weil etwas als Luxus-Delikatesse verkauft wird, muss es mir noch lange nicht schmecken.',
        driver: 'Die Feinkost-Präsentation verspricht höchsten kulinarischen Genuss.'
      }
    }
  },
  'S-023': {
    story: 'Ein offizielles staatliches Sicherheits-Zertifikat auf der Packung bestätigt: „Amtlich als 100 % sicher, rückstandsfrei und vollwertig für den menschlichen Verzehr eingestuft.“',
    modules: {
      1: {
        legit: 'Das staatliche Freigabe-Zertifikat auf Rückstandsfreiheit nimmt mir meine Angst vor gesundheitlichen Risiken.',
        barrier: 'Ein amtlicher Stempel allein nimmt mir nicht das Bauchgefühl, dass Zellkultur unnatürlich ist.',
        driver: 'Amtlich geprüfte Sicherheit und 100 % Rückstandsfreiheit geben mir ein gutes Gefühl.'
      }
    }
  },
  'S-024': {
    story: 'Das Produkt trägt das unabhängige Prüfsiegel bekannter Tierschutz- und Umweltorganisationen: „Zertifiziert 100 % ohne Tierleid und ohne Schlachtung gewonnen.“',
    modules: {
      2: {
        legit: 'Wenn unabhängige Tierschutz-NGOs das Produkt zertifizieren, glaube ich den ethischen Versprechen der Hersteller.',
        barrier: 'Auch hinter manchen Siegeln stecken wirtschaftliche Kooperationen, denen ich nicht blind vertraue.',
        driver: 'Das unabhängige Tierschutz-Siegel schafft für mich höchste ethische Glaubwürdigkeit!'
      },
      6: {
        legit: 'Das Siegel gibt mir im Einkaufsalltag eine sofort erkennbare Orientierungshilfe ohne langes Nachdenken.',
        barrier: 'Im Siegel-Dschungel auf Verpackungen blickt man im Alltag ohnehin kaum noch durch.',
        driver: 'Ein klarer Kompass beim Einkaufen: 100 % Fleischgenuss komplett ohne Tierleid.'
      }
    }
  },
  'S-025': {
    story: 'Ein unabhängiges ISO- und Lebensmittelhygiene-Zertifikat bescheinigt: „Produziert unter strengsten Reinraum-Standards – steriler und sauberer als jeder konventionelle Schlachthof.“',
    modules: {
      1: {
        legit: 'Der Vergleich mit den hygienischen Risiken im Schlachthof überzeugt mich: Reinraum-Standards bauen meine Sicherheitsbarriere ab.',
        barrier: 'Das Wort „Reinraum-Standard“ klingt für mich nach Chipfabrik statt nach natürlichem Essen.',
        driver: 'ISO-zertifizierte Sauberkeit ohne Schlachthof-Kontamination ist für mich ein riesiger Hygiene-Pluspunkt!'
      }
    }
  },
  'S-026': {
    story: 'Über einen digitalen Blockchain-Pass auf der Packung kannst du lückenlos nachverfolgen, von welchem gesunden Spendertier auf welchem regionalen Hof die ursprünglichen Zellen schmerzfrei entnommen wurden.',
    modules: {
      2: {
        legit: 'Zu sehen, von welchem echten Spendertier und Hof die Zellen stammen, nimmt dem Ganzen die anonyme Labor-Intransparenz.',
        barrier: 'Trotz Herkunftsnachweis der ersten Zelle findet die eigentliche Vermehrung am Ende doch wieder in einer Fabrik statt.',
        driver: 'Lückenlose Rückverfolgbarkeit bis zum gesunden Spendertier schafft für mich echtes Vertrauen!'
      },
      1: {
        legit: 'Dass die Zellen von einem nachweislich gesunden, tierärztlich begleiteten Tier stammen, gibt mir biologische Sicherheit.',
        barrier: 'Der Gedanke an eine Zellbiopsie am Tier bleibt für mich trotzdem ungewohnt.',
        driver: 'Geprüfte Tiergesundheit an der Quelle sorgt für ein reines, sicheres Endprodukt.'
      }
    }
  },
  'S-027': {
    story: 'Auf der Vorderseite der Packung leuchtet ein Versprechen: „100 % Geld-zurück- & Geschmacksgarantie – wenn Ihnen Geschmack oder Zubereitung nicht zusagen, erhalten Sie unkompliziert Ihr Geld zurück.“',
    modules: {
      3: {
        legit: 'Ein Hersteller gibt nur dann eine Geschmacksgarantie, wenn das Produkt geschmacklich wirklich überzeugt.',
        barrier: 'Das Geld zurückzubekommen nützt mir wenig, wenn das Abendessen am Ende trotzdem nicht geschmeckt hat.',
        driver: 'So ein selbstbewusstes Geschmacksversprechen macht mich neugierig aufs Probieren!'
      },
      6: {
        legit: 'Mit der Geld-zurück-Garantie gehe ich beim Erstkauf keinerlei finanzielles Risiko ein – meine Alltagshürde fällt weg.',
        barrier: 'Den Kassenbon einzureichen und Formulare auszufüllen, wäre mir im Alltag viel zu umständlich.',
        driver: 'Komplett risikofrei ausprobieren – einfacher kann man den ersten Test nicht machen!'
      }
    }
  }
};

/**
 * Liefert die geschichtliche Szene und für jedes der 6 Module die passenden Hypertext-Antworten
 * (legit, barrier, driver) für einen gegebenen Reiz.
 */
export function getDecisionTreeContentForStimulus(stim) {
  if (!stim) return null;

  const custom = STIMULUS_STORY_DATA[stim.id];
  const defaultStory = `Während du dich im Alltag weiter mit dem Thema beschäftigst, begegnet dir ein neuer Impuls: „${stim.name}“. ${stim.content ? stim.content : 'Du hältst kurz inne und überlegst, was dieser Eindruck für deine Entscheidung bedeutet.'}`;

  const story = custom?.story || defaultStory;
  const modulesContent = {};

  for (let mId = 1; mId <= 6; mId++) {
    const modCustom = custom?.modules?.[mId];
    const modDefault = MODULE_DEFAULT_RESPONSES[mId];
    modulesContent[mId] = {
      legit: modCustom?.legit || modDefault.legit(stim.name),
      barrier: modCustom?.barrier || modDefault.barrier(stim.name),
      driver: modCustom?.driver || modDefault.driver(stim.name)
    };
  }

  return {
    story,
    modules: modulesContent
  };
}
