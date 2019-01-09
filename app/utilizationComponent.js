import { $ } from 'view';

const pcUtilizationRender = data => {
  const list = $('#rating-module #ratings-tile');
  const items = $('.rating-item', list);
  const utilizations = $('#utl');
  const touchUtl = $('#touch-utl', utilizations);
  const cpuHeader = $('#cpu-header');
  const storageHeader = $('#storage-header');

  utilizations.style.display = 'none';

  items.forEach((element, index) => {
    let touch = element.getElementById('touch-me');
    touch.onclick = () => {
      if (index === 0) {
        utilizations.style.display = 'inline';
        cpuHeader.text = `${data[1].serverCpuTotals}`;
      }
      
      if (index === 1) {
        utilizations.style.display = 'inline';
        cpuHeader.text = `${data[2].serverCpuTotals}`;
      }
      
      if (index === 2) {
        utilizations.style.display = 'inline';
        cpuHeader.text = `${data[0].serverCpuTotals}`;
        storageHeader.text = `${data[0].serverStorageTotals}`;
      }
    };
    
  });

  touchUtl.onclick = e => {
    utilizations.style.display = 'none';
    cpuHeader.text = '';
    storageHeader.text = '';
  };
};

export { pcUtilizationRender };