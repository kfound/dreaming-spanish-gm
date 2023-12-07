// ==UserScript==
// @name         Precise Time DS Progress
// @namespace    https://www.dreamingspanish.com
// @version      0.1
// @description  Adds a more precise calculation to the dreaming spanish progress page for total hours
// @author       https://github.com/kfound
// @match        https://www.dreamingspanish.com/progress
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dreamingspanish.com
// @grant        none
// ==/UserScript==

class Main {
  static #instance;

  constructor() {
    if (Main.#instance) {
      throw new Error('Singleton class cannot be instantiated more than once.');
    }
    Main.#instance = this;
  }

  static init() {
    if (!!window.chrome) {
      window.addEventListener("load", () => getData());
    } else {
      getData();
    }
  }

}

Main.init();

async function getData() {

    if (localStorage.length > 0) {
        const key = localStorage.getItem('token');
        if (key !== null) {
            const myHeaders = new Headers({
                'Authorization': 'Bearer ' + key,
                'Content-Type': 'application/x-www-form-urlencoded'
            });

            const dsURL = 'https://www.dreamingspanish.com/.netlify/functions/user';
            const response = await fetch(dsURL, {
                headers: myHeaders,
                method: 'GET'
            })

            const data = await response.json()
            // console.log(">.............. ...<")
            // console.log(data)

            const totalSeconds = data.user.externalTimeSeconds + data.user.watchTime;
            // console.log("TOTAL SECONDS: " + totalSeconds)
            const totalHours = (totalSeconds / 60 / 60)
            // console.log("TOTAL HOURS: " + Number(totalHours).toFixed(2))

            // If you want to always round down (which is what DS does) use this one:
            var totalWatchTimeToShow = totalHours.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
            // Use this one if you want to round up a bit :) 
            // const totalWatchTimeToShow = Number(totalHours).toFixed(2)


            const snippet = document.getElementsByClassName('ds-overall-progression-card__info-label--bold')[1];

            snippet.replaceWith(`${totalWatchTimeToShow} hrs`)

            // If you want to append to the current text, use this instead:
            // snippet.appendChild(document.createTextNode(` (${totalWatchTimeToShow} Hrs)`))
        }
    }
}


