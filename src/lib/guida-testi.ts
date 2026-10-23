/* ==============================================================================
 *  TITOLO FILE      : guida-testi.ts - Testi della guida in-app (IT, EN, DE, ES)
 *  PERCORSO         : src/lib/guida-testi.ts
 *  PROGETTO         : ppwr-reusability-hub (PPWR Reusability Hub)
 *  REVISIONE        : 02
 *  DATA E ORA REV.  : 2026-10-23 20:55 (ora italiana)
 * ------------------------------------------------------------------------------
 *  DESCRIZIONE
 *    Testi della guida che si apre dal pulsante «i» nell'intestazione, nelle 4 lingue
 *    dell'app. Allineati al comportamento reale del programma (verificato sul codice):
 *    OTP 10 minuti, crediti PDF scalati a PDF riuscito, esito, nome file, import JSON.
 *    Se cambia il comportamento dell'app, aggiornare qui le 4 lingue.
 *    Nota: valutazioni, checklist, report e PDF restano in italiano (testo normativo).
 * ------------------------------------------------------------------------------
 *  STORICO REVISIONI (dalla più recente)
 *    Rev. 02 | 2026-10-23 20:55 | Note della checklist dichiarate facoltative (anche per N.A.) nelle 4 lingue.
 *    Rev. 01 | 2026-10-23 20:49 | Creazione del file.
 * ============================================================================== */
import type { Lingua } from "@/lib/i18n";

export interface SezioneGuida {
  titolo: string;
  righe: string[];
}
export interface TestiGuida {
  bottone: string;
  titolo: string;
  intro: string;
  notaLingua: string;
  sezioni: SezioneGuida[];
}

