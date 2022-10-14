import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { BusStopName } from "./components/busStop";
import GoogleBusMap from "./components/googleMap";
import { BusStopDetail } from "./components/stopdetail";

export interface Stop {
  route: string;
  bound: string;
  service_type: string;
  orig_en: string;
  orig_tc: string;
  orig_sc: string;
  dest_en: string;
  dest_tc: string;
  name_tc: string;
  lat: string;
  long: string;
  times:number[]
}
interface RouteStop {
  type: string;
  version: string;
  generated_timestamp: string;
  data: BusDetail[];
}
interface BusDetail {
  route: string;
  bound: string;
  service_type: number;
  seq: string;
  stop: string;
}

interface KmbStop {
  type: string;
  version: string;
  generated_timestamp: string;
  data: BusStopLocation[];
}

interface BusStopLocation {
  stop: string;
  name_en: string;
  name_tc: string;
  name_sc: string;
  lat: string;
  long: string;
}

interface Time {
  route: string;
  dir: string;
  service_type: number;
  eta: string;
  data_timestamp: string;
}

function App() {
  const [busStops, setbusStop] = useState<Stop[]>([]);
  const [busStopDetailData, setbusStopDetailData] = useState<Stop[]>([]);

  // const [busTime, setbusTime] = useState<string>("");
function timeStamp(eta:string,date:string) {
let etaDate =new Date(eta)
let dateDate   =new Date(date)
let etaNumber =Number(etaDate)
let dateNumber=Number(dateDate)

return (Math.floor((etaNumber - dateNumber)/1000/60));
    
}


  async function fetchRoute() {
    let res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route/`);

    let busStop: Stop[] = (await res.json()).data;
    // console.log("busStops:", busStop);

    // let res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-eta/40/1`);

    // let busTimes: any = await res.json()
    // console.log("busStops:", busTimes);

    // setbusStop(busStop);
    setbusStop(busStop);
  }
  {
  }

  async function fetchStopDetail(route: string, bound: string) {
    let res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/stop`);

    let busStopDetail: KmbStop = await res.json();

    let stopRes = await fetch(
      `https://data.etabus.gov.hk/v1/transport/kmb/route-stop`
    );
    let stopDetails: RouteStop = await stopRes.json();

    let result = [];

    for (let stopDetail of busStopDetail.data) {
      result.push({
        ...stopDetail,
        ...stopDetails.data.find(
          (stopReusult) => stopReusult.stop == stopDetail.stop
        ),
      });
    }

    let filteredResult: any = result.filter(
      (eachRoute) => eachRoute.route == route && eachRoute.bound == bound
    );


 let combineResult=[]
for(let result of filteredResult){
  let combineTimeDataArray=[]
  let timeDatas:any=await fetchTime(result.route, result.stop, result.bound)
  console.log("timeDatas:",timeDatas);
  

for(let timeData of timeDatas){
  let time= timeStamp(timeData.eta,timeData.data_timestamp)
 
combineTimeDataArray.push(time)


}
let obj:any={}

console.log("combineTimeDataArray:",combineTimeDataArray);

obj["times"]=combineTimeDataArray

obj["stop"]=result.stop


  
combineResult.push(obj)


}
let combinedData:any=[]

//combineResult: [{shop:"12445",times:[12,13,14]},{shop:"12445",times:[12,13,14]}]


for(let filteredData of filteredResult ){
  combinedData.push({
    ...filteredData,
    //@ts-ignore
    ...combineResult.find(
          //@ts-ignore
      (eachCombineResult) => filteredData.stop == eachCombineResult.stop
    ),
  });

}

setbusStopDetailData(combinedData);
    



  }


  async function fetchTime(route: string, stop: string, bound: string) {
    let res = await fetch(
      ` https://data.etabus.gov.hk/v1/transport/kmb/stop-eta/${stop}`
    );

    let times: Time[] = (await res.json()).data;
    let filteredTimes = times.filter(
      (time) => time.route == route && time.dir == bound
    );

return filteredTimes
  }

  useEffect(() => {
    fetchRoute();
  
  }, [setbusStop]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <div className="busNameBox">
            {busStops.map((busName, index) => (
              <BusStopName
                key={index}
                route={busName.route}
                bound={busName.bound}
                service_type={busName.service_type}
                orig_en={busName.orig_en}
                orig_sc={busName.orig_sc}
                orig_tc={busName.orig_tc}
                dest_en={busName.dest_en}
                dest_tc={busName.dest_tc}
                //@ts-ignore
                onSubmit={() => fetchStopDetail(busName.route, busName.bound)}
              />
            ))}
          </div>
          <div>
            <GoogleBusMap markers={busStopDetailData} />
            <div className="busTime">
              {busStopDetailData.map((stopDetailData, index) => (
                <BusStopDetail key={index} name_tc={stopDetailData.name_tc} times={stopDetailData.times}/>
              ))}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
