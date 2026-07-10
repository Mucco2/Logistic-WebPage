# ARAM – Pflichtprüfung vor dem Livegang

**Diese Datei nicht mit auf den Webserver laden.** Impressum und Datenschutzerklärung enthalten bewusst sichtbare Platzhalter. Die Website darf erst veröffentlicht werden, wenn alle Punkte mit Originalunterlagen geprüft wurden.

## Unternehmen und Pflichtangaben

- [ ] Vollständigen rechtlichen Namen, Rechtsform, vertretungsberechtigte Person und ladungsfähige Geschäftsanschrift eintragen. „ARAM“ ausdrücklich als Geschäftsbezeichnung bestätigen.
- [ ] USt-IdNr. `DE406845974` anhand des amtlichen Dokuments bestätigen.
- [ ] Die Nummer `74448055` im Originaldokument prüfen: exakte Bezeichnung, ausstellende Stelle und rechtliche Bedeutung feststellen. Bis dahin weder als „URN“ noch als Register- oder Lizenznummer veröffentlichen.
- [ ] Falls vorhanden: Registerart, Registergericht und Registernummer eintragen; andernfalls den Registerabschnitt entfernen.
- [ ] Prüfen, welche Transport-/Güterkraftverkehrserlaubnis für die tatsächlich angebotenen Fahrten erforderlich ist, und zuständige Aufsichts- oder Lizenzbehörde eintragen.
- [ ] Prüfen, ob eine verantwortliche Person nach § 18 Abs. 2 MStV genannt werden muss, insbesondere wegen des Blogs.
- [ ] Erklärung zur Verbraucherstreitbeilegung nach § 36 VSBG rechtlich passend formulieren lassen.
- [ ] AGB nur veröffentlichen, wenn kundenindividuell erstellt und rechtlich geprüft; andernfalls alle AGB-Links entfernen.

## Aussagen, Leistungen und Medien

- [ ] Fahrzeugangabe eindeutig formulieren: „bis 3,5 t zulässige Gesamtmasse“ ist nicht dasselbe wie 3,5 t Nutzlast. Nutzlast, Ladevolumen und Laderaummaße je Fahrzeug dokumentieren.
- [ ] Zielländer bestätigen und die Schweiz nicht als EU-Mitglied bezeichnen; Zollabwicklung gesondert erklären.
- [ ] Belege für Bewertungen, Kundenzahlen, Transportzahlen, Antwortzeiten, Festpreise, Garantien, Versicherungsumfang und Lieferzeiten ablegen oder die Aussagen entfernen.
- [ ] Versicherungs- und Lizenzangaben wortgetreu mit Police bzw. Genehmigung abgleichen.
- [ ] Für jedes Foto Urheber, Quelle, kommerzielle Lizenz und erlaubte Bearbeitung dokumentieren. Stockfotos nicht als eigenes Fahrzeug, Team oder Kundenauftrag darstellen.
- [ ] Öffnungszeiten und erreichbare Kontaktwege mit dem tatsächlichen Betrieb bestätigen.

## Datenschutz und Dienstleister

- [ ] Hosting-Anbieter, vollständige Anbieteranschrift, Serverstandort, konkrete Server-Logdaten und Löschfrist ermitteln; Auftragsverarbeitungsvertrag prüfen.
- [ ] Für Anfragen verbindliche Löschfristen festlegen und gesetzliche Aufbewahrungspflichten mit Steuerberatung oder Rechtsberatung abstimmen.
- [ ] E-Mail-Anbieter und Empfänger der Formulare dokumentieren; Auftragsverarbeitung und Löschkonzept prüfen.
- [ ] EmailJS-Vertrag, DPA, Unterauftragsverarbeiter, Serverstandorte und Rechtsgrundlage für eine mögliche USA-Übermittlung prüfen. Die Datenschutzerklärung behauptet bewusst noch keinen abgeschlossenen Vertrag oder Übermittlungsmechanismus.
- [ ] Entscheiden, ob das EmailJS-SDK weiterhin erst beim Absenden über jsDelivr geladen oder lokal bereitgestellt wird; Datenschutzerklärung danach anpassen.
- [ ] Zuständige deutsche Datenschutz-Aufsichtsbehörde anhand der endgültigen Geschäftsanschrift eintragen.
- [ ] Nach dem finalen Build technisch bestätigen: kein Google Analytics, keine Marketing-/Tracking-Cookies und keine Nutzung von `localStorage` oder `sessionStorage`.
- [ ] WhatsApp-Business-Nutzung, Verantwortlichkeiten, Nachrichtenaufbewahrung und Zugriffsrechte intern dokumentieren.

## Domain, Hosting und Funktion

- [ ] `https://lw-transport.de` als endgültige Hauptdomain bestätigen; HTTPS sowie Weiterleitungen zwischen www-/Nicht-www- und HTTP-/HTTPS-Version testen.
- [ ] Hosting so konfigurieren, dass unbekannte URLs wirklich mit HTTP-Status `404` und der Datei `404.html` ausgeliefert werden.
- [ ] `sitemap.xml` und `robots.txt` nach Livegang testen und die Sitemap in den verwendeten Webmaster-Tools einreichen.
- [ ] Formulare mit echten Testanfragen prüfen; EmailJS-Domainbeschränkung, Missbrauchsschutz und Rate-Limits einrichten.
- [ ] SPF, DKIM und DMARC für `lw-transport.de` konfigurieren und Zustellbarkeit testen.
- [ ] Sicherheitsheader (mindestens CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`) beim Hoster konfigurieren.
- [ ] Zusätzliche quadratische App-Icons in 192 × 192 und 512 × 512 px erstellen und anschließend `site.webmanifest` ergänzen.
- [ ] Mobile Darstellung, Tastaturbedienung, Kontrast, Ladezeit, interne Links und alle Platzhalter abschließend prüfen.
- [ ] Impressum und Datenschutzerklärung vor Veröffentlichung von einer für deutsches Recht qualifizierten Stelle prüfen lassen.
