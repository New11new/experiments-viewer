import React from 'react';

import DescriptionContainer from '../containers/description-container';
import * as utils from '../../utils';


export default function(props) {
  let maybeDataFieldset, maybePopulationsFieldset, maybeChartsFieldset;

  if (props.configureOutliers || props.configureScale) {
    maybeDataFieldset = (
      <fieldset className="configure-data">

        {props.configureOutliers &&
          <div className="configure-outliers">
            <label>
              <input type="checkbox" defaultChecked={props.showOutliers} onChange={props.handleModifyOutliers} />
              Show outliers
            </label>
          </div>
        }

        {props.configureScale &&
          <div className="configure-scale radio-list">
            <span>Scale</span>
            <label><input className="linear" type="radio" name="scale" value="linear" checked={props.scale === 'linear'} onChange={props.handleModifyScale} />Linear</label>
            <label><input className="log" type="radio" name="scale" value="log" checked={props.scale === 'log'} onChange={props.handleModifyScale} />Log</label>
          </div>
        }

      </fieldset>
    );
  }

  if (props.configureCharts) {
    maybeChartsFieldset = (
      <div className={`${props.configureChartsClass} checkbox-list`} onChange={props.handleModifyCharts}>
        <h4>Charts</h4>

        {props.currentDataset.metrics.map(id => {
          const metricMeta = props.metricMetadata[id];
          const checkedByDefault = props.metricIdsToShow.indexOf(id) > -1;

          // Don't show anything if we don't have metadata for this metric ID yet
          if (!metricMeta) return;

          return (
            <label key={id} title={metricMeta.name}>
              <DescriptionContainer rawDescription={metricMeta.description} keepLinebreaks={false} />
              <input type="checkbox"
                     className="cb-metrics"
                     defaultChecked={checkedByDefault}
                     name="metrics"
                     value={id} />
              {metricMeta.name}
            </label>
          );
        })}
      </div>
    );
  }

  return (
    <div className="configuration-mask" onClick={utils.toggleConfigurationModal}>
      <div className="configuration">
        <h3>Configuration</h3>
        <form>
          {maybePopulationsFieldset}
          {maybeDataFieldset}
          {maybeChartsFieldset}
        </form>
      </div>
      <a className="modal-close-btn" />
    </div>
  );
}
