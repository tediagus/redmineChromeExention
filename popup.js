// Initialize button with user's preferred color

// new Datepicker('#multi', {
//                 multiple: true,
//                 inline: true,
//             });
const form = document.getElementById("form");
const selectDates = document.getElementById("selectDates");
const showElement = (element) => {
  element.classList.remove("hidden");
  element.classList.add("visible");
};

const hiddenElement = (element) => {
  element.classList.remove("visible");
  element.classList.add("hidden");
};
async function getApiKey() {
  const text = await fetch("https://redmine.niji.fr/my/api_key").then((a)=> a.text())
  return text.match(/<pre>(.+)<\/pre>/)[1]
}


function generateOptionsForMonth(date = new Date()){
  const numberOfDays = new Date(date.getFullYear(), date.getMonth()+1 , 0).getDate();
  for(let i=1; i<=numberOfDays; i++){
    const dateDay = new Date(date.getFullYear(), date.getMonth() , i+1)
    
    const option = document.createElement("option");
    option.value = dateDay.toISOString().substring(0,10);
    option.innerText = dateDay.toLocaleString("fr-FR",{dateStyle:"full",timeZone: 'UTC' });
    option.disabled = (dateDay.getDay() === 0 || dateDay.getDay() === 1)

    selectDates.appendChild(option);
  }
}
generateOptionsForMonth();





form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  var myHeaders = new Headers();
  const apiKey = await getApiKey()
  console.log("submit", apiKey);
  myHeaders.append("X-Redmine-API-Key", apiKey);
  myHeaders.append("Access-Control-Allow-Origin", "*");
  formData.delete("apiKey");
  const dates = formData.getAll('dates');
  console.log(dates);
  formData.delete("dates");
  dates.forEach((date) => {
    formData.append("time_entry[spent_on]", date);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };

    fetch("https://redmine.niji.fr/time_entries.json", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(date, result))
      .catch((error) => console.error(date, error));
  });
});


