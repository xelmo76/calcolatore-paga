// Riferimenti a elementi
let inpsToggle, commercialistaToggle, pressioneToggle, btnCalcola, risultatoArea;

// Variabile per tracciare se è già stato effettuato un calcolo
let calcoloEseguito = false;

document.addEventListener('DOMContentLoaded', () => {
  inpsToggle = document.getElementById('inpsCheck');
  commercialistaToggle = document.getElementById('commercialistaCheck');
  pressioneToggle = document.getElementById('pressioneFiscaleCheck');
  btnCalcola = document.getElementById('btnCalcola');
  risultatoArea = document.getElementById('risultato');

  // Evento click su "Calcola": esegue il primo calcolo e imposta il flag
  btnCalcola.addEventListener('click', () => {
    calcolaPagaOraria();
    calcoloEseguito = true;
  });

  // Quando cambio INPS: gestisco l'esclusività e, se già calcolato, ricalcolo
  inpsToggle.addEventListener('change', () => {
    if (inpsToggle.checked) {
      pressioneToggle.checked = false;
    }
    if (calcoloEseguito) calcolaPagaOraria();
  });

  // Quando cambio Commercialista: gestisco l'esclusività e, se già calcolato, ricalcolo
  commercialistaToggle.addEventListener('change', () => {
    if (commercialistaToggle.checked) {
      pressioneToggle.checked = false;
    }
    if (calcoloEseguito) calcolaPagaOraria();
  });

  // Quando cambio Pressione fiscale: gestisco l'esclusività e, se già calcolato, ricalcolo
  pressioneToggle.addEventListener('change', () => {
    if (pressioneToggle.checked) {
      inpsToggle.checked = false;
      commercialistaToggle.checked = false;
    }
    if (calcoloEseguito) calcolaPagaOraria();
  });
});

function calcolaPagaOraria() {
  const paga = parseFloat(document.getElementById('paga').value);
  const ore = parseFloat(document.getElementById('ore').value);
  const minuti = parseFloat(document.getElementById('minuti').value) || 0;
  const includeINPS = inpsToggle.checked;
  const includeCommercialista = commercialistaToggle.checked;
  const usaPressioneFiscale = pressioneToggle.checked;
  const pressioneFiscale = parseFloat(document.getElementById('pressione').value);

  // Validazione input
  if (isNaN(paga) || isNaN(ore) || ore < 0 || minuti < 0 || minuti >= 60) {
    risultatoArea.textContent = "Inserisci valori validi.";
    return;
  }

  const oreTotali = ore + (minuti / 60);
  if (oreTotali <= 0) {
    risultatoArea.textContent = "Le ore totali devono essere maggiori di zero.";
    return;
  }

  // Parametri fissi
  const inpsTrimestrale = 750;
  const parcellaCommercialistaAnnua = 420;
  const inpsMensile = includeINPS ? inpsTrimestrale / 3 : 0;
  const commercialistaMensile = includeCommercialista
    ? parcellaCommercialistaAnnua / 12
    : 0;

  // Coefficiente e aliquota forfettario
  const coefficienteRedditivita = 0.78;
  const aliquotaImposta = 0.15;

  const pagaOrariaLorda = paga / oreTotali;
  let pagaNetta = 0;
  let dettagli = '';

  if (usaPressioneFiscale && !isNaN(pressioneFiscale)) {
    // Calcolo usando la pressione fiscale
    pagaNetta = paga * (1 - pressioneFiscale / 100);
    dettagli += `<p>Pressione fiscale stimata: ${pressioneFiscale.toFixed(
      1
    )}%</p>`;
  } else {
    // Calcolo dettagliato INPS + imposta sostitutiva
    const redditoImponibile = paga * coefficienteRedditivita;
    const impostaSostitutiva = redditoImponibile * aliquotaImposta;
    pagaNetta = paga - inpsMensile - impostaSostitutiva - commercialistaMensile;

    if (includeINPS) {
      dettagli += `<p>Contributi INPS (mensili): € ${inpsMensile.toFixed(
        2
      )}</p>`;
    }
    dettagli += `<p>Imposta sostitutiva stimata: € ${impostaSostitutiva.toFixed(
      2
    )}</p>`;
    if (includeCommercialista) {
      dettagli += `<p>Parcella commercialista (mensile): € ${commercialistaMensile.toFixed(
        2
      )}</p>`;
    }
  }

  const pagaOrariaNetta = pagaNetta / oreTotali;

  risultatoArea.innerHTML = `
    <p><strong>Risultati:</strong></p>
    <p>Paga oraria <strong>lorda</strong>: € ${pagaOrariaLorda.toFixed(2)}</p>
    ${dettagli}
    <p>Paga oraria <strong>netta (stimata)</strong>: € ${pagaOrariaNetta.toFixed(
      2
    )}</p>
  `;
}

function resetForm() {
  document.getElementById('paga').value = '';
  document.getElementById('ore').value = '';
  document.getElementById('minuti').value = '';
  inpsToggle.checked = false;
  commercialistaToggle.checked = false;
  pressioneToggle.checked = false;
  document.getElementById('pressione').value = '24';
  risultatoArea.innerHTML = '';

  // Reimposto il flag: prossimo toggle non ricalcolerà fino a nuovo "Calcola"
  calcoloEseguito = false;
}
