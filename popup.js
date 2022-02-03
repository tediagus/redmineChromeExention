// Initialize button with user's preferred color

// new Datepicker('#multi', {
//                 multiple: true,
//                 inline: true,
//             });
const form = document.getElementById("form");
console.log(form);
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

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  var myHeaders = new Headers();
  const apiKey = await getApiKey()
  console.log("submit", apiKey);
  myHeaders.append("X-Redmine-API-Key", apiKey);
  myHeaders.append("Access-Control-Allow-Origin", "*");
  formData.delete("apiKey");
  const dates = formData.get("dates").split(",");
  formData.delete("dates");
  dates.forEach((date) => {
    formData.append("time_entry[spent_on]", date.replace(/\//g, "-"));
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


