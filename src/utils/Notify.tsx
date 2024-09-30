
import { toast } from 'react-toastify';

/**
 * Basic notification service
 * Displays the toasts messages
 * Usage:
 *  import Notify from './Notify';
 *  ....
 *  Notify.success("Display Message here")
 * More Info:
 *  https://www.npmjs.com/package/react-toastify
 */
class Notify {

  defaultSettings: any;
  constructor() {
    this.defaultSettings = {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    }
  }

  /**
   * Displays the Information toast message
   * @param msg 
   * @param customSettings 
   */
  public info(msg: string, customSettings?: any) {

    customSettings = this.setup(customSettings);
    toast.info(msg, customSettings);
  }

  /**
   * Displays the Success toast message
   * @param msg 
   * @param customSettings 
   */
  public success(msg: string, customSettings?: any) {

    customSettings = this.setup(customSettings);
    toast.success(msg, customSettings);
  }

  /**
   * Displays the Error toast message
   * @param msg 
   * @param customSettings 
   */
  public error(msg: string, customSettings?: any): void {

    customSettings = this.setup(customSettings);
    toast.error(msg, customSettings);
  }

  private setup(customSettings: any) {

    let settings = Object.assign({}, this.defaultSettings);
    for (let key in customSettings) {
      settings[key] = customSettings[key];
    }
    return settings;
  }
}

export default new Notify();
