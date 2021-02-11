import {
  all,
  call,
  fork,
  put,
  StrictEffect,
  takeEvery,
} from 'redux-saga/effects'
import { searchError, searchSuccess } from './actions'
import { makeGetRequest } from '../../utils/api'
import { MoviesActionTypes, SearchMoviesResult } from './types'
import { AppAction } from '../../utils/appAction'

function* handleSearch(action: AppAction) {
  try {
    const res: SearchMoviesResult = yield call(
      makeGetRequest,
      `s=${action.payload}`
    )

    if (res.Error) {
      yield put(searchError(res.Error))
    } else if (res.Search.length === 0) {
      yield put(
        searchError('There are no movies found. Try another search request.')
      )
    } else {
      yield put(searchSuccess(res.Search))
    }
  } catch (err) {
    if (err instanceof Error && err.stack) {
      yield put(searchError(err.stack))
    } else {
      yield put(searchError('An unknown error occurred'))
    }
  }
}

function* watchFetchRequest() {
  yield takeEvery(MoviesActionTypes.SEARCH_REQUEST, handleSearch)
}

function* moviesSaga(): Generator<StrictEffect, void, void> {
  yield all([fork(watchFetchRequest)])
}

export default moviesSaga
