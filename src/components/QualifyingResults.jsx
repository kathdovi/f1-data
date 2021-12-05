import React from "react";
import Plot from "react-plotly.js";

function QualifyingResults(props) {

  return (
    <div>
    <Plot
      data={[
        { type: "bar", x: props.processedData.q3.x, y: props.processedData.q3.y, name: 'Q3' },
      
        { type: "bar", x: props.processedData.q2.x, y: props.processedData.q2.y, name: 'Q2' },
     
        { type: "bar", x: props.processedData.q1.x, y: props.processedData.q1.y, name: 'Q1' },
      ]}
      layout={{ title: `Qualifying Sessions - Delta (sec) to Fastest Laps- ${props.track}`, barmode: 'group'}}
    /> 
    </div>
  );
}

export default QualifyingResults;
