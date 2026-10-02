export const FDM_MATERIALS = ['ASA', 'PLA', 'PETG', 'ABS', 'TPU'];

const roundMoney = value => Math.round((value + Number.EPSILON) * 100) / 100;

export function calculateManualQuote(inputs, quantity) {
  const numericKeys = [
    'weightGrams', 'printHours', 'filamentUsdPerKg', 'wearUsdPerKg', 'usdToCrc',
    'printerPowerWatts', 'electricityCrcPerKwh', 'postProcessMinutesPerPiece',
    'laborCrcPerHour', 'designHours', 'designCrcPerHour', 'otherCostsCrc', 'markupPercent',
  ];
  if (!inputs || !FDM_MATERIALS.includes(inputs.material)
    || !Number.isSafeInteger(quantity) || quantity < 1
    || numericKeys.some(key => {
      const optionalZeroCost = (key === 'laborCrcPerHour' && Number(inputs.postProcessMinutesPerPiece) === 0)
        || (key === 'designCrcPerHour' && Number(inputs.designHours) === 0);
      if (optionalZeroCost && (inputs[key] === '' || inputs[key] === null || inputs[key] === undefined)) return false;
      return inputs[key] === '' || inputs[key] === null || inputs[key] === undefined
        || !Number.isFinite(Number(inputs[key])) || Number(inputs[key]) < 0;
    })
    || Number(inputs.weightGrams) <= 0 || Number(inputs.printHours) <= 0
    || Number(inputs.filamentUsdPerKg) <= 0 || Number(inputs.usdToCrc) <= 0
    || Number(inputs.printerPowerWatts) <= 0 || Number(inputs.electricityCrcPerKwh) <= 0
    || (Number(inputs.postProcessMinutesPerPiece) > 0 && Number(inputs.laborCrcPerHour) <= 0)
    || (Number(inputs.designHours) > 0 && Number(inputs.designCrcPerHour) <= 0)
    || !/^\d{4}-\d{2}-\d{2}$/.test(inputs.ratesCheckedAt || '')
    || !Number.isFinite(Date.parse(`${inputs.ratesCheckedAt}T00:00:00Z`))
    || new Date(`${inputs.ratesCheckedAt}T00:00:00Z`).toISOString().slice(0, 10) !== inputs.ratesCheckedAt) return null;

  const values = Object.fromEntries(numericKeys.map(key => [key, Number(inputs[key])]));
  const material = values.weightGrams / 1000 * values.filamentUsdPerKg * values.usdToCrc * quantity;
  const wear = values.weightGrams / 1000 * values.wearUsdPerKg * values.usdToCrc * quantity;
  const electricity = values.printHours * values.printerPowerWatts / 1000 * values.electricityCrcPerKwh * quantity;
  const postProcess = values.postProcessMinutesPerPiece / 60 * values.laborCrcPerHour * quantity;
  const design = values.designHours * values.designCrcPerHour;
  const costSubtotal = roundMoney(material + wear + electricity + postProcess + design + values.otherCostsCrc);
  const amount = Math.round(costSubtotal * (1 + values.markupPercent / 100));

  if (!Number.isSafeInteger(amount) || amount <= 0) return null;
  return {
    rulesVersion: 'manual-fdm-v1',
    quantity,
    inputs: { ...inputs, ...values },
    breakdown: {
      materialCrc: roundMoney(material),
      wearCrc: roundMoney(wear),
      electricityCrc: roundMoney(electricity),
      postProcessCrc: roundMoney(postProcess),
      designCrc: roundMoney(design),
      otherCostsCrc: roundMoney(values.otherCostsCrc),
      costSubtotalCrc: costSubtotal,
      markupPercent: values.markupPercent,
      amountCrc: amount,
    },
  };
}
