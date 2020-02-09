

    import { Component, ViewChild } from '@angular/core';  
    import { CSVRecord } from './CSVModels';  
    import { stringify } from 'querystring';
      
    @Component({  
      selector: 'app-root',  
      templateUrl: './app.component.html',  
      styleUrls: ['./app.component.css']  
    })  
      
    export class AppComponent {  
      title = 'csvLoader';  
      
      public records: any[] = [];  
      public mostSoldVehicle:any;
      @ViewChild('csvLoader',{static:false}) csvLoader: any;  
      
      //main function that hits on uploading file in file upload
      uploadListener($event: any): void {  
      
        let text = [];  
        let files = $event.srcElement.files;  
      
        if (this.isValidCSVFile(files[0])) {  
      
          let input = $event.target;  
          let reader = new FileReader();  
          reader.readAsText(input.files[0]);  
      
          reader.onload = () => {  
            let csvData = reader.result; 
            let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);    
            this.getDataRecordsArrayFromCSVFile(csvRecordsArray, (this.getHeaderArray(csvRecordsArray)).length);          
          };        
          reader.onerror = function () {  
            console.log('error is occured while reading file!');  
          };        
        } else {  
          alert("Please import valid .csv file.");  
          this.fileReset();  
        }  
      }  
      
      //Function to get csv records in array and most often sold vehicle
      getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {  
        let csvArr = [];  
      
        for (let i = 1; i < csvRecordsArray.length; i++) {   
          let curruntRecord  = (<string>csvRecordsArray[i]).match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g); 
          curruntRecord = curruntRecord || [];          
          if (curruntRecord.length == headerLength) { 
            let csvRecord: CSVRecord = new CSVRecord(); 
            csvRecord.id= i;
            csvRecord.dealNumber = curruntRecord[0].trim();  
            csvRecord.customerName = curruntRecord[1].trim().replace(/[\[\]"]+/g,"");  
            csvRecord.dealershipName = curruntRecord[2].trim().replace(/[\[\]"]+/g,"");
            csvRecord.vehicle = curruntRecord[3].trim().replace(/[\[\]"]+/g,"");  
            csvRecord.price =curruntRecord[4].trim().replace(/[\[\]"]+/g,"").replace(/[\[\],]+/g,'.');  
            csvRecord.date = curruntRecord[5].trim(); 
            csvArr.push(csvRecord); 

            let csvVehicle = curruntRecord[3].trim();
            let counts = {}; 
            let compare = 0;  
            var mostFrequent:any;
            if(counts[csvVehicle] === undefined){ 
            counts[csvVehicle] = 1;   
            }else{                 
              counts[csvVehicle] = counts[csvVehicle] + 1; 
            }      if(counts[csvVehicle] > compare){  
              compare = counts[csvVehicle];   
              mostFrequent = csvVehicle;  
            }
          }  
        }  
        this.mostSoldVehicle =mostFrequent;
        this.records = csvArr;  
      }  
      
      //Function to check that uploaded file is csv.
      isValidCSVFile(file: any) {  
        return file.name.endsWith(".csv");  
      }  
      
      //Function to get csv file header.
      getHeaderArray(csvRecordsArr: any) {  
        let headers = (<string>csvRecordsArr[0]).split(',');  
        let headerArray = [];  
        for (let j = 0; j < headers.length; j++) {  
          headerArray.push(headers[j]);  
        }  
        return headerArray;  
      }  
    

      //Function to reset if file extension is not csv.
      fileReset() {  
        this.csvLoader.nativeElement.value = "";  
        this.records = [];  
      }  
    }  


