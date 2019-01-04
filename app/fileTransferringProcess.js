import * as fs from 'fs';
import document from 'document';
import { inbox } from 'file-transfer';
import { renderProjectList } from 'projectsComponent';
import { renderDeploymentsList } from 'deploymentsComponent';

const processAllFiles = () => {
  let fileName;
  while (fileName = inbox.nextFile()) {
    if (fileName === 'deployments.txt') {
      let deploymentsResponse;
      console.log(`/private/data/${fileName} is now available`);
      deploymentsResponse = fs.readFileSync('deployments.txt', 'cbor');
      fs.unlinkSync('deployments.txt');
      renderDeploymentsList(deploymentsResponse);
      document.getElementById('deployments-stack').style.display = 'inline';
    }

    if (fileName === 'allProjectList.txt') {
      let allProjectList;
      console.log(`/private/data/${fileName} is now available`);
      allProjectList = fs.readFileSync('allProjectList.txt', 'cbor');
      fs.unlinkSync('allProjectList.txt');
      renderProjectList(allProjectList);
    }

  }
};

export { processAllFiles };