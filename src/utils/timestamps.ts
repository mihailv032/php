

export function addTimestamp(obj:any){
  obj.expires = new Date();
  obj.updatedAt = new Date();
  return obj;
}

export function checkTimestamp(obj:any,ttl:number):boolean{
  if(obj.expires){
    let now = new Date();
    let expires = new Date(obj.expires);
    let diff = now.getTime() - expires.getTime();
    return diff > ttl
  }
  return true;
  
}
