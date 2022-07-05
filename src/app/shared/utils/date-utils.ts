import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DateUtils {

  dayOfWeek(day: number): string {
    const weekday = new Array(7);
    weekday[0] = 'Neděle';
    weekday[1] = 'Pondělí';
    weekday[2] = 'Úterý';
    weekday[3] = 'Středa';
    weekday[4] = 'Čtvrtek';
    weekday[5] = 'Pátek';
    weekday[6] = 'Sobota';

    return (day !== null) ? weekday[day] : null;
  }

  month(month: number): string {
    const months = new Array(12);
    months[0] = 'Leden';
    months[1] = 'Únor';
    months[2] = 'Březen';
    months[3] = 'Duben';
    months[4] = 'Květen';
    months[5] = 'Červen';
    months[6] = 'Červenec';
    months[7] = 'Srpen';
    months[8] = 'Září';
    months[9] = 'Říjen';
    months[10] = 'Listopad';
    months[11] = 'Prosinec';

    return (month !== null) ? months[month] : null;
  }
}
