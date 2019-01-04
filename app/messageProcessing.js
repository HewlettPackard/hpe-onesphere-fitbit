import document from 'document';
import { insightsSet } from 'insightsComponent';
import { renderRatings } from 'providersComponent';
import { pcUtilizationRender } from 'utilizationComponent';

const messageProcessing = ({ data }) => {
    console.log(`App received : ${JSON.stringify(data)}`);

    if (data.key === 'Totals' && data.totals) {
        document.getElementById('extenceBtn02').getElementById('copy').text = `$${data.totals[0].cost.toLocaleString()}`;
        insightsSet(data.totals);
    }

    if (data.key === 'Provider Statuses' && data.stats) {
        document.getElementById('up').text = `${data.stats.stats.up}`;
        document.getElementById('down').text = `${data.stats.stats.down}`;
    }

    if (data.key === 'Ratings' && data.ratings) {
        renderRatings(data.ratings);
    }

    if (data.key === 'Projects Statuses' && data.stats) {
        document.getElementById('deployemnts-total').text = data.stats.deployments;
        document.getElementById('projects-total').text = data.stats.total;
    }

    if (data.key === 'Utilizations' && data.stats) {
        pcUtilizationRender(data.stats);
    }

};

export { messageProcessing };