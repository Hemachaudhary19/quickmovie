import React from 'react'
const dateFormat =(date)=> {
  return new Date(date).toLocaleString('en-US',{
 weekday:'short',
 month:'long',
 day:'numeric',
 minute:'numeric'
  }) 
}
export default dateFormat