import React, { useEffect, useState } from "react";
import QualifyingResults from "./QualifyingResults";
import Button from '@mui/material/Button';

function QualifyingTemplate() {
  const [rawData, setRawData] = useState({});
  const [processedData, setProcessedData] = useState({q3: {x: [], y: []}, q2: {x: [], y: []}, q1: {x: [], y: []}});
  const [events, setEvents] = useState([]);
  const [track, setTrack] = useState("");

  function processData(data) {
    if (!data.MRData.RaceTable.Races.length) return;
    let processedData = {q3: {x: [], y: []}, q2: {x: [], y: []}, q1: {x: [], y: []}}
    let poleTime = new Date("1970-01-01 " + ("00:" + data.MRData.RaceTable.Races[0].QualifyingResults[0].Q3)).getTime();

    let q1Times = data.MRData.RaceTable.Races[0].QualifyingResults.map(driver => {if (driver.Q1 !== "") {return driver.Q1}});
    let q2Times = data.MRData.RaceTable.Races[0].QualifyingResults.map(driver => {if (driver.Q2 !== "") {return driver.Q2}});

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
      if (driver.Q3 && driver.Q3 !== "") {
        processedData.q3.x.push(`${driver.Driver.givenName} ${driver.Driver.familyName}`);
        processedData.q3.y.push((new Date("1970-01-01 " + ("00:" + driver.Q3)).getTime() - poleTime)/1000);
      }
      if (driver.Q2 && driver.Q2 !== "") {
        processedData.q2.x.push(`${driver.Driver.givenName} ${driver.Driver.familyName}`);
        processedData.q2.y.push((new Date("1970-01-01 " + ("00:" + driver.Q2)).getTime() - fastestQ2)/1000);
      }
      if (driver.Q1 && driver.Q1 !== "") {
        processedData.q1.x.push(`${driver.Driver.givenName} ${driver.Driver.familyName}`);
        processedData.q1.y.push((new Date("1970-01-01 " + ("00:" + driver.Q1)).getTime() - fastestQ1)/1000);
      }
    });
    setProcessedData(processedData);
  }

  function fetchQualiData(round) {
    var requestOptions = {
        method: "GET",
        redirect: "follow",
      };
  
      fetch(`https://ergast.com/api/f1/2021/${round}/qualifying.json`, requestOptions)
        .then((response) => response.text())
        .then((result) => {setRawData(JSON.parse(result))})
        .catch((error) => console.log("error", error));
  }

  useEffect(() => {
    if (rawData.MRData) {
      processData(rawData);
    }
  }, [rawData]);

  useEffect(() => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      fetch("https://ergast.com/api/f1/current.json", requestOptions)
        .then(response => response.text())
        .then(result => {
            let res = JSON.parse(result);
            setEvents(res.MRData.RaceTable.Races)
        })
        .catch(error => console.log('error', error));
  }, []);
  return (
    <div className="App">
        <h3>Choose a circuit</h3>
        {events.map(circuit => (
            <Button onClick={() => {fetchQualiData(circuit.round); setTrack(circuit.Circuit.circuitName)}}>{circuit.Circuit.circuitName} - {circuit.date}</Button>
        ))}
    <QualifyingResults processedData={processedData} track={track} />
    </div>
  );
}

export default QualifyingTemplate;
