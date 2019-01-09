import * as messaging from 'messaging';
import { encode } from 'cbor';
import { outbox } from 'file-transfer';
import { settingsStorage } from "settings";
import { getYearAndMonthPlusOne, getPeriodStartsMinus } from 'getYearAndMounth';
import { fetchCost, fetchRating, fetchSession, defaultFetch } from 'fetchService';
import createUrls from 'createUrls';
import { checkProviderStatus } from 'providersServices';
import { projectsSummury, fullProjectsList } from 'projectsServices';
import { getPcUtilization, getAwsUtilization, getAzureUtilization } from 'utilizationService';
import { fullDeploymentList } from 'deploymentsService';

let onesphereUrl = '';
let username = '';
let password = '';

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log('Companion Socket Open');
  restoreSettings();
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log('Companion Socket Closed');
};

const handleSettingData = (key, newValue, lastItem) => {
  if (key === 'onesphereUrl' && newValue) {
    onesphereUrl = JSON.parse(newValue).name;
  }

  if (key === 'username' && newValue) {
    username = JSON.parse(newValue).name;
  }

  if (key === 'password' && newValue) {
    password = JSON.parse(newValue).name;
  }

  if (onesphereUrl && username && password && lastItem) {
    return initSession({ onesphereUrl, username, password });
  } else if (lastItem && (!onesphereUrl || !username || !password)) {
    let error = 'Please enter an HPE OneSphere URL in settings.'
    if (!username) error = 'Please enter a username in settings.';
    if (!password) error = 'Please enter a password in settings.';
    messaging.peerSocket.send({ key: 'error', error });
  }
}

// A user changes settings
settingsStorage.onchange = evt => {
  let data = {
    key: evt.key,
    newValue: evt.newValue
  };
  sendVal(data);
  handleSettingData(evt.key, evt.newValue, true);
};

// Restore any previously saved settings and send to the device
const restoreSettings = () => {
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (key) {
      const newValue = settingsStorage.getItem(key);
      let data = {
        key: key,
        newValue: newValue
      };
      handleSettingData(key, newValue, settingsStorage.length - 1 === index);
      sendVal(data);
    }
  }
};

// Send data to device using Messaging API
const sendVal = data => {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
};

const initSession = async ({ username, password, onesphereUrl }) => {
  try {
    const urls = createUrls(onesphereUrl);
    const session = await fetchSession({ username, password, url: urls.sessionUrl });

    if (session && messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send(session);

      const { yearUp, monthUp } = getYearAndMonthPlusOne();
      const periodStart = getPeriodStartsMinus()

      const costUrl = urls.costUrl(yearUp, monthUp);
      const pcUtilUrl = urls.pcUtilizationUrl(periodStart);
      const awsUtilUrl = urls.awsUtilizationUrl(periodStart);
      const azureUtilUrl = urls.azureUtilizationUrl(periodStart);
      const totals = await fetchCost(costUrl, session);

      const ratings = await Promise.all([
        fetchRating(urls.awsUrl, session, 'AWS'),
        fetchRating(urls.azureUrl, session, 'Azure'),
        fetchRating(urls.pcUrl, session, 'Private Cloud'),
      ]);

      const providerInfo = await defaultFetch(urls.providerStatusUrl, session);
      const providerStatuses = await checkProviderStatus(providerInfo.members);
      const deploymentsList = await defaultFetch(urls.projectsListUrl, session);
      const projectsTotals = await projectsSummury(deploymentsList);
      const projectList = await fullProjectsList(deploymentsList.members);
      
      const allProjectList = encode(projectList);
      outbox.enqueue('allProjectList.txt', allProjectList);

      const [pcUtilizationStatuses, awsUtilizationStatuses, azureUtilizationStatuses] = await Promise.all([
        defaultFetch(pcUtilUrl, session),
        defaultFetch(awsUtilUrl, session),
        defaultFetch(azureUtilUrl, session),
      ]);

      const utilizations = [
        getPcUtilization(pcUtilizationStatuses.members, 'PC'),
        getAwsUtilization(awsUtilizationStatuses.members, 'AWS'),
        getAzureUtilization(azureUtilizationStatuses.members, 'Azure')
      ];

      messaging.peerSocket.send({ key: 'Totals', totals: totals });
      messaging.peerSocket.send({ key: 'Provider Statuses', stats: providerStatuses });
      messaging.peerSocket.send({ key: 'Projects Statuses', stats: projectsTotals });
      messaging.peerSocket.send({ key: 'Ratings', ratings: ratings });
      messaging.peerSocket.send({ key: 'Utilizations', stats: utilizations });

      messaging.peerSocket.onmessage = async ({ data }) => {
        console.log(`Companion received : ${JSON.stringify(data)}`);
        if (data.key === 'Deployment list request') {
          const deploymentUrl = urls.deploymentsListUrl(data.deploymentId, data.deploymentsNum);
          const deploymentsSet = await defaultFetch(deploymentUrl, session);
          const fullDeploymentsList = await fullDeploymentList(deploymentsSet.members);
          const messageList = encode(fullDeploymentsList);
          outbox.enqueue('deployments.txt', messageList);
        };

        if (data.key === 'Deployment command') {
          let deploymentCommand = data;
          console.log(`Companion recived: ${JSON.stringify(data, null, 2)}`);
        };

      };

    }

  } catch (error) {
    console.log('error', error);
    messaging.peerSocket.send({ key: 'error', error });
  };
};

