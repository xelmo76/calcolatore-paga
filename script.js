function calcolaPagaOraria() {
  const paga = parseFloat(document.getElementById('paga').value);
  const ore = parseFloat(document.getElementById('ore').value);
  const minuti = parseFloat(document.getElementById('minuti').value) || 0;
  const includeINPS = document.getElementById('inpsCheck').checked;
  const includeCommercialista = document.getElementById('commercialistaCheck').checked;
  const usaPressioneFiscale = document.getElementById('pressioneFiscaleCheck').checked;
  const pressioneFiscale = parseFloat(document.getElementById('pressione').value);
  const risultato = document.getElementById('risultato');

  // Validazione input
  if (isNaN(paga) || isNaN(ore) || ore < 0 || minuti < 0 || minuti >= 60) {
    risultato.textContent = "Inserisci valori validi.";
    return;
  }

  const oreTotali = ore + (minuti / 60);
  if (oreTotali <= 0) {
    risultato.textContent = "Le ore totali devono essere maggiori di zero.";
    return;
  }

  // Parametri fissi
  const inpsTrimestrale = 750;
  const parcellaCommercialistaAnnua = 420;
  const inpsMensile = includeINPS ? inpsTrimestrale / 3 : 0;
  const commercialistaMensile = includeCommercialista ? parcellaCommercialistaAnnua / 12 : 0;

  // Coefficiente e aliquota forfettario
  const coefficienteRedditivita = 0.78;
  const aliquotaImposta = 0.15;

  const pagaOrariaLorda = paga / oreTotali;
  let pagaNetta = 0;
  let dettagli = '';

  if (usaPressioneFiscale && !isNaN(pressioneFiscale)) {
    // Calcolo usando la pressione fiscale
    pagaNetta = paga * (1 - (pressioneFiscale / 100));
    dettagli += `<p>Pressione fiscale stimata: ${pressioneFiscale.toFixed(1)}%</p>`;
  } else {
    // Calcolo dettagliato INPS + imposta sostitutiva
    const redditoImponibile = paga * coefficienteRedditivita;
    const impostaSostitutiva = redditoImponibile * aliquotaImposta;
    pagaNetta = paga - inpsMensile - impostaSostitutiva - commercialistaMensile;

    if (includeINPS) {
      dettagli += `<p>Contributi INPS (mensili): € ${inpsMensile.toFixed(2)}</p>`;
    }
    dettagli += `<p>Imposta sostitutiva stimata: € ${impostaSostitutiva.toFixed(2)}</p>`;
    if (includeCommercialista) {
      dettagli += `<p>Parcella commercialista (mensile): € ${commercialistaMensile.toFixed(2)}</p>`;
    }
  }

  const pagaOrariaNetta = pagaNetta / oreTotali;

  risultato.innerHTML = `
    <p><strong>Risultati:</strong></p>
    <p>Paga oraria <strong>lorda</strong>: € ${pagaOrariaLorda.toFixed(2)}</p>
    ${dettagli}
    <p>Paga oraria <strong>netta (stimata)</strong>: € ${pagaOrariaNetta.toFixed(2)}</p>
  `;
}
