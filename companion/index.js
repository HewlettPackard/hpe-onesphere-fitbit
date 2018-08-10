import * as messaging from "messaging";
import { settingsStorage } from "settings";

let onesphereUrl = '';
let username = '';
let password = '';

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("Companion Socket Open");
  restoreSettings();
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("Companion Socket Closed");
};

function handleSettingData(key, newValue, lastItem) {
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
    let error = 'Please check your settings and try again.'
    if (!password) error = 'Please enter a password in settings.';
    if (!username) error = 'Please enter a username in settings.';
    if (!onesphereUrl) error = 'Please enter an HPE OneSphere URL in settings.';
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
function restoreSettings() {
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
  
  if (!settingsStorage.length) {
    messaging.peerSocket.send({ key: 'error', title: 'Welcome to HPE OneSphere', error: 'Please enter your HPE OneSphere credentials in settings.' })
  }
}

// Send data to device using Messaging API
function sendVal(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
}

function initSession(details) {
  console.log('details', `${details.onesphereUrl}/rest/session`);
  fetch(`https://${details.onesphereUrl}/rest/session`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: details.username,
      password: details.password
    })
  })
    .then((res) => res.json())
    .then(session => {
      if (session && messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        messaging.peerSocket.send(session);
        const today = new Date();
        const year = Number(today.getFullYear());
        let month = Number(new Date().getMonth());

        month = month + 2;
        if (month < 10) month = `0${month}`;
        if (month === 13) {
          month = '01';
          year = year + 1;
        }
        if (month === 14) {
          month = '02';
          year = year + 1;
        }

        fetch(`https://${details.onesphereUrl}/rest/metrics?name=cost.total&period=month&periodStart=${year}-${month}-01T00%3A00%3A00Z&periodCount=-2&category=providers&groupBy=providerTypeUri&view=full`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.token}`
          }
        })
        .then((res) => res.json())
        .then(({ members }) => {
          if (members && members.length > 0) {          
            let totalCost = 0;
            const totals = members.map((member) => {
              const memberTotal = member.values[1].value.toFixed(2);
              totalCost = totalCost + Number(memberTotal);
              return {
                title: member.resource.name,
                cost: memberTotal
              };
            });
            totals.unshift({
              title: 'Total Cost',
              cost: totalCost.toFixed(2)
            });
            messaging.peerSocket.send({ key: 'totals', totals: totals });
          }
        })
        .catch(error => console.log('error', error) || messaging.peerSocket.send({ key: 'error', error }));
      }
    })
    .catch(error => console.log('error', error) || messaging.peerSocket.send({ key: 'error', error }));
}