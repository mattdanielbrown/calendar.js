const html = (s, ...args) => s.map((ss, i) => `${ss}${args[i] || ''}`).join('')

const NUMBER_OF_DAYS_IN_WEEK = 7
const NAME_OF_DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const LONG_NAME_OF_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const renderCalendar = ($target, today) => {
  let html = getCalendarHTML(today)
  // minify html
  html = html.replace(/\n/g, '')
  // replace multiple spaces with single space
  html = html.replace(/\s{2,}/g, ' ')
  $target.innerHTML = html
}

const processDate = (day) => {
  const month = day.getMonth()
  const year = day.getFullYear()
  return {
    lastMonthLastDate: new Date(year, month, 0),
    thisMonthFirstDate: new Date(year, month, 1),
    thisMonthLastDate: new Date(year, month + 1, 0),
    nextMonthFirstDate: new Date(year, month + 1, 1),
  }
}

const getCalendarHTML = (today) => {
  let { lastMonthLastDate, thisMonthFirstDate, thisMonthLastDate, nextMonthFirstDate } =
    processDate(today)
  let calendarContents = []

  for (let d = 0; d < NUMBER_OF_DAYS_IN_WEEK; d++) {
    calendarContents.push(
      html`<div class="${NAME_OF_DAYS[d]} calendar-cell">${LONG_NAME_OF_DAYS[d]}</div>`
    )
  }

  for (let d = 0; d < thisMonthFirstDate.getDay(); d++) {
    calendarContents.push(
      html`<div
        class="
          ${d % 7 === 0 ? 'sun' : ''}
          calendar-cell
          past-month
        "
      >
        ${lastMonthLastDate.getMonth() + 1}/${lastMonthLastDate.getDate() -
        thisMonthFirstDate.getDay() +
        d +
        1}
      </div>`
    )
  }

  for (let d = 0; d < thisMonthLastDate.getDate(); d++) {
    calendarContents.push(
      html`<div
        class="
          ${today.getDate() === d + 1 ? 'today' : ''}
          ${(thisMonthFirstDate.getDay() + d) % 7 === 0 ? 'sun' : ''}
          ${(thisMonthFirstDate.getDay() + d) % 7 === 6 ? 'sat' : ''}
          calendar-cell
          this-month
        "
      >
        ${today.getMonth() + 1}/${d + 1} ${today.getDate() === d + 1 ? ' today' : ''}
      </div>`
    )
  }

  let nextMonthDaysToRender = 7 - (calendarContents.length % 7)

  for (let d = 0; d < nextMonthDaysToRender; d++) {
    calendarContents.push(
      html`<div
        class="
          ${(nextMonthFirstDate.getDay() + d) % 7 === 0 ? 'sun' : ''}
          ${(nextMonthFirstDate.getDay() + d) % 7 === 6 ? 'sat' : ''}
          calendar-cell
          next-month
        "
      >
        ${nextMonthFirstDate.getMonth() + 1}/${d + 1}
      </div>`
    )
  }
  return calendarContents.join('')
}
