import React, { useState } from 'react';
import './table.css';
const Table = (props) => {
  return (
    <div>
      <div className='table-wrapper'>
        <table>
          {props.headData && props.renderHead ? (
            <thead>
              <tr>
                {props.headData.map((item, index) =>
                  props.renderHead(item, index)
                )}
              </tr>
            </thead>
          ) : null}
          {props.renderBody ? <tbody>{props.renderBody}</tbody> : null}
        </table>
      </div>
    </div>
  );
};

export default Table;
