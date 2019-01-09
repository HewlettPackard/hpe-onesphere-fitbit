import document from 'document';
import * as messaging from 'messaging';
import { inbox } from 'file-transfer';
import { messageProcessing } from 'messageProcessing';
import { initialScreenStates } from 'initialScreenStates';
import { pcUtilizationRender } from 'utilizationComponent';

initialScreenStates();

// Message is received
messaging.peerSocket.onmessage = messageProcessing;

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log('App Socket Open');
}; 

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log('App Socket Closed');
};