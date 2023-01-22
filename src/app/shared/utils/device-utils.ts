import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DeviceUtils {

  get isDesktop(): Boolean {
    const regex_mobile = new RegExp(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/, 'i');
    return !regex_mobile.test(window.navigator.userAgent);
  }
}
