import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import ExperimentMetadataContainer from '../../components/containers/experiment-metadata-container';
import datasetReducer from '../../reducers/dataset-reducer';
import * as datasetActions from '../../actions/dataset-actions';


Enzyme.configure({ adapter: new Adapter() });

describe('ExperimentMetadataContainer', () => {
  let store, emc;

  /* eslint-disable camelcase */
  const fetchedDatasets = [
    {
      date: '2016-12-31',
      populations: {
        A: { total_clients: 100, total_pings: 200 },
        B: { total_clients: 1000, total_pings: 1100 },
        C: { total_clients: 2000, total_pings: 2100 },
      },
    },
    {
      date: '2017-01-01',
      populations: {
        A: { total_clients: 200, total_pings: 300 },
        B: { total_clients: 2000, total_pings: 2100 },
        C: { total_clients: 3000, total_pings: 3100 },
      },
    },
    {
      date: '2017-02-28',
      populations: {
        A: { total_clients: 300, total_pings: 400 },
        B: { total_clients: 3000, total_pings: 3100 },
        C: { total_clients: 4000, total_pings: 4100 },
      },
    },
    {
      date: '2017-04-30',
      populations: {
        A: { total_clients: 400, total_pings: 500 },
        B: { total_clients: 4000, total_pings: 4100 },
        C: { total_clients: 5000, total_pings: 5100 },
      },
    },
    {
      date: '2017-05-01',
      populations: {
        A: { total_clients: 500, total_pings: 600 },
        B: { total_clients: 5000, total_pings: 5100 },
        C: { total_clients: 6000, total_pings: 6100 },
      },
    },
    {
      date: '2017-07-31',
      populations: {
        A: { total_pings: 600 },
        B: {},
        C: { total_clients: 6000 },
      },
    },
    {
      date: '2017-08-01',
      populations: {
        A: {},
        B: {},
        C: {},
      },
    },
  ];
  /* eslint-enable camelcase */

  const reducers = combineReducers({
    datasetState: datasetReducer,
  });

  beforeEach(() => {
    store = createStore(reducers);
    store.dispatch(datasetActions.getDatasetsSuccess(fetchedDatasets));
    store.dispatch(datasetActions.changeDataset(fetchedDatasets[0]));
    emc = Enzyme.mount(<Provider store={store}><ExperimentMetadataContainer /></Provider>);
  });

  it('Date is parsed correctly', () => {
    const dateElm = emc.find('.experiment-date');

    expect(dateElm.text()).toContain('December 31, 2016');

    store.dispatch(datasetActions.changeDataset(fetchedDatasets[1]));
    expect(dateElm.text()).toContain('January 1, 2017');

    store.dispatch(datasetActions.changeDataset(fetchedDatasets[2]));
    expect(dateElm.text()).toContain('February 28, 2017');

    store.dispatch(datasetActions.changeDataset(fetchedDatasets[3]));
    expect(dateElm.text()).toContain('April 30, 2017');

    store.dispatch(datasetActions.changeDataset(fetchedDatasets[4]));
    expect(dateElm.text()).toContain('May 1, 2017');

    store.dispatch(datasetActions.changeDataset(fetchedDatasets[5]));
    expect(dateElm.text()).toContain('July 31, 2017');

    store.dispatch(datasetActions.changeDataset(fetchedDatasets[6]));
    expect(dateElm.text()).toContain('August 1, 2017');
  });

  it('Client count is correct', () => {
    const clientElm = emc.find('.experiment-num-clients');

    expect(clientElm.text()).toContain('3,100');

    store.dispatch(datasetActions.changeDataset(fetchedDatasets[1]));
    expect(clientElm.text()).toContain('5,200');

    store.dispatch(datasetActions.changeDataset(fetchedDatasets[2]));
    expect(clientElm.text()).toContain('7,300');

    store.dispatch(datasetActions.changeDataset(fetchedDatasets[3]));
    expect(clientElm.text()).toContain('9,400');

    store.dispatch(datasetActions.changeDataset(fetchedDatasets[4]));
    expect(clientElm.text()).toContain('11,500');

    store.dispatch(datasetActions.changeDataset(fetchedDatasets[5]));
    expect(clientElm.text()).toContain('6,000');

    store.dispatch(datasetActions.changeDataset(fetchedDatasets[6]));
    expect(clientElm.text()).toContain('0');
  });

  it('Ping count is correct', () => {
    const pingElm = emc.find('.experiment-num-pings');

    expect(pingElm.text()).toContain('3,400');

    store.dispatch(datasetActions.changeDataset(fetchedDatasets[1]));
    expect(pingElm.text()).toContain('5,500');

    store.dispatch(datasetActions.changeDataset(fetchedDatasets[2]));
    expect(pingElm.text()).toContain('7,600');

    store.dispatch(datasetActions.changeDataset(fetchedDatasets[3]));
    expect(pingElm.text()).toContain('9,700');

    store.dispatch(datasetActions.changeDataset(fetchedDatasets[4]));
    expect(pingElm.text()).toContain('11,800');

    store.dispatch(datasetActions.changeDataset(fetchedDatasets[5]));
    expect(pingElm.text()).toContain('600');

    store.dispatch(datasetActions.changeDataset(fetchedDatasets[5]));
    expect(pingElm.text()).toContain('0');
  });
});
