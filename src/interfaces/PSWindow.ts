export default interface PSWindow extends Window {
  jQuery: JQueryStatic; // jQuery type
  // TODO: specify these functions and add others
  MD_alert: Function;
  MD_confirm: Function;
  DMenu: any; // FOR NOW
}
