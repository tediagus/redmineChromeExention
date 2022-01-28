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

form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("submit");
  const formData = new FormData(form);
  var myHeaders = new Headers();
  myHeaders.append("X-Redmine-API-Key", formData.get("apiKey"));
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


