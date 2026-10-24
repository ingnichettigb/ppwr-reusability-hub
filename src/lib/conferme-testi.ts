/* ==============================================================================
 *  TITOLO FILE      : conferme-testi.ts - Testi delle conferme di uscita e «Torna all'elenco»
 *  PERCORSO         : src/lib/conferme-testi.ts
 *  PROGETTO         : ppwr-reusability-hub (PPWR Reusability Hub)
 *  REVISIONE        : 01
 *  DATA E ORA REV.  : 2026-10-24 15:43 (ora italiana)
 * ------------------------------------------------------------------------------
 *  DESCRIZIONE
 *    Testi (IT, EN, DE, ES) delle finestre di conferma che precedono «Chiudi applicazione»,
 *    «Esci» ed «Esci e cancella tutto», e dell'etichetta «Torna all'elenco».
 *    Servono a evitare uscite involontarie dal programma.
 * ------------------------------------------------------------------------------
 *  STORICO REVISIONI (dalla più recente)
 *    Rev. 01 | 2026-10-24 15:43 | Creazione del file.
 * ============================================================================== */
import { useLingua, type Lingua } from "@/lib/i18n";

export type TipoConferma = "chiudi" | "esci" | "cancella";

export interface TestoConferma {
  titolo: string;
  intro: string;
  succede: string[];
  resta: string[];
  suggerimento: string;
  annulla: string;
  conferma: string;
}
export interface TestiConferme {
  tornaElenco: string;
  etichettaSuccede: string;
  etichettaResta: string;
  voci: Record<TipoConferma, TestoConferma>;
}

