const FullMonths = [
  'Januari',
  'Februari',
  'Maart',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Augustus',
  'September',
  'Oktober',
  'November',
  'December'
];

interface IEvents {
  [date: string]: string;
}

class Calendar {
  constructor(public birthdays: Record<string, string> = {}) { this.render() }
  public activeYear = new Date().getFullYear();
  public activeMonth = new Date().getMonth();

  /**
   * Differ to nextmonth. Sadly accessor are not available
   * @param diff Differential to add/remove
   */
  nextMont(diff = 1) {
    const month = this.activeMonth + diff;
    if (month > 11) {
      this.activeYear++;
      this.activeMonth = 0;
    } else if (month < 0) {
      this.activeYear--;
      this.activeMonth = 11;
    } else this.activeMonth = month;
    this.render();
  }

  getBirthday(date: Date) {
    const birthdays = Object.keys(this.birthdays);
    const dateStr = date.toISOString().split('T')[0].slice(-5);
    return birthdays.find(v => v.endsWith(dateStr))
  }

  render() {
    $('caption.calendar__banner--month h1').html(FullMonths[this.activeMonth]);
    const offset = new Date(this.activeYear, this.activeMonth, 0).getDay();

    $('tbody tr').each((week, el) => {
      $(el).find('td').each((day, el) => {
        const totalDays = week * 7 + day - offset;
        const date = new Date(this.activeYear, this.activeMonth, totalDays, 3); // UTC offset of 3 hours.
        el.innerHTML = date.getDate().toString();
        el.classList.toggle('dim-day', date.getMonth() !== this.activeMonth);
        el.removeAttribute('data-event');

        const birthday = this.getBirthday(date);
        console.log(date, date.toISOString().split('T')[0])
        if (birthday) el.setAttribute('data-event', this.birthdays[birthday]);
      })
    });
  }

}

void (async function () {
  const birthdays = await fetch('/birthdays.json').then(v => v.json());
  console.log(birthdays);
  const calendar = new Calendar(birthdays);

  $('.btn.next').click(() => { calendar.nextMont(+1); })
  $('.btn.prev').click(() => { calendar.nextMont(-1); })
})();