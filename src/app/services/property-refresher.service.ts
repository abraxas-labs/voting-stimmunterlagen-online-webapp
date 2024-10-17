/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PropertyRefresherService {
  /**
   * this ensures that a boolean change is detected or retriggered.
   * is required for certain bc components, such as bc-date.
   * ex: ensures that the bc-date error property applies the red border around the form field,
   * after a invalid value is changed to a invalid value.
   */
  public async updateBooleanProperty(component: any, propertyName: string, newValue: boolean): Promise<void> {
    await new Promise(resolve =>
      setTimeout(() => {
        component[propertyName] = !component[propertyName];
        resolve(null);
      }),
    );

    await new Promise(resolve =>
      setTimeout(() => {
        component[propertyName] = newValue;
        resolve(null);
      }),
    );
  }
}
