import { useEffect, useState } from "react";
import styles from '../busStop.module.css'


interface Props{
    name_tc:string
times:number[]
    
}

  export function BusStopDetail(props:Props) {


    
    let eta:number | Date= new Date('2022-10-13T19:48:20+08:00')
    let date:number | Date = new Date("2022-10-13T19:39:14+08:00")




	return (
        <div className={styles.container}>
        <div className={styles.name_tc}>{props.name_tc}</div>
        <div className={styles.name_tc}>        {props.times.map((time,index)=> <div key={index} className={styles.time}>{time}分鐘</div>)}</div>
    
       
   
       </div>
	)
}
