import document from 'document';
import { toggle } from 'utilities';
import { inbox } from 'file-transfer';
import { processAllFiles } from 'fileTransferringProcess';

inbox.addEventListener('newfile', processAllFiles);

const initialScreenStates = () => {
  const ratingModule = document.getElementById('rating-module');
  const extenceBtn01 = document.getElementById('extenceBtn01');
  const insightsModule = document.getElementById('stage');
  const extenceBtn02 = document.getElementById('extenceBtn02');
  const totalCost = extenceBtn02.getElementById('copy');
  const extenceBtn03 = document.getElementById('extenceBtn03');
  const projectsModule = document.getElementById('projects-stack');
  const deploymentStack = document.getElementById('deployments-stack');
  const controlCommands = document.getElementById('control-screen');

  insightsModule.layer = 2;
  insightsModule.style.display = 'none';
  ratingModule.layer = 2;
  ratingModule.style.display = 'none';
  projectsModule.layer = 2;
  projectsModule.style.display = 'none';
  deploymentStack.layer = 5;
  deploymentStack.style.display = 'none';
  controlCommands.layer = 10;
  controlCommands.style.display = 'none';

  extenceBtn01.onactivate = () => toggle(ratingModule);
  extenceBtn02.onactivate = () => toggle(insightsModule);
  extenceBtn03.onactivate = () => toggle(projectsModule);

  document.onkeypress = function (e) {
    e.preventDefault();
    if (e.key === 'back') {
      ratingModule.style.display = 'none';
      insightsModule.style.display = 'none';
      projectsModule.style.display = 'none';
      deploymentStack.style.display = 'none';
      controlCommands.style.display = 'none';
      document.getElementById('utl').style.display = 'none';
    }

    if (e.key === 'down') {
      deploymentStack.style.display = 'none';
      controlCommands.style.display = 'none';
    }
    
    if (e.key === 'up') {
      controlCommands.style.display = 'none';
    }
  };
  
};

export { initialScreenStates };