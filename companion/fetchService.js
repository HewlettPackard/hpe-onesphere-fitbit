import * as messaging from 'messaging';

const baseFetch = async (url, token, method) => {
  try {
    const options = {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    }
    const res = await fetch(url, options);
    // check res.ok ?
    return res.json(); 
  } catch (error) {
    console.log('error', error);
    messaging.peerSocket.send({ key: 'error', error });
  }
}; 

const fetchSession = ({ username, password, url }) => fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      })
      .then((res) => res.json());



const fetchCost = async (url, session) => {
    const method = 'GET';
    const { members } = await baseFetch(url, session.token, method);
    const obj = {};
    const fields = ['cost.total', 'cost.usage'];
    const services = ['Amazon Web Services', 'Azure Web Services', 'Private Cloud'];
    const totals = [ 
        { title: 'Total Cost', cost: 0 },
        { title: 'Amazon Web Services', cost: 0, managed: 0 },
        { title: 'Azure Web Services', cost: 0, managed: 0 },
        { title: 'Private Cloud', cost: 0, managed: 0 },
    ];

    members.forEach( el => {
        if (services.includes(el.resource.name) && fields.includes(el.name)) {
            if (!obj[el.resource.name]) {
                 obj[el.resource.name]= {};
            }
            obj[el.resource.name][el.name] = el;
        }
    });

    for(let key in obj) {
        if (services.includes(key)) {
            const costTotal = obj[key]['cost.total'] ? +obj[key]['cost.total'].values[0].value : 0;
            const costUsage = obj[key]['cost.usage'] ? +obj[key]['cost.usage'].values[0].value : 0;
            totals[0].cost += +costTotal.toFixed(2);
            const service = totals.find(service => service.title === key);
            service.cost = +costTotal.toFixed(0);
            service.managed = +costUsage.toFixed(0);
        }
    };
    
    return totals;
  
};      
  

const fetchRating = async (url, session, title) => {
  const method = 'GET';
  const res = await baseFetch(url, session.token, method);
  return {
    title,
    rating: res.members[0].values.length ? res.members[0].values[0].value : 'Not Rated',
  };
}; 

const defaultFetch = async (url, session) => {
  const method = 'GET';
  const res = await baseFetch(url, session.token, method);
  return res;
}; 


export { fetchCost, fetchRating, fetchSession, defaultFetch };