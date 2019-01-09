import { $ } from 'view';

const awsRating = $('#aws-rating');
const azureRating = $('#az-rating');
const privateCloudRating = $('#pc-rating');

const renderRatings = ratings => {
  ratings.forEach((el) => {
    switch (el.title) {
      case 'Azure':
        azureRating.text = el.rating;
        break;
      case 'AWS':
        awsRating.text = el.rating;
        break;
      case 'Private Cloud':
        privateCloudRating.text = el.rating;
        break;
    }
  });
}

export { renderRatings }; 