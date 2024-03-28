const loading = document.getElementById("loading");
const finish = document.getElementById("finish");
const form = document.getElementById("form");
const selectDates = document.getElementById("selectDates");
const selectTask = document.getElementById("selectTask");
const progress = document.getElementById("progress");
progress.indeterminate = true;
let projectID

const showElement = (element) => {
  element.classList.remove("hidden");
  element.classList.add("visible");
};

const hiddenElement = (element) => {
  element.classList.remove("visible");
  element.classList.add("hidden");
};

const STEP = {
  START: 0,
  LOADING: 1,
  FINISH: 2
}

function changeStep(step) {

  switch (step) {
    case STEP.START:
      showElement(form)
      hiddenElement(loading)
      hiddenElement(finish)
      break;
    case STEP.LOADING:
      hiddenElement(form)
      showElement(loading)
      hiddenElement(finish)
      break;
    case STEP.FINISH:

      getCurrentTab().then((tab) => {

        //redirect to time past 
        const url = gotoRedmine() + '/projects/' + projectID + '/time_entries?utf8=%E2%9C%93&set_filter=1&sort=spent_on%3Adesc&f%5B%5D=spent_on&op%5Bspent_on%5D=m&f%5B%5D=user_id&op%5Buser_id%5D=%3D&v%5Buser_id%5D%5B%5D=me&f%5B%5D=&c%5B%5D=spent_on&c%5B%5D=user&c%5B%5D=activity&c%5B%5D=issue&c%5B%5D=comments&c%5B%5D=hours&group_by=&t%5B%5D=hours&t%5B%5D='

        if (tab && tab.id) {
          chrome.tabs.update(tab.id, { url: url });
        } else {
          chrome.tabs.create({ url: url });
        }
      })
      /*    hiddenElement(form)
         hiddenElement(loading)
         showElement(finish) */
      break;
  }

}

changeStep(STEP.START)

let API_KEY = null;
async function getApiKey() {
  if (!API_KEY) {
    try {
      const text = await fetch("https://redmine.niji.fr/my/api_key").then((a) => a.text())
      //console.log(text)
      API_KEY = text.match(/<pre>(.+)<\/pre>/)[1];

    } catch (e) {
      return null
    }
  }
  return API_KEY;
}




function generateOptionsForMonth(date = new Date()) {
  const numberOfDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  for (let i = 1; i <= numberOfDays; i++) {
    const dateDay = new Date(date.getFullYear(), date.getMonth(), i + 1)

    const option = document.createElement("option");
    option.value = dateDay.toISOString().substring(0, 10);
    option.innerText = dateDay.toLocaleString("fr-FR", { dateStyle: "full", timeZone: 'UTC' });
    option.disabled = (dateDay.getDay() === 0 || dateDay.getDay() === 1)

    selectDates.appendChild(option);
  }
}
generateOptionsForMonth();




async function generateListTask(apiKey, date = new Date()) {
  const startMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
  const endMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

  var myHeaders = new Headers();
  myHeaders.append("X-Redmine-API-Key", apiKey);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const issues = (await fetch(`https://redmine.niji.fr/issues.json?start_date=><${startMonth}|${endMonthDate}&limit=500`, requestOptions)
    .then(response => response.json())).issues

  const tasks = issues.filter((i) => i.tracker.id === 7).map((t) => {
    if (t.parent) {
      t.parentSubject = issues.find((i) => i.id === t.parent.id).subject
    }
    return t
  })


  for (let t of tasks) {
    const option = document.createElement("option");
    option.value = t.id;
    option.innerText = `${t.fixed_version.name} - ${t.subject} (${t.parentSubject})`;

    selectTask.appendChild(option);
  }
}


function gotoRedmine() {
  return 'https://redmine.niji.fr/'
}


async function launch() {

  const apiKey = await getApiKey()
  if (!apiKey) {
    chrome.tabs.create({ url: gotoRedmine() });
  }
  await generateListTask(apiKey)
}

launch();



form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  changeStep(STEP.LOADING);
  var myHeaders = new Headers();
  const apiKey = await getApiKey()
  // console.log("submit", apiKey);
  myHeaders.append("X-Redmine-API-Key", apiKey);
  myHeaders.append("Access-Control-Allow-Origin", "*");
  formData.delete("apiKey");
  const dates = formData.getAll('dates');
  //console.log(dates);
  formData.delete("dates");
  await Promise.allSettled(dates.map(async (date) => {
    formData.append("time_entry[spent_on]", date);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };

    await fetch("https://redmine.niji.fr/time_entries.json", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        projectID = result.time_entry.project.id;
        console.log(date, result)
      })
      .catch((error) => console.error(date, error));
  }));

  changeStep(STEP.FINISH);




});



async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
