import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

function Dec4Quali() {
  const [rawData, setRawData] = useState({});
  const [processedData, setProcessedData] = useState({q3: {x: [], y: []}, q2: {x: [], y: []}, q1: {x: [], y: []}});


  function processData(data) {
    let processedData = {q3: {x: [], y: []}, q2: {x: [], y: []}, q1: {x: [], y: []}}
    let poleTime = new Date("1970-01-01 " + ("00:" + data.MRData.RaceTable.Races[0].QualifyingResults[0].Q3)).getTime();

    let q1Times = data.MRData.RaceTable.Races[0].QualifyingResults.map(driver => driver.Q1);
    let q2Times = data.MRData.RaceTable.Races[0].QualifyingResults.map(driver => driver.Q2);
    console.log(q1Times, q2Times)
    let fastestQ1 = null;
    let fastestQ2 = null;

    q2Times.forEach(time => {
      let parsedTime = new Date("1970-01-01 " + ("00:" + time)).getTime();
      if (!fastestQ2 || parsedTime < fastestQ2) {fastestQ2 = parsedTime}
    });
    q1Times.forEach(time => {
      let parsedTime = new Date("1970-01-01 " + ("00:" + time)).getTime();
      if (!fastestQ1 || parsedTime < fastestQ1) {fastestQ1 = parsedTime}
    });

    data.MRData.RaceTable.Races[0].QualifyingResults.forEach(driver => {
      if (driver.Q3) {
        processedData.q3.x.push(`${driver.Driver.givenName} ${driver.Driver.familyName}`);
        processedData.q3.y.push((new Date("1970-01-01 " + ("00:" + driver.Q3)).getTime() - poleTime)/1000);
      }
      if (driver.Q2) {
        processedData.q2.x.push(`${driver.Driver.givenName} ${driver.Driver.familyName}`);
        processedData.q2.y.push((new Date("1970-01-01 " + ("00:" + driver.Q2)).getTime() - fastestQ2)/1000);
      }
      if (driver.Q1) {
        processedData.q1.x.push(`${driver.Driver.givenName} ${driver.Driver.familyName}`);
        processedData.q1.y.push((new Date("1970-01-01 " + ("00:" + driver.Q1)).getTime() - fastestQ1)/1000);
      }
    });
    setProcessedData(processedData);
  }

  useEffect(() => {
    if (rawData.MRData) {
      processData(rawData);
    }
  }, [rawData]);

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("https://ergast.com/api/f1/2021/21/qualifying.json", requestOptions)
      .then((response) => response.text())
      .then((result) => {setRawData(JSON.parse(result))})
      .catch((error) => console.log("error", error));
  }, []);
  return (
    <div>
    <Plot
      data={[
        { type: "bar", x: processedData.q3.x, y: processedData.q3.y, name: 'Q3' },
      
        { type: "bar", x: processedData.q2.x, y: processedData.q2.y, name: 'Q2' },
     
        { type: "bar", x: processedData.q1.x, y: processedData.q1.y, name: 'Q1' },
      ]}
      layout={{ title: "Qualifying Delta to Fastest Laps - Saudi Arabia", barmode: 'group'}}
    />
    </div>
  );
}

export default Dec4Quali;