export const GUIDA: Record<Lingua, TestiGuida> = {
  it: {
    bottone: "Guida",
    titolo: "Guida all'uso",
    intro: "PPWR Riutilizzo — valutazione della riutilizzabilità degli imballaggi (Reg. UE 2025/40). Tocca un titolo per aprire la sezione.",
    notaLingua: "La lingua scelta cambia le schermate di accesso, i messaggi, le email del codice e questa guida. Valutazioni, checklist, report e PDF restano in italiano.",
    sezioni: [
      {
        titolo: "1. Accesso e licenza",
        righe: [
          "Inserisci la tua email e premi «Invia codice»: ricevi un codice di 6 cifre valido 10 minuti. Puoi richiederlo al massimo 3 volte ogni 24 ore; dopo 5 codici errati devi richiederne uno nuovo.",
          "Dopo la verifica inserisci Chiave di licenza e codice PUK ricevuti all'acquisto. Spazi o simboli di elenco incollati per errore vengono rimossi in automatico.",
          "Alla prima attivazione accetti le condizioni d'uso: l'accettazione viene registrata con data, PUK e versione del testo.",
          "La licenza viene ricontrollata a ogni cambio pagina: se è scaduta o sospesa vieni portato alla pagina «Licenza non valida».",
        ],
      },
      {
        titolo: "2. Piani e crediti PDF",
        righe: [
          "070RiusoPPWR-002: 2 giorni, 1 PDF. 070RiusoPPWR-030: 30 giorni, 20 PDF. 070RiusoPPWR-365: 365 giorni, 300 PDF.",
          "I crediti sono legati al tuo PUK. Il contatore è il pallino sul pulsante «Scarica PDF» (rosso quando ne resta uno o nessuno); non compare se i PDF sono illimitati.",
          "Il credito si scala solo quando il PDF è stato generato con successo: se la generazione fallisce, il credito non viene toccato.",
          "Quando resta l'ultimo PDF compare un avviso giallo. A crediti esauriti compare la finestra «Export PDF esauriti»: PDF e pulsante «Stampa» sono bloccati, ma puoi continuare a consultare e modificare le valutazioni e a usare i file JSON.",
        ],
      },
      {
        titolo: "3. Barra superiore",
        righe: [
          "Sono sempre visibili l'email connessa, il selettore lingua (IT, EN, DE, ES), «Impostazioni generali ditta» e questa guida.",
          "«Chiudi applicazione» esce dalla sessione e prova a chiudere la scheda; se il browser non lo permette, torni alla schermata di accesso.",
          "«Esci» chiude la sessione ma conserva licenza e PUK su questo dispositivo: al rientro basta un nuovo codice via email.",
          "«Esci e cancella tutto» rimuove da questo dispositivo email, licenza, PUK e consenso: usalo sui computer condivisi o per spostare il PUK. Non cancella le valutazioni né i dati ditta.",
        ],
      },
      {
        titolo: "4. Impostazioni generali ditta",
        righe: [
          "Ragione sociale, P.IVA / codice fiscale, indirizzo, telefono, email, sito web, responsabile tecnico con ruolo e logo (immagine fino a 1,5 MB).",
          "Questi dati compaiono nell'intestazione e nella firma di tutti i report. Sono salvati nel browser e puoi modificarli quando vuoi.",
        ],
      },
      {
        titolo: "5. Elenco delle valutazioni",
        righe: [
          "Cerca per titolo, tipologia o modello. Ogni riga mostra l'esito: Idoneo, Non idoneo o Incompleto.",
          "Azioni di riga: Vedi, Modifica, Duplica (copia per varianti simili), Stampa / PDF, Esporta JSON, Cancella (con conferma).",
        ],
      },
      {
        titolo: "6. Scheda di valutazione",
        righe: [
          "Dati dell'imballo: titolo, tipologia (IBC, fusti, pallet, cassetta, big bag, tanica, cisternetta, altro), modello, materiale, dimensioni, capacità, settore d'uso e descrizione.",
          "Rotazioni previste ed effettuate: l'indice di utilizzo è rotazioni effettuate ÷ rotazioni previste × 100.",
          "Sistema di riutilizzo: tipo (circuito chiuso, aperto/pooling, misto), identificazione e tracciabilità, evidenze documentali.",
          "Checklist di 23 requisiti in 3 gruppi: Articolo 11 (9), Allegato VI parte B (8), sistema di riutilizzo S1–S6 (6). Per ciascuno scegli SÌ, NO o N.A. Le note sono facoltative: usale per le evidenze o, se vuoi, per spiegare un N.A.",
        ],
      },
      {
        titolo: "7. Come si calcola l'esito",
        righe: [
          "Anche un solo NO: NON IDONEO.",
          "Altrimenti, se manca qualche risposta o non c'è nemmeno un SÌ (tutte N.A.): INCOMPLETO.",
          "Altrimenti: IDONEO.",
        ],
      },
      {
        titolo: "8. Report A4 e firma",
        righe: [
          "«Vedi» apre il report: intestazione della ditta, scheda dell'imballo, sistema di riutilizzo, tabelle dei requisiti, esito e conclusioni.",
          "Il testo delle conclusioni si modifica direttamente a video prima di scaricare. In fondo trovi lo spazio per luogo, data, timbro e firma del responsabile tecnico.",
        ],
      },
      {
        titolo: "9. Nome dei file e backup JSON",
        righe: [
          "Formato: AAAAMMGGHHmm-RIUTILIZZO-PPWR-titolo, con le prime 20 lettere del titolo (accenti tolti, simboli sostituiti da _). Esempio: 202610231845-RIUTILIZZO-PPWR-IBC_1000L_Chimico.pdf",
          "Le valutazioni stanno solo nel tuo browser. Se svuoti i dati del browser le perdi: esporta spesso il JSON come copia di sicurezza.",
          "«Importa JSON» accetta solo file con nome *-RIUTILIZZO-PPWR-*.json, firma dell'applicazione, versione e 23 voci valide; il file importato diventa una nuova valutazione.",
        ],
      },
      {
        titolo: "10. Messaggi di errore frequenti",
        righe: [
          "Accesso: ERR010 email non valida · ERR011 troppe richieste di codice · ERR012 codice errato o scaduto · ERR013 invio email non riuscito · ERR017 email non raggiungibile · ERR015 sessione scaduta, rientra con la tua email.",
          "Licenza: ERR101 licenza inesistente o disattivata · ERR103 licenza scaduta · ERR201 PUK inesistente · ERR202 PUK già associato a un altro utente · ERR203 PUK di un altro prodotto · ERR204 PUK non associato alla licenza.",
        ],
      },
    ],
  },

  en: {
    bottone: "Help",
    titolo: "User guide",
    intro: "PPWR Reuse — assessment of packaging reusability (EU Reg. 2025/40). Tap a title to open the section.",
    notaLingua: "The chosen language changes the sign-in screens, messages, code emails and this guide. Assessments, checklists, reports and PDFs stay in Italian.",
    sezioni: [
      {
        titolo: "1. Sign-in and licence",
        righe: [
          "Enter your email and press «Send code»: you receive a 6-digit code valid for 10 minutes. You can request it at most 3 times every 24 hours; after 5 wrong codes you must request a new one.",
          "After verification, enter the Licence key and PUK code received at purchase. Spaces or bullet symbols pasted by mistake are removed automatically.",
          "At first activation you accept the terms of use: the acceptance is recorded with date, PUK and text version.",
          "The licence is re-checked at every page change: if it has expired or been suspended you are taken to the «Invalid licence» page.",
        ],
      },
      {
        titolo: "2. Plans and PDF credits",
        righe: [
          "070RiusoPPWR-002: 2 days, 1 PDF. 070RiusoPPWR-030: 30 days, 20 PDFs. 070RiusoPPWR-365: 365 days, 300 PDFs.",
          "Credits are tied to your PUK. The counter is the dot on the «Download PDF» button (red when one or none is left); it is not shown if PDFs are unlimited.",
          "A credit is deducted only when the PDF has been generated successfully: if generation fails, your credit is untouched.",
          "When only the last PDF is left, a yellow warning appears. When credits run out, the «PDF exports exhausted» window appears: PDF and the «Print» button are blocked, but you can keep viewing and editing assessments and using JSON files.",
        ],
      },
      {
        titolo: "3. Top bar",
        righe: [
          "Always visible: the connected email, the language selector (IT, EN, DE, ES), «Company general settings» and this guide.",
          "«Close application» signs you out and tries to close the tab; if the browser does not allow it, you return to the sign-in screen.",
          "«Sign out» ends the session but keeps the licence and PUK on this device: when you come back, a new email code is enough.",
          "«Sign out and clear everything» removes the email, licence, PUK and consent from this device: use it on shared computers or to move the PUK. It does not delete assessments or company data.",
        ],
      },
      {
        titolo: "4. Company general settings",
        righe: [
          "Company name, VAT / tax code, address, phone, email, website, technical manager with role, and logo (image up to 1.5 MB).",
          "These details appear in the header and signature of every report. They are stored in your browser and you can change them at any time.",
        ],
      },
      {
        titolo: "5. List of assessments",
        righe: [
          "Search by title, type or model. Each row shows the outcome: Suitable, Not suitable or Incomplete.",
          "Row actions: View, Edit, Duplicate (copy for similar variants), Print / PDF, Export JSON, Delete (with confirmation).",
        ],
      },
      {
        titolo: "6. Assessment form",
        righe: [
          "Packaging data: title, type (IBC, drums, pallets, crate, big bag, jerrycan, tank, other), model, material, dimensions, capacity, sector of use and description.",
          "Planned and completed rotations: the utilisation index is completed rotations ÷ planned rotations × 100.",
          "Reuse system: type (closed loop, open/pooling, mixed), identification and traceability, supporting documents.",
          "Checklist of 23 requirements in 3 groups: Article 11 (9), Annex VI part B (8), reuse system S1–S6 (6). For each one choose YES, NO or N/A. Notes are optional: use them for evidence or, if you wish, to explain an N/A.",
        ],
      },
      {
        titolo: "7. How the outcome is calculated",
        righe: [
          "Even a single NO: NOT SUITABLE.",
          "Otherwise, if any answer is missing or there is not a single YES (all N/A): INCOMPLETE.",
          "Otherwise: SUITABLE.",
        ],
      },
      {
        titolo: "8. A4 report and signature",
        righe: [
          "«View» opens the report: company header, packaging data sheet, reuse system, requirement tables, outcome and conclusions.",
          "The conclusions text can be edited directly on screen before downloading. At the bottom there is space for place, date, stamp and signature of the technical manager.",
        ],
      },
      {
        titolo: "9. File names and JSON backup",
        righe: [
          "Format: YYYYMMDDHHmm-RIUTILIZZO-PPWR-title, using the first 20 letters of the title (accents removed, symbols replaced by _). Example: 202610231845-RIUTILIZZO-PPWR-IBC_1000L_Chimico.pdf",
          "Assessments are stored only in your browser. If you clear the browser data you lose them: export the JSON often as a backup.",
          "«Import JSON» accepts only files named *-RIUTILIZZO-PPWR-*.json with the application signature, version and 23 valid items; the imported file becomes a new assessment.",
        ],
      },
      {
        titolo: "10. Common error messages",
        righe: [
          "Sign-in: ERR010 invalid email · ERR011 too many code requests · ERR012 wrong or expired code · ERR013 email could not be sent · ERR017 email unreachable · ERR015 session expired, sign in again with your email.",
          "Licence: ERR101 licence missing or deactivated · ERR103 licence expired · ERR201 PUK not found · ERR202 PUK already linked to another user · ERR203 PUK for another product · ERR204 PUK not linked to the licence.",
        ],
      },
    ],
  },

  de: {
    bottone: "Hilfe",
    titolo: "Benutzerhandbuch",
    intro: "PPWR Wiederverwendung — Bewertung der Wiederverwendbarkeit von Verpackungen (EU-Verordnung 2025/40). Tippen Sie auf einen Titel, um den Abschnitt zu öffnen.",
    notaLingua: "Die gewählte Sprache ändert die Anmeldeseiten, Meldungen, Code-E-Mails und dieses Handbuch. Bewertungen, Checklisten, Berichte und PDFs bleiben auf Italienisch.",
    sezioni: [
      {
        titolo: "1. Anmeldung und Lizenz",
        righe: [
          "Geben Sie Ihre E-Mail-Adresse ein und drücken Sie «Code senden»: Sie erhalten einen 6-stelligen Code, der 10 Minuten gültig ist. Sie können ihn höchstens 3-mal in 24 Stunden anfordern; nach 5 falschen Codes müssen Sie einen neuen anfordern.",
          "Geben Sie nach der Bestätigung den beim Kauf erhaltenen Lizenzschlüssel und den PUK-Code ein. Versehentlich eingefügte Leerzeichen oder Aufzählungszeichen werden automatisch entfernt.",
          "Bei der ersten Aktivierung akzeptieren Sie die Nutzungsbedingungen: Die Zustimmung wird mit Datum, PUK und Textversion gespeichert.",
          "Die Lizenz wird bei jedem Seitenwechsel erneut geprüft: Ist sie abgelaufen oder gesperrt, gelangen Sie zur Seite «Lizenz ungültig».",
        ],
      },
      {
        titolo: "2. Pläne und PDF-Guthaben",
        righe: [
          "070RiusoPPWR-002: 2 Tage, 1 PDF. 070RiusoPPWR-030: 30 Tage, 20 PDFs. 070RiusoPPWR-365: 365 Tage, 300 PDFs.",
          "Das Guthaben ist an Ihren PUK gebunden. Der Zähler ist der Punkt auf der Schaltfläche «PDF herunterladen» (rot, wenn noch eines oder keines übrig ist); er wird nicht angezeigt, wenn PDFs unbegrenzt sind.",
          "Ein Guthaben wird erst abgezogen, wenn das PDF erfolgreich erstellt wurde: Schlägt die Erstellung fehl, bleibt Ihr Guthaben unberührt.",
          "Wenn nur noch das letzte PDF übrig ist, erscheint ein gelber Hinweis. Ist das Guthaben aufgebraucht, erscheint das Fenster «PDF-Exporte aufgebraucht»: PDF und die Schaltfläche «Drucken» sind gesperrt, Sie können aber weiter Bewertungen ansehen, bearbeiten und JSON-Dateien verwenden.",
        ],
      },
      {
        titolo: "3. Obere Leiste",
        righe: [
          "Immer sichtbar: die angemeldete E-Mail-Adresse, die Sprachauswahl (IT, EN, DE, ES), «Allgemeine Firmeneinstellungen» und dieses Handbuch.",
          "«Anwendung schließen» meldet Sie ab und versucht, den Tab zu schließen; erlaubt der Browser das nicht, kehren Sie zur Anmeldeseite zurück.",
          "«Abmelden» beendet die Sitzung, behält aber Lizenz und PUK auf diesem Gerät: Bei der Rückkehr genügt ein neuer E-Mail-Code.",
          "«Abmelden und alles löschen» entfernt E-Mail, Lizenz, PUK und Zustimmung von diesem Gerät: Nutzen Sie es auf gemeinsam genutzten Computern oder um den PUK zu übertragen. Bewertungen und Firmendaten werden nicht gelöscht.",
        ],
      },
      {
        titolo: "4. Allgemeine Firmeneinstellungen",
        righe: [
          "Firmenname, USt-IdNr. / Steuernummer, Adresse, Telefon, E-Mail, Website, technischer Verantwortlicher mit Funktion und Logo (Bild bis 1,5 MB).",
          "Diese Daten erscheinen in Kopfzeile und Unterschrift jedes Berichts. Sie werden in Ihrem Browser gespeichert und können jederzeit geändert werden.",
        ],
      },
      {
        titolo: "5. Liste der Bewertungen",
        righe: [
          "Suche nach Titel, Typ oder Modell. Jede Zeile zeigt das Ergebnis: Geeignet, Nicht geeignet oder Unvollständig.",
          "Aktionen pro Zeile: Ansehen, Bearbeiten, Duplizieren (Kopie für ähnliche Varianten), Drucken / PDF, JSON exportieren, Löschen (mit Bestätigung).",
        ],
      },
      {
        titolo: "6. Bewertungsbogen",
        righe: [
          "Verpackungsdaten: Titel, Typ (IBC, Fässer, Paletten, Kiste, Big Bag, Kanister, Tank, Sonstiges), Modell, Material, Abmessungen, Fassungsvermögen, Einsatzbereich und Beschreibung.",
          "Geplante und durchgeführte Umläufe: Der Nutzungsindex ist durchgeführte Umläufe ÷ geplante Umläufe × 100.",
          "Wiederverwendungssystem: Art (geschlossener Kreislauf, offener Kreislauf/Pooling, gemischt), Kennzeichnung und Rückverfolgbarkeit, Nachweise.",
          "Checkliste mit 23 Anforderungen in 3 Gruppen: Artikel 11 (9), Anhang VI Teil B (8), Wiederverwendungssystem S1–S6 (6). Wählen Sie jeweils JA, NEIN oder N.A. Notizen sind optional: Nutzen Sie sie für Nachweise oder, wenn Sie möchten, um ein N.A. zu erläutern.",
        ],
      },
      {
        titolo: "7. So wird das Ergebnis berechnet",
        righe: [
          "Schon ein einziges NEIN: NICHT GEEIGNET.",
          "Andernfalls, wenn eine Antwort fehlt oder kein einziges JA vorhanden ist (alle N.A.): UNVOLLSTÄNDIG.",
          "Andernfalls: GEEIGNET.",
        ],
      },
      {
        titolo: "8. A4-Bericht und Unterschrift",
        righe: [
          "«Ansehen» öffnet den Bericht: Firmenkopf, Verpackungsdatenblatt, Wiederverwendungssystem, Anforderungstabellen, Ergebnis und Schlussfolgerungen.",
          "Der Text der Schlussfolgerungen kann vor dem Herunterladen direkt am Bildschirm bearbeitet werden. Unten ist Platz für Ort, Datum, Stempel und Unterschrift des technischen Verantwortlichen.",
        ],
      },
      {
        titolo: "9. Dateinamen und JSON-Sicherung",
        righe: [
          "Format: JJJJMMTTHHmm-RIUTILIZZO-PPWR-Titel, mit den ersten 20 Buchstaben des Titels (Akzente entfernt, Sonderzeichen durch _ ersetzt). Beispiel: 202610231845-RIUTILIZZO-PPWR-IBC_1000L_Chimico.pdf",
          "Bewertungen werden nur in Ihrem Browser gespeichert. Löschen Sie die Browserdaten, gehen sie verloren: Exportieren Sie das JSON regelmäßig als Sicherung.",
          "«JSON importieren» akzeptiert nur Dateien mit dem Namen *-RIUTILIZZO-PPWR-*.json, Anwendungssignatur, Version und 23 gültigen Einträgen; die importierte Datei wird zu einer neuen Bewertung.",
        ],
      },
      {
        titolo: "10. Häufige Fehlermeldungen",
        righe: [
          "Anmeldung: ERR010 ungültige E-Mail · ERR011 zu viele Code-Anfragen · ERR012 falscher oder abgelaufener Code · ERR013 E-Mail konnte nicht gesendet werden · ERR017 E-Mail nicht erreichbar · ERR015 Sitzung abgelaufen, erneut mit Ihrer E-Mail anmelden.",
          "Lizenz: ERR101 Lizenz nicht vorhanden oder deaktiviert · ERR103 Lizenz abgelaufen · ERR201 PUK nicht vorhanden · ERR202 PUK bereits einem anderen Benutzer zugeordnet · ERR203 PUK für ein anderes Produkt · ERR204 PUK nicht mit der Lizenz verknüpft.",
        ],
      },
    ],
  },

  es: {
    bottone: "Ayuda",
    titolo: "Guía de uso",
    intro: "PPWR Reutilización — evaluación de la reutilizabilidad de envases (Reglamento UE 2025/40). Toca un título para abrir la sección.",
    notaLingua: "El idioma elegido cambia las pantallas de acceso, los mensajes, los correos del código y esta guía. Evaluaciones, listas de verificación, informes y PDF permanecen en italiano.",
    sezioni: [
      {
        titolo: "1. Acceso y licencia",
        righe: [
          "Introduce tu correo y pulsa «Enviar código»: recibes un código de 6 cifras válido durante 10 minutos. Puedes pedirlo como máximo 3 veces cada 24 horas; tras 5 códigos erróneos debes pedir uno nuevo.",
          "Tras la verificación, introduce la Clave de licencia y el código PUK recibidos en la compra. Los espacios o símbolos de lista pegados por error se eliminan automáticamente.",
          "En la primera activación aceptas las condiciones de uso: la aceptación se registra con fecha, PUK y versión del texto.",
          "La licencia se vuelve a comprobar en cada cambio de página: si ha caducado o está suspendida, pasas a la página «Licencia no válida».",
        ],
      },
      {
        titolo: "2. Planes y créditos PDF",
        righe: [
          "070RiusoPPWR-002: 2 días, 1 PDF. 070RiusoPPWR-030: 30 días, 20 PDF. 070RiusoPPWR-365: 365 días, 300 PDF.",
          "Los créditos están vinculados a tu PUK. El contador es el círculo del botón «Descargar PDF» (rojo cuando queda uno o ninguno); no aparece si los PDF son ilimitados.",
          "El crédito se descuenta solo cuando el PDF se ha generado correctamente: si la generación falla, tu crédito no se toca.",
          "Cuando queda el último PDF aparece un aviso amarillo. Al agotarse los créditos aparece la ventana «Exportaciones PDF agotadas»: el PDF y el botón «Imprimir» quedan bloqueados, pero puedes seguir consultando y editando evaluaciones y usando archivos JSON.",
        ],
      },
      {
        titolo: "3. Barra superior",
        righe: [
          "Siempre visibles: el correo conectado, el selector de idioma (IT, EN, DE, ES), «Ajustes generales de la empresa» y esta guía.",
          "«Cerrar aplicación» cierra la sesión e intenta cerrar la pestaña; si el navegador no lo permite, vuelves a la pantalla de acceso.",
          "«Salir» cierra la sesión pero conserva licencia y PUK en este dispositivo: al volver basta un nuevo código por correo.",
          "«Salir y borrar todo» elimina de este dispositivo correo, licencia, PUK y consentimiento: úsalo en ordenadores compartidos o para trasladar el PUK. No borra las evaluaciones ni los datos de la empresa.",
        ],
      },
      {
        titolo: "4. Ajustes generales de la empresa",
        righe: [
          "Razón social, NIF / CIF, dirección, teléfono, correo, sitio web, responsable técnico con cargo y logotipo (imagen de hasta 1,5 MB).",
          "Estos datos aparecen en el encabezado y en la firma de todos los informes. Se guardan en tu navegador y puedes modificarlos cuando quieras.",
        ],
      },
      {
        titolo: "5. Lista de evaluaciones",
        righe: [
          "Busca por título, tipo o modelo. Cada fila muestra el resultado: Idóneo, No idóneo o Incompleto.",
          "Acciones de fila: Ver, Editar, Duplicar (copia para variantes similares), Imprimir / PDF, Exportar JSON, Borrar (con confirmación).",
        ],
      },
      {
        titolo: "6. Ficha de evaluación",
        righe: [
          "Datos del envase: título, tipo (IBC, bidones, palés, caja, big bag, bidón pequeño, cisterna pequeña, otro), modelo, material, dimensiones, capacidad, sector de uso y descripción.",
          "Rotaciones previstas y realizadas: el índice de utilización es rotaciones realizadas ÷ rotaciones previstas × 100.",
          "Sistema de reutilización: tipo (circuito cerrado, abierto/pooling, mixto), identificación y trazabilidad, evidencias documentales.",
          "Lista de verificación de 23 requisitos en 3 grupos: Artículo 11 (9), Anexo VI parte B (8), sistema de reutilización S1–S6 (6). Para cada uno elige SÍ, NO o N.A. Las notas son opcionales: úsalas para las evidencias o, si quieres, para explicar un N.A.",
        ],
      },
      {
        titolo: "7. Cómo se calcula el resultado",
        righe: [
          "Basta un solo NO: NO IDÓNEO.",
          "Si no, cuando falta alguna respuesta o no hay ni un solo SÍ (todo N.A.): INCOMPLETO.",
          "Si no: IDÓNEO.",
        ],
      },
      {
        titolo: "8. Informe A4 y firma",
        righe: [
          "«Ver» abre el informe: encabezado de la empresa, ficha del envase, sistema de reutilización, tablas de requisitos, resultado y conclusiones.",
          "El texto de las conclusiones se edita directamente en pantalla antes de descargar. Al final hay espacio para lugar, fecha, sello y firma del responsable técnico.",
        ],
      },
      {
        titolo: "9. Nombres de archivo y copia JSON",
        righe: [
          "Formato: AAAAMMDDHHmm-RIUTILIZZO-PPWR-título, con las primeras 20 letras del título (sin acentos, símbolos sustituidos por _). Ejemplo: 202610231845-RIUTILIZZO-PPWR-IBC_1000L_Chimico.pdf",
          "Las evaluaciones se guardan solo en tu navegador. Si borras los datos del navegador las pierdes: exporta el JSON con frecuencia como copia de seguridad.",
          "«Importar JSON» solo acepta archivos con nombre *-RIUTILIZZO-PPWR-*.json, firma de la aplicación, versión y 23 elementos válidos; el archivo importado se convierte en una evaluación nueva.",
        ],
      },
      {
        titolo: "10. Mensajes de error frecuentes",
        righe: [
          "Acceso: ERR010 correo no válido · ERR011 demasiadas solicitudes de código · ERR012 código erróneo o caducado · ERR013 no se pudo enviar el correo · ERR017 correo inalcanzable · ERR015 sesión caducada, vuelve a entrar con tu correo.",
          "Licencia: ERR101 licencia inexistente o desactivada · ERR103 licencia caducada · ERR201 PUK inexistente · ERR202 PUK ya asociado a otro usuario · ERR203 PUK de otro producto · ERR204 PUK no asociado a la licencia.",
        ],
      },
    ],
  },
};
