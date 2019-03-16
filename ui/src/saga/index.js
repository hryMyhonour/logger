import { takeEvery, takeLatest, put, call, all } from 'redux-saga/effects'
import * as types from '../constant/ActionTypes'
import { encode } from '../protocol/ProtocolUtil'
import Request from '../protocol/Request'
import { getLogBetween, setHost, setInit, loginSuccess, gotoHost, gotoLogin } from '../action'
import * as Api from './fetchData'

function* websocketWatch(socket) {
  yield takeLatest(types.INTO_DIR, (action) => {
    const f = encode(Request.CHANGE_DIR, { path: action.dir });
    socket.send(f);
  })
  yield takeLatest(types.LOAD_LOG, (action) => {
    const f = encode(Request.SUBSCRIBE, { path: action.path });
    socket.send(f);
  })
  yield takeEvery(types.GET_LOG_BETWEEN, (action) => {
    const f = encode(Request.REQUEST_BETWEEN, { path: action.path, skip: action.skip, take: action.take });
    socket.send(f);
  })
  yield takeEvery(types.UPLOAD_TOKEN, (action) => {
    const f = encode(Request.TOKEN, { token: action.token });
    socket.send(f);
  })
}

function* redirectWatch() {
  yield takeEvery(types.FIND_BY_LINE, (action) => {
    put(getLogBetween(action.path, action.lineNo - 1, action.take));
  });
  yield takeEvery(types.RESP_LOGIN_SUCCESS, () => put(gotoHost()));
}

function* httpWatch() {
  yield takeLatest(types.LOGIN, login);
  yield takeLatest(types.FETCH_HOST, getHost);
  yield takeLatest(types.INIT, getInit);
}
function* getHost() {
  try {
    const response = yield call(Api.fetchHosts);
    yield put(setHost(response));
  } catch (e) {
    yield put(gotoLogin());
    return;
  }
}
function* getInit() {
  const response = yield call(Api.fetchInit);
  yield put(setInit(response));
}
function* login(action) {
  try {
    const response = yield call(Api.login, action.password);
    yield put(loginSuccess(response.access_token));
  } catch (e) {
    yield put(gotoLogin('Login account or password error'));
    return;
  }
}

export default function* rootSage(params) {
  yield all([
    websocketWatch(params.socket),
    httpWatch(),
    redirectWatch(),
  ]);
}
