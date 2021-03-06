import { Base64 } from 'js-base64'
import { store } from '../config/configureStore'
import Config from '../config';

export const RESP_ERROR = 'RESP_ERROR';
export const fetchHosts = async () => {
  const { token } = store.getState().system;
  const headers = new Headers();
  headers.append('Authorization', 'Bearer ' + token);
  const respond = await fetch(`http://${Config.ip}:${Config.port}/api/host`, { headers });
  checkRespondStatus(respond);
  return respond.json();
}
export const fetchInit = async () => {
  const respond = await fetch(`http://${Config.ip}:${Config.port}/api/index`);
  return respond.json();
}
export const login = async (password) => {
  const url = `http://${Config.ip}:${Config.port}/oauth/token`;
  const clientId = 'logsystem';
  const clientPw = 'D3G#2rg&1';
  const headers = new Headers();
  headers.append('Authorization', 'Basic ' + Base64.encode(clientId + ":" + clientPw));
  headers.append('Content-Type', "application/x-www-form-urlencoded");
  const body = new URLSearchParams();
  body.append('username', 'default');
  body.append('password', password);
  body.append('grant_type', 'password');
  const respond = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: body,
  });
  checkRespondStatus(respond);
  return respond.json();
}
function checkRespondStatus(respond) {
  if (respond.status !== 200) {
    throw RESP_ERROR;
  }
}