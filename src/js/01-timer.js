import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const dateInput = document.querySelector(`#datetime-picker`);
const startBtn = document.querySelector('[data-start]');
const days_ = document.querySelector('[data-days]');
const hours_ = document.querySelector('[data-hours]');
const minutes_ = document.querySelector('[data-minutes]');
const seconds_ = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;
startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const picked = selectedDates[0];

    if (picked <= new Date()) {
      startBtn.disabled = true;
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      startBtn.disabled = false;
    } else {
      userSelectedDate = picked;
      startBtn.disabled = false;
    }
  },
};

flatpickr(dateInput, options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimer() {
  const now = new Date();
  const timeDifference = userSelectedDate - now;

  if (timeDifference <= 0) {
    clearInterval(timerId);
    days_.textContent = '00';
    hours_.textContent = '00';
    minutes_.textContent = '00';
    seconds_.textContent = '00';
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeDifference);

  days_.textContent = addLeadingZero(days);
  hours_.textContent = addLeadingZero(hours);
  minutes_.textContent = addLeadingZero(minutes);
  seconds_.textContent = addLeadingZero(seconds);
}

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  dateInput.disabled = true;
  timerId = setInterval(updateTimer, 1000);
});
