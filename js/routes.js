const dashboardButton = document.querySelector('#dashboardButton');
const compareButton = document.querySelector('#compareButton');
const stateButton = document.querySelector('#stateButton');
const stateDailyButton = document.querySelector('#stateDailyButton');
const dateButton = document.querySelector('#dateButton');
const dashboardComponent = document.querySelector('#dashboardComponent');
const compareComponent = document.querySelector('#compareComponent');
const stateDailyComponent = document.querySelector('#stateDailyComponent');
const stateComponent = document.querySelector('#stateComponent');
const dateComponent = document.querySelector('#dateComponent');

dashboardButton.onclick = () => {
    dashboardComponent.classList.remove('d-none');
    compareComponent.classList.add('d-none');
    stateDailyComponent.classList.add('d-none');
    stateComponent.classList.add('d-none');
    dateComponent.classList.add('d-none');
}

compareButton.onclick = () => {
    compareComponent.classList.remove('d-none');
    dashboardComponent.classList.add('d-none');
    stateDailyComponent.classList.add('d-none');
    stateComponent.classList.add('d-none');
    dateComponent.classList.add('d-none');
}

stateDailyButton.onclick = () => {
    stateDailyComponent.classList.remove('d-none');
    stateComponent.classList.add('d-none');
    compareComponent.classList.add('d-none');
    dashboardComponent.classList.add('d-none');
    dateComponent.classList.add('d-none');
}

stateButton.onclick = () => {
    stateComponent.classList.remove('d-none');
    compareComponent.classList.add('d-none');
    stateDailyComponent.classList.add('d-none');
    dashboardComponent.classList.add('d-none');
    dateComponent.classList.add('d-none');
}

dateButton.onclick = () => {
    dateComponent.classList.remove('d-none');
    compareComponent.classList.add('d-none');
    stateDailyComponent.classList.add('d-none');
    dashboardComponent.classList.add('d-none');
    stateComponent.classList.add('d-none');
}
