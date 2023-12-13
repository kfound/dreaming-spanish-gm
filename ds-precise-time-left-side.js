// ==UserScript==
// @name         Dreaming Spanish Precise Time on Left Side
// @namespace    https://www.dreamingspanish.com
// @version      0.3
// @description  Adds more precise time totals to left side of page under the Daily Goal circle. Page must be wide enough to have left column visible
// @author       https://github.com/kfound
// @match        https://www.dreamingspanish.com/watch*
// @match        https://www.dreamingspanish.com/progress*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dreamingspanish.com
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle ( `
    .ds-precise-time-left {
       font-size: 12px;
       font-weight: 600;
       text-align: center;

       line-height: 15px;
       margin: 1rem 0 0;
    }

    .ds-precise-time-left--tiny {
        font-size: 9px;
        font-weight: 400;
        text-align: center;
    }

` );

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

            var totalSeconds = data.user.externalTimeSeconds + data.user.watchTime;
            // console.log("Total seconds = " + totalSeconds);

            // console.log("TOTAL HOURS: " + Number(totalHours).toFixed(2))

            // Show time using format XXX hrs YY mins
            var hours = Math.floor(totalSeconds / 3600);
            totalSeconds -= hours * 3600;

            var minutes = Math.floor(totalSeconds / 60) % 60;
            totalSeconds -= minutes * 60;

            const location = document.getElementsByClassName('ds-sidebar-daily-goal__doughnut')[0];


            var input=document.createElement("input");
            input.type="button";
            input.id="updateTimeButton";
            input.value="update";
            input.onclick = getData;
            input.setAttribute("class", "ds-precise-time-left--tiny");


            var newdiv = document.createElement('div');
            newdiv.setAttribute("class", "ds-precise-time-left");

            var newp = document.createElement('p');
            newp.appendChild(document.createTextNode(`TOTAL: ${hours} h ${minutes} m `));
            newp.appendChild(document.createElement('br'));
            newp.appendChild(input);
            newp.appendChild(document.createElement('br'));

            var smallp = document.createElement('div');
            smallp.setAttribute("class", "ds-precise-time-left--tiny");

            var now = new Date().toLocaleString()
            smallp.appendChild(document.createTextNode(now));
            newp.appendChild(smallp);
            newdiv.appendChild(newp);

            var myDiv = document.getElementsByClassName('ds-precise-time-left');

            if (myDiv.length === 0) {
                // If the precise-item-left div doesn't exist yet, that's
                // because this is the first time this page has been loaded.
                // console.log("does not exist yet");

                location.parentNode.appendChild(newdiv);

            } else {
                // The div already exists, we need to replace the content inside it with the new info
                // console.log("replacing...");
                var firstdiv = myDiv[0];
                firstdiv.parentNode.replaceChild(newdiv, firstdiv);
            }
        }
    }
}


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
