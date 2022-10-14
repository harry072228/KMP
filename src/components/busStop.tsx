import styles from '../busStop.module.css'


interface Stop{
    route : string
    bound: string
    service_type: string
    orig_en: string
    orig_tc: string
    orig_sc: string
    dest_en: string
    dest_tc: string
    onSubmit:()=>void
    
  }


  export function BusStopName(stop: Stop) {

	
	return (
		<div className={styles.container} onClick={stop.onSubmit}>
		<div className={styles.route}>{stop.route}</div>	
  <div className={styles.locationName}>
    <div><span className={styles.work}>往</span>{stop.orig_tc}</div>
    <div className={styles.dest_tc}>{stop.dest_tc}</div>
    </div>

		</div>
	)
}
