import React from 'react'

function isoTimeFormat(dateTime) {
    const date=new Date(dateTime);
    const localTime = date.toLocaleTimeString('en-Us',{
        hour:'2-digit',
        minute:'2-digit',
        hour12:true,
    })
  return 
  return localTime;  
  
}

export default isoTimeFormat