let habits = JSON.parse(localStorage.getItem('habits') || '[]');
let habitCompletions = JSON.parse(localStorage.getItem('habitCompletions') || '{}');
let selectedDate = new Date();

document.addEventListener('DOMContentLoaded', () => {
  renderCalendar();
  renderHabits();
  updateStats();
  updateSelectedDateDisplay();
});

function addHabit() {
  const input = document.getElementById('habitInput');
  const name = input.value.trim();
  if (!name) return;
  habits.push({ id: Date.now(), name });
  input.value = '';
  saveData(); renderHabits(); updateStats();
}

function renderCalendar() {
  const container = document.getElementById('calendar');
  container.innerHTML = '';
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  weekdays.forEach(day => {
    const div = document.createElement('div');
    div.textContent = day;
    div.className = 'header';
    container.appendChild(div);
  });

  for (let i = 0; i < firstDay.getDay(); i++) {
    container.appendChild(document.createElement('div'));
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const div = document.createElement('div');
    div.textContent = i;
    const date = new Date(year, month, i);

    if (isSameDay(date, new Date())) div.classList.add('today');
    if (isSameDay(date, selectedDate)) div.classList.add('selected');
    if (hasHabitsOnDate(date)) div.classList.add('completed');

    div.onclick = () => {
      selectedDate = date;
      renderCalendar();
      renderHabits();
      updateStats();
      updateSelectedDateDisplay();
    };
    container.appendChild(div);
  }
}

function updateSelectedDateDisplay() {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  document.getElementById('selectedDate').textContent =
    "📅 " + selectedDate.toLocaleDateString(undefined, options);
}

function renderHabits() {
  const container = document.getElementById('habitsList');
  container.innerHTML = '';
  if (habits.length === 0) {
    container.innerHTML = '<div class="empty-state">No habits yet — add one above! ✨</div>';
    return;
  }
  habits.forEach(habit => {
    const card = document.createElement('div');
    card.className = 'habit-card';
    if (isHabitCompleted(habit.id, selectedDate)) card.classList.add('completed');

    const checkbox = document.createElement('div');
    checkbox.className = 'habit-checkbox';
    if (isHabitCompleted(habit.id, selectedDate)) checkbox.classList.add('checked');
    checkbox.textContent = isHabitCompleted(habit.id, selectedDate) ? '✔' : '';
    checkbox.onclick = () => toggleHabitCompletion(habit.id);

    const name = document.createElement('div');
    name.textContent = habit.name;
    name.style.flex = '1';
    name.style.textAlign = 'left';
    name.style.fontSize = '14px';

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = '✕';
    del.onclick = () => deleteHabit(habit.id);

    card.append(checkbox, name, del);
    container.appendChild(card);
  });
}

function toggleHabitCompletion(id) {
  const key = selectedDate.toDateString();
  if (!habitCompletions[key]) habitCompletions[key] = [];
  const completed = habitCompletions[key];
  const index = completed.indexOf(id);
  if (index > -1) completed.splice(index, 1);
  else completed.push(id);
  saveData(); renderHabits(); renderCalendar(); updateStats();
}

function isHabitCompleted(id, date) {
  const key = date.toDateString();
  return habitCompletions[key]?.includes(id);
}

function hasHabitsOnDate(date) {
  const key = date.toDateString();
  return habitCompletions[key] && habitCompletions[key].length > 0;
}

function deleteHabit(id) {
  habits = habits.filter(h => h.id !== id);
  for (const key in habitCompletions)
    habitCompletions[key] = habitCompletions[key].filter(hid => hid !== id);
  saveData(); renderHabits(); renderCalendar(); updateStats();
}

function updateStats() {
  const key = selectedDate.toDateString();
  const completed = habitCompletions[key]?.length || 0;
  const total = habits.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  document.getElementById('completedStat').textContent = completed;
  document.getElementById('totalStat').textContent = total;
  document.getElementById('percentStat').textContent = percent + '%';
}

function isSameDay(a, b) {
  return a.getDate() === b.getDate() &&
         a.getMonth() === b.getMonth() &&
         a.getFullYear() === b.getFullYear();
}

function saveData() {
  localStorage.setItem('habits', JSON.stringify(habits));
  localStorage.setItem('habitCompletions', JSON.stringify(habitCompletions));
}
