import document from 'document';
import * as messaging from 'messaging';

const renderProjectList = res => {
  let VTList = document.getElementById('my-list');
  let noItemScreen = document.getElementById('empty-list');
  let NUM_ELEMS = res.length;
  noItemScreen.style.display = 'none';
  VTList.delegate = {
    getTileInfo: function (index) {
      let depsNum = res[index].deployments || '-';
      return {
        type: 'my-pool',
        value: res[index].name,
        index: index,
        deploymentsNum: depsNum,
        id: res[index].id
      };
    },
    configureTile: function (tile, info) {
      if (info.type === 'my-pool') {
        tile.getElementById('text').text = `${info.value}`;
        tile.getElementById('deployments-num').text = `Deployments: ${info.deploymentsNum}`;
        let touch = tile.getElementById('touch-me');
        touch.onclick = evt => {
          // console.log(`Touched: ${info.index} ${info.value} ${info.deploymentsNum} ${info.id}`);
          if (info.deploymentsNum !== 'Deployments: -') {
            sendProjectReqest(info.value, info.id, info.deploymentsNum);
          }
        };
      }
    }
  };
// VTList.length must be set AFTER VTList.delegate  
  VTList.length = NUM_ELEMS;
};

const sendProjectReqest = (value, id, num) => {
  let data = {
    key: 'Deployment list request',
    deploymentId: id,
    deploymentName: value,
    deploymentsNum: num,
  };
  sendVal(data);
};

const sendVal = data => {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  };
};

export { renderProjectList };