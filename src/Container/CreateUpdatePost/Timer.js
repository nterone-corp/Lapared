import React, { useState, useEffect } from 'react';
import {Text, View} from "react-native";

const Timers = (props) =>{

    let [recordTimer, setRecordTimer] = useState("");

    useEffect(() => {
        var countDownDate = new Date().getTime();
    
        let timerInterval = setInterval(()=> {
     
          // Get today's date and time
          var now = new Date().getTime();
        
          // Find the distance between now and the count down date
          var distance = now - countDownDate ;
        
          // Time calculations for days, hours, minutes and seconds
          var days = Math.floor(distance / (1000 * 60 * 60 * 24));
          var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            let timer = "" ;
            if(days){
              timer= days + ":";
            }
            if(hours){
              timer= timer + hours + ":";
            }
            // if(minutes){
              if(minutes.length == 2){
                timer= timer + (minutes) + "";
              } else{
              timer= timer + "0" + minutes + ":";
              }
            // }
            // if(seconds){
              if(seconds.length == 2){
                timer= timer + (seconds) + "";
              }else{
                timer= timer + "0" + (seconds) + "";
              }
      
          // }
           
         
           if(seconds > 15){
            setRecordTimer("")
            clearTimeout(timerInterval)
            props.stopVideo()

           }else{
            setRecordTimer(timer)
           }
           console.log("recordTimer",timer)
      }, 1000);

      return () => clearTimeout(timerInterval);
    }, []);
    
    return(<Text style={{color : "white", fontSize: 20}}> {recordTimer} </Text>)
}

export default Timers;