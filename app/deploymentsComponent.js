import document from 'document';
import * as messaging from 'messaging';

const sendVal = data => {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
};

const controlCommands = (value, id) => {
  const controlScreen = document.getElementById('control-screen');
  const restartButton = controlScreen.getElementById('restart-button');
  const suspendButton = controlScreen.getElementById('suspend-button');

  const sendProjectRequest = (value, id, type) => {
    let data = {
      key: 'Deployment command',
      command: type,
      deploymentId: id,
      deploymentName: value,
    };
    sendVal(data);
  };

  controlScreen.style.display = 'inline';

  restartButton.onclick = () => {
    sendProjectRequest(value, id, 'RESTART');
    controlScreen.style.display = 'none';
  };
  suspendButton.onclick = () => {
    sendProjectRequest(value, id, 'SUSPEND');
    controlScreen.style.display = 'none';
  };
};

const renderDeploymentsList = res => {
  let VTList = document.getElementById('my-deployments-list');
  let NUM_ELEMS = res.length;
  VTList.delegate = {
    getTileInfo: function (index) {
      return {
        type: 'my-deployments-pool',
        value: res[index].name,
        index: index,
        id: res[index].id
      };
    },
    configureTile: function (tile, info) {
      if (info.type === 'my-deployments-pool') {
        tile.getElementById('text').text = `${info.value}`;
        let touch = tile.getElementById('touch-me');
        touch.onclick = evt => {
          console.log(`Touched: ${info.index} ${info.value} ${info.id}`);
          controlCommands(info.value, info.id);
        };
      }
    }
  };
  // VTList.length must be set AFTER VTList.delegate
  VTList.length = NUM_ELEMS;
};

export { renderDeploymentsList };