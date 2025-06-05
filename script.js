let inpsToggle, commercialistaToggle, pressioneToggle, btnCalcola, risultatoArea;
let calcoloEseguito = false;

document.addEventListener('DOMContentLoaded', () => {
  inpsToggle = document.getElementById('inpsCheck');
  commercialistaToggle = document.getElementById('commercialistaCheck');
  pressioneToggle = document.getElementById('pressioneFiscaleCheck');
  btnCalcola = document.getElementById('btnCalcola');
  risultatoArea = document.getElementById('risultato');

  btnCalcola.addEventListener('click', () => {
    calcolaPagaOraria();
    calcoloEseguito = true;
  });

  inpsToggle.addEventListener('change', () => {
    if (inpsToggle.checked) pressioneToggle.checked = false;
    if (calcoloEseguito) calcolaPagaOraria();
  });

  commercialistaToggle.addEventListener('change', () => {
    if (commercialistaToggle.checked) pressioneToggle.checked = false;
    if (calcoloEseguito) calcolaPagaOraria();
  });

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

  if (isNaN(paga) || isNaN(ore) || ore < 0 || minuti < 0 || minuti >= 60) {
    risultatoArea.textContent = "Inserisci valori validi.";
    return;
  }

  const oreTotali = ore + (minuti / 60);
  if (oreTotali <= 0) {
    risultatoArea.textContent = "Le ore totali devono essere maggiori di zero.";
    return;
  }

  const inpsMensile = includeINPS ? 750 / 3 : 0;
  const commercialistaMensile = includeCommercialista ? 420 / 12 : 0;
  const coeffRedditivita = 0.78;
  const aliquota = 0.15;

  const pagaOrariaLorda = paga / oreTotali;
  let pagaNetta = 0;
  let dettagli = '';

  if (usaPressioneFiscale && !isNaN(pressioneFiscale)) {
    pagaNetta = paga * (1 - pressioneFiscale / 100);
    dettagli += `<p>Pressione fiscale stimata: ${pressioneFiscale.toFixed(1)}%</p>`;
  } else {
    const imponibile = paga * coeffRedditivita;
    const imposta = imponibile * aliquota;
    pagaNetta = paga - inpsMensile - imposta - commercialistaMensile;
    if (includeINPS) dettagli += `<p>Contributi INPS (mensili): € ${inpsMensile.toFixed(2)}</p>`;
    dettagli += `<p>Imposta sostitutiva stimata: € ${imposta.toFixed(2)}</p>`;
    if (includeCommercialista) dettagli += `<p>Parcella commercialista (mensile): € ${commercialistaMensile.toFixed(2)}</p>`;
  }

  const pagaOrariaNetta = pagaNetta / oreTotali;

  risultatoArea.innerHTML = `
    <p><strong>Risultati:</strong></p>
    <p>Paga oraria <strong>lorda</strong>: € ${pagaOrariaLorda.toFixed(2)}</p>
    ${dettagli}
    <p>Paga oraria <strong>netta (stimata)</strong>: € ${pagaOrariaNetta.toFixed(2)}</p>
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
  calcoloEseguito = false;
}
