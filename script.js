let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
let count = 1; //COUNT for added elements//

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');

//Title input gets selected here//
const eventTitleInput1 = document.getElementById('eventTitleInput1');
const eventTitleInput2 = document.getElementById('eventTitleInput2')
//Description Input gets selected here//
const eventDescriptionInput1 = document.getElementById('eventDescriptionInput1');
const eventDescriptionInput2 = document.getElementById('eventDescriptionInput2');

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function createDiv() {
  //Create the Div//
  var newDiv = document.createElement("div");
  newDiv.setAttribute("id", "eventContainer2");
  //Add child p into the div//
  var childElement = document.createElement("p");
  childElement.setAttribute("id", "eventText2");
  var childElement2 = document.createElement("p");
  childElement.setAttribute("id", "descriptionText2");
  //Append eventText2 and DescriptionText2 to EventContainer"//
  document.getElementById("eventContainer2").appendChild(childElement);
  document.getElementById("eventContainer2").appendChild(childElement2);
  //return newDiv//
}


function openModal(date) {  //What happens when you click into the square//
  clicked = date;

  const eventForDay = events.find(e => e.date === clicked);

  if (eventForDay) {
    //If there is event, then it will display the existing event//
    //EVENT OBJECT IS BELOW//
    document.getElementById(`eventText${count}`).innerText = eventForDay.title; //If there is event, it will display the TITLE of the event//
    document.getElementById(`descriptionText${count}`).innerText = eventForDay.description; //Added description//
    newEventModal.style.display = "block"; //Still shows new Event Box now//
    createDiv(); //Creates div when you press Save//
    count += 1; //Increases count by 1 for description2/eventText2//
    document.getElementById("eventContainerMain").appendChild(newDiv); //Adds newDiv into the eventContainerMain//
    console.log(count);

  } else {
    //If there is no event, then it will display the add event block//
    newEventModal.style.display = 'block';
  }

  backDrop.style.display = 'block';
}


function load() { // What happens on load//
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  document.getElementById('monthDisplay').innerText = 
    `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

  calendar.innerHTML = '';

  for(let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      const eventForDay = events.find(e => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener('click', () => openModal(dayString));
    } else {
      daySquare.classList.add('padding');
    }

    calendar.appendChild(daySquare);    
  }
}

function closeModal() { //closes Modal (popUp block)//
  eventTitleInput.classList.remove('error');
  eventDescriptionInput.classList.remove('error');
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  eventDescriptionInput.value = '';
  clicked = null;
  load();
}
 


function saveEvent() { //What happens when you press the Save Button//
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error');
    eventDescriptionInput.classList.remove('error');
    events.push({  //This is where the data is pushed to the array//
      date: clicked,
      title: eventTitleInput`${count}`.value, //Object property of title, can add description below//
      description: eventDescriptionInput`${count}`.value,  // Added description to the object now//
    });
 
    localStorage.setItem('events', JSON.stringify(events)); 
    closeModal();
  } else {
    eventTitleInput.classList.add('error');
  }
}



function deleteEvent() {
  events = events.filter(e => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });

  document.getElementById('saveButton').addEventListener('click', saveEvent); //Event Listener for Save button//
  document.getElementById('cancelButton').addEventListener('click', closeModal); //Event Listener for Cancel button//
  document.getElementById('deleteButton').addEventListener('click', deleteEvent); //Event Listener for Delete Button//
  document.getElementById('closeButton').addEventListener('click', closeModal); //Event Listener for Close button//
}

initButtons();
load();
