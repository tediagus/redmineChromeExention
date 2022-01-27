// Initialize button with user's preferred color

const imputationAction = document.getElementById('btnImputation');
const addAction = document.getElementById('btnAdd');
const btnOption =  document.getElementsByClassName('optionBtn')[0]
const redminForm = document.getElementsByClassName('form_imputation')[0]

const showElement = (element) => {
    element.classList.remove('hidden')
    element.classList.add('visible')
}

const hiddenElement = (element) => {
    element.classList.remove('visible')
    element.classList.add('hidden')
}

imputationAction.addEventListener(('click'),  async () => {
    hiddenElement(btnOption)
    showElement(redminForm)
})

addAction.addEventListener(('click'),  async () => {

    // let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    // chrome.scripting.executeScript({
    //   target: { tabId: tab.id },
    //   function: setPageBackgroundColor,
    // });


    /*

    cle api : 5662c2b0a8835fa9eb1c11cd19df96d92b5ba9be
        utf8: ✓
    authenticity_token: dlZ9QfsURwR3omey0b6PmVvZddZKV1fjNqr531BO+6uKZbrPNjgZK7salFVbxm4HlCCe30sNWJF3PG7vCDGebA==
    issue_id: 141802
    time_entry[issue_id]: 141802
    time_entry[spent_on]: 2022-01-27
    time_entry[hours]: 8
    time_entry[activity_id]: 9
    */
    hiddenElement(redminForm)
    showElement(btnOption)
})


