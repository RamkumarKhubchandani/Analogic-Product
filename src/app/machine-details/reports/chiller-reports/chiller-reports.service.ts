import { Injectable } from '@angular/core';

import { RestApi } from '../../../core/services/rest.service';
import { GlobalErrorHandler } from '../../../core/services/error-handler';

import * as moment from "moment";

@Injectable()
export class ChillerReportsService {

  constructor(private rest : RestApi) { }

  formatDate = dt => moment(dt).format("YYYY-MM-DD HH:mm:ss.SSS");
  formatDateOee = dt => moment(dt).format("YYYY-MM-DD 00:00:00.000");

  // getName(machineId:number){
  //   return this.rest.get(`config/associativename/${machineId}`);

  // }
  // getColumn(machineId:string) {
  //   return  this.rest.get(`utility/utilityColumns/${machineId}`);

  // }
  // getMonitor(machineName,from,to,interval) {
  //   return  this.rest.post(`utility/utilityMonitoring`,{"machine_name" : machineName,"start_time" : from,"end_time" : to,"interval" : interval});
    
  // }
  // getSummary(machineName,from,to,interval) {
  //   return  this.rest.post(`utility/utilitySummary`,{"machine_name" : machineName,"start_time" : from,"end_time" : to,"interval" : interval});

  // }
  getColumn(machineId:string) {
    return  this.rest.get(`generic/genericColumns/${machineId},all`);

  }
   
   
   

  getName(machineId:number){
    return this.rest.get(`config/associativename/${machineId}`);

  }

  
  // getColumn(machineId:string) {
  //   return  this.rest.get(`utility/utilityColumns/${machineId}`);

  // }
  getMonitor(machineName,from,to,interval) {
    return  this.rest.post(`generic/MonitoringDashboard`,{"machine_name" : machineName,"start_time" : from,"end_time" : to,"interval" : interval});
    
  }
  getSummary(machineName,from,to,interval) {
    return  this.rest.post(`generic/SummaryDashboard`,{"machine_name" : machineName,"start_time" : from,"end_time" : to,"interval" : interval});

  }


}