export const CONFERME: Record<Lingua, TestiConferme> = {
  it: {
    tornaElenco: "Torna all'elenco",
    etichettaSuccede: "Cosa succede",
    etichettaResta: "Cosa resta salvato",
    voci: {
      esci: {
        titolo: "Vuoi uscire dal programma?",
        intro: "Attenzione: «Esci» non significa «Torna indietro». Ti scollega dal programma.",
        succede: [
          "Verrai scollegato e portato alla schermata di accesso.",
          "Per rientrare dovrai richiedere un nuovo codice, che ti arriverà via email.",
          "Le modifiche non salvate della scheda aperta andranno perse.",
        ],
        resta: ["Licenza e PUK restano su questo computer.", "Le valutazioni e i dati della ditta restano salvati."],
        suggerimento: "Volevi solo tornare all'elenco delle valutazioni? Premi «Annulla» e usa il pulsante «Torna all'elenco».",
        annulla: "Annulla",
        conferma: "Sì, esci",
      },
      cancella: {
        titolo: "Vuoi uscire e cancellare i dati di accesso?",
        intro: "Da usare sui computer condivisi o per spostare il PUK su un altro computer.",
        succede: [
          "Da questo computer vengono cancellati email, licenza, PUK e consenso.",
          "Verrai scollegato e portato alla schermata di accesso.",
          "Per rientrare ti serviranno di nuovo email, codice ricevuto via email, chiave di licenza e PUK: tienili a portata di mano.",
          "Le modifiche non salvate della scheda aperta andranno perse.",
        ],
        resta: ["Le valutazioni e i dati della ditta restano salvati nel browser."],
        suggerimento: "Volevi solo tornare all'elenco delle valutazioni? Premi «Annulla» e usa il pulsante «Torna all'elenco».",
        annulla: "Annulla",
        conferma: "Sì, esci e cancella",
      },
      chiudi: {
        titolo: "Vuoi chiudere l'applicazione?",
        intro: "Attenzione: «Chiudi applicazione» non significa «Torna indietro». Ti scollega e chiude il programma.",
        succede: [
          "Verrai scollegato.",
          "Il programma proverà a chiudere questa scheda del browser; se il browser non lo permette, tornerai alla schermata di accesso.",
          "Alla prossima apertura ti servirà un nuovo codice, che ti arriverà via email.",
          "Le modifiche non salvate della scheda aperta andranno perse.",
        ],
        resta: ["Licenza e PUK restano su questo computer.", "Le valutazioni e i dati della ditta restano salvati."],
        suggerimento: "Volevi solo tornare all'elenco delle valutazioni? Premi «Annulla» e usa il pulsante «Torna all'elenco».",
        annulla: "Annulla",
        conferma: "Sì, chiudi l'applicazione",
      },
    },
  },
  en: {
    tornaElenco: "Back to the list",
    etichettaSuccede: "What happens",
    etichettaResta: "What stays saved",
    voci: {
      esci: {
        titolo: "Do you want to sign out?",
        intro: "Careful: «Sign out» does not mean «Go back». It disconnects you from the program.",
        succede: [
          "You will be signed out and taken to the sign-in screen.",
          "To come back you will need to request a new code, which will be sent to you by email.",
          "Unsaved changes in the open form will be lost.",
        ],
        resta: ["Licence and PUK stay on this computer.", "Assessments and company data stay saved."],
        suggerimento: "Did you only want to go back to the list of assessments? Press «Cancel» and use the «Back to the list» button.",
        annulla: "Cancel",
        conferma: "Yes, sign out",
      },
      cancella: {
        titolo: "Do you want to sign out and erase the sign-in data?",
        intro: "Use this on shared computers or to move the PUK to another computer.",
        succede: [
          "Email, licence, PUK and consent are erased from this computer.",
          "You will be signed out and taken to the sign-in screen.",
          "To come back you will need your email, the code received by email, the licence key and the PUK again: keep them at hand.",
          "Unsaved changes in the open form will be lost.",
        ],
        resta: ["Assessments and company data stay saved in the browser."],
        suggerimento: "Did you only want to go back to the list of assessments? Press «Cancel» and use the «Back to the list» button.",
        annulla: "Cancel",
        conferma: "Yes, sign out and erase",
      },
      chiudi: {
        titolo: "Do you want to close the application?",
        intro: "Careful: «Close application» does not mean «Go back». It signs you out and closes the program.",
        succede: [
          "You will be signed out.",
          "The program will try to close this browser tab; if the browser does not allow it, you will return to the sign-in screen.",
          "Next time you open it you will need a new code, which will be sent to you by email.",
          "Unsaved changes in the open form will be lost.",
        ],
        resta: ["Licence and PUK stay on this computer.", "Assessments and company data stay saved."],
        suggerimento: "Did you only want to go back to the list of assessments? Press «Cancel» and use the «Back to the list» button.",
        annulla: "Cancel",
        conferma: "Yes, close the application",
      },
    },
  },
  de: {
    tornaElenco: "Zurück zur Liste",
    etichettaSuccede: "Was passiert",
    etichettaResta: "Was gespeichert bleibt",
    voci: {
      esci: {
        titolo: "Möchten Sie sich abmelden?",
        intro: "Achtung: «Abmelden» bedeutet nicht «Zurück». Sie werden vom Programm getrennt.",
        succede: [
          "Sie werden abgemeldet und zur Anmeldeseite geleitet.",
          "Zum erneuten Anmelden müssen Sie einen neuen Code anfordern, den Sie per E-Mail erhalten.",
          "Nicht gespeicherte Änderungen im geöffneten Bogen gehen verloren.",
        ],
        resta: ["Lizenz und PUK bleiben auf diesem Computer.", "Bewertungen und Firmendaten bleiben gespeichert."],
        suggerimento: "Wollten Sie nur zur Liste der Bewertungen zurück? Drücken Sie «Abbrechen» und verwenden Sie die Schaltfläche «Zurück zur Liste».",
        annulla: "Abbrechen",
        conferma: "Ja, abmelden",
      },
      cancella: {
        titolo: "Möchten Sie sich abmelden und die Zugangsdaten löschen?",
        intro: "Zu verwenden auf gemeinsam genutzten Computern oder um den PUK auf einen anderen Computer zu übertragen.",
        succede: [
          "E-Mail, Lizenz, PUK und Zustimmung werden von diesem Computer gelöscht.",
          "Sie werden abgemeldet und zur Anmeldeseite geleitet.",
          "Zum erneuten Anmelden benötigen Sie wieder E-Mail, den per E-Mail erhaltenen Code, Lizenzschlüssel und PUK: Halten Sie sie bereit.",
          "Nicht gespeicherte Änderungen im geöffneten Bogen gehen verloren.",
        ],
        resta: ["Bewertungen und Firmendaten bleiben im Browser gespeichert."],
        suggerimento: "Wollten Sie nur zur Liste der Bewertungen zurück? Drücken Sie «Abbrechen» und verwenden Sie die Schaltfläche «Zurück zur Liste».",
        annulla: "Abbrechen",
        conferma: "Ja, abmelden und löschen",
      },
      chiudi: {
        titolo: "Möchten Sie die Anwendung schließen?",
        intro: "Achtung: «Anwendung schließen» bedeutet nicht «Zurück». Sie werden abgemeldet und das Programm wird geschlossen.",
        succede: [
          "Sie werden abgemeldet.",
          "Das Programm versucht, diesen Browser-Tab zu schließen; erlaubt der Browser das nicht, kehren Sie zur Anmeldeseite zurück.",
          "Beim nächsten Öffnen benötigen Sie einen neuen Code, den Sie per E-Mail erhalten.",
          "Nicht gespeicherte Änderungen im geöffneten Bogen gehen verloren.",
        ],
        resta: ["Lizenz und PUK bleiben auf diesem Computer.", "Bewertungen und Firmendaten bleiben gespeichert."],
        suggerimento: "Wollten Sie nur zur Liste der Bewertungen zurück? Drücken Sie «Abbrechen» und verwenden Sie die Schaltfläche «Zurück zur Liste».",
        annulla: "Abbrechen",
        conferma: "Ja, Anwendung schließen",
      },
    },
  },
  es: {
    tornaElenco: "Volver a la lista",
    etichettaSuccede: "Qué ocurre",
    etichettaResta: "Qué queda guardado",
    voci: {
      esci: {
        titolo: "¿Quieres salir del programa?",
        intro: "Atención: «Salir» no significa «Volver atrás». Te desconecta del programa.",
        succede: [
          "Se cerrará tu sesión y pasarás a la pantalla de acceso.",
          "Para volver a entrar tendrás que pedir un nuevo código, que recibirás por correo.",
          "Se perderán los cambios no guardados de la ficha abierta.",
        ],
        resta: ["La licencia y el PUK permanecen en este ordenador.", "Las evaluaciones y los datos de la empresa siguen guardados."],
        suggerimento: "¿Solo querías volver a la lista de evaluaciones? Pulsa «Cancelar» y usa el botón «Volver a la lista».",
        annulla: "Cancelar",
        conferma: "Sí, salir",
      },
      cancella: {
        titolo: "¿Quieres salir y borrar los datos de acceso?",
        intro: "Para usar en ordenadores compartidos o para trasladar el PUK a otro ordenador.",
        succede: [
          "Se borran de este ordenador el correo, la licencia, el PUK y el consentimiento.",
          "Se cerrará tu sesión y pasarás a la pantalla de acceso.",
          "Para volver a entrar necesitarás de nuevo el correo, el código recibido por correo, la clave de licencia y el PUK: tenlos a mano.",
          "Se perderán los cambios no guardados de la ficha abierta.",
        ],
        resta: ["Las evaluaciones y los datos de la empresa siguen guardados en el navegador."],
        suggerimento: "¿Solo querías volver a la lista de evaluaciones? Pulsa «Cancelar» y usa el botón «Volver a la lista».",
        annulla: "Cancelar",
        conferma: "Sí, salir y borrar",
      },
      chiudi: {
        titolo: "¿Quieres cerrar la aplicación?",
        intro: "Atención: «Cerrar aplicación» no significa «Volver atrás». Cierra tu sesión y cierra el programa.",
        succede: [
          "Se cerrará tu sesión.",
          "El programa intentará cerrar esta pestaña del navegador; si el navegador no lo permite, volverás a la pantalla de acceso.",
          "La próxima vez que lo abras necesitarás un nuevo código, que recibirás por correo.",
          "Se perderán los cambios no guardados de la ficha abierta.",
        ],
        resta: ["La licencia y el PUK permanecen en este ordenador.", "Las evaluaciones y los datos de la empresa siguen guardados."],
        suggerimento: "¿Solo querías volver a la lista de evaluaciones? Pulsa «Cancelar» y usa el botón «Volver a la lista».",
        annulla: "Cancelar",
        conferma: "Sí, cerrar la aplicación",
      },
    },
  },
};

/** Testi delle conferme nella lingua scelta. */
export function useConferme(): TestiConferme {
  const { lingua } = useLingua();
  return CONFERME[lingua] ?? CONFERME.it;
}

/** Etichetta «Torna all'elenco» nella lingua scelta. */
export function useTornaElenco(): string {
  return useConferme().tornaElenco;
}
