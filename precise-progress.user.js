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
            // console.log(">...............<")
            // console.log(data)

            var totalSeconds = data.user.externalTimeSeconds + data.user.watchTime;
            // console.log("TOTAL SECONDS: " + totalSeconds)

            // totalWatchTimeToShow is a decimal that represents how much time is left.
            // If you want a format like 320.15 hrs uncomment the following three lines:
            // const totalHours = (totalSeconds / 60 / 60);
            // var totalWatchTimeToShow = totalHours.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
            // snippet.replaceWith(`${totalWatchTimeToShow} hrs`)


            // Show time using format XXX hrs YY mins
            var hours = Math.floor(totalSeconds / 3600);
            totalSeconds -= hours * 3600

            var minutes = Math.floor(totalSeconds / 60) % 60;
            totalSeconds -= minutes * 60;

            const snippet = document.getElementsByClassName('ds-overall-progression-card__info-label--bold')[1];

            snippet.replaceWith(`${hours} hrs ${minutes} mins`);

            // If you want to append to the current text, use this instead:
            // snippet.appendChild(document.createTextNode(` (${totalWatchTimeToShow} Hrs)`))
        }
    }
}

