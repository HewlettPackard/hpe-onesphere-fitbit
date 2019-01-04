import { $ } from 'view';

const awsTotalCost = $('#aws-total-cost');
const azureTotalCost = $('#azure-total-cost');
const pcTotalCost = $('#pc-total-cost');

const insightsSet = totals => {
  totals.forEach(el => {
    if (el.title === 'Amazon Web Services') {
      let awsTotalCosts = el.cost === 0 ? '-' : `$${el.cost.toLocaleString()}`;
      let awsManagedCosts = el.managed === 0 ? '-' : `$${el.managed.toLocaleString()}`;
      awsTotalCost.text = `${awsTotalCosts} / ${awsManagedCosts}`;
    }

    if (el.title === 'Azure Web Services') {
      let azureTotalCosts = el.cost === 0 ? '-' : `$${el.cost.toLocaleString()}`;
      let azureManagedCosts = el.managed === 0 ? '-' : `$${el.managed.toLocaleString()}`;
      azureTotalCost.text = `${azureTotalCosts} / ${azureManagedCosts}`;
    }

    if (el.title === 'Private Cloud') {
      let pcTotalCosts = el.cost === 0 ? '-' : `$${el.cost.toLocaleString()}`;
      let pcManagedCosts = el.managed === 0 ? '-' : `$${el.managed.toLocaleString()}`;
      pcTotalCost.text = `${pcTotalCosts} / ${pcManagedCosts}`;
    }

  })
};

export { insightsSet };