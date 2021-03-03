import { ipcRenderer } from "electron";
import axios from 'axios';


export function removeDuplicates(myArr: any, prop: any) {
  return myArr.filter((obj: any, pos: number, arr: any) => {
    return arr.map((mapObj: any) => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

export function sendMessageToNode(message: string,payload: any){
  ipcRenderer.send(message,payload)
}

export function shuffle(array: Array<any>) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export function sortArrayOfObjects (targetArray: any, param: any)  {
  function compare(a: any, b: any) {
    if (a[`${param}`] < b[`${param}`]) {
      return -1;
    }
    if (a[`${param}`] > b[`${param}`]) {
      return 1;
    }
    return 0;
  }
  targetArray.sort(compare);
}

export function searchArtistPicture(artist: string|null){
  return new Promise<object|null>((resolve) => {
    if(!artist){
      resolve(null)
    }


    axios({
      method: 'get',
      url: 'https://apiflbdeezer.herokuapp.com/search/?category=artists&query=alessia cara',
      headers: { }
    })
    .then(function (response: any) {
      console.log(JSON.stringify(response.data));
      const pic = response.data.results[0].picture;
      resolve({ picture: pic, artistName:artist });
    })
    .catch(function () {
      resolve(null)
    });
  })
}
