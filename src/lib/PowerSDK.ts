import PSWindow from "../interfaces/PSWindow";
import DMenuItem from "../interfaces/DMenuItem";

interface MenuLinkConfig {
  title: string;
  onClick?: Function;
  menuItems?: DMenuItem[];
  href?: string;
}

interface MenuLinkStorageInfo {
  id: string; // identifier for record
  menuLinkElem: HTMLAnchorElement;
  dMenuElem?: HTMLDivElement;
  // dMenuId?: string | null;
}

export default class PowerSDK {
  private psWindow: PSWindow;
  private menuLinkStorage: MenuLinkStorageInfo[];

  constructor(window: PSWindow) {
    this.psWindow = window;
    this.menuLinkStorage = [];
  }

  addMenuLinkToTopBar(menuInfo: MenuLinkConfig) {
    const dMenuIdentifier = menuInfo.menuItems
      ? PowerSDK.generateRandomIdentifier("dMenu")
      : null;
    const topLinkElem = this.createTopLink(
      menuInfo.title,
      menuInfo?.onClick,
      menuInfo?.href,
      dMenuIdentifier
    );
    this.psWindow.document.querySelector(".toplinks")?.appendChild(topLinkElem);
    let dMenuElem;
    if (dMenuIdentifier) {
      dMenuElem = this.createDMenu(
        dMenuIdentifier,
        menuInfo?.menuItems as DMenuItem[]
      );
      this.psWindow.document.querySelector(".toplinks")?.appendChild(dMenuElem);
    }

    // create storage record
    const info: MenuLinkStorageInfo = {
      id: PowerSDK.generateRandomIdentifier("menuLink"),
      menuLinkElem: topLinkElem,
      dMenuElem: dMenuElem,
      // dMenuId: dMenuIdentifier,
    };

    // add to array
    this.menuLinkStorage.push(info);

    return info.id;
  }

  removeMenuLinkFromTopBar(menuLinkStorageId: string) {
    // find menu link item in storage
    const storageItem = this.menuLinkStorage.find(
      (record) => record.id === menuLinkStorageId
    );
    // remove elements
    storageItem?.menuLinkElem.remove();
    storageItem?.dMenuElem?.remove();
    // remove from storage
    this.menuLinkStorage = this.menuLinkStorage
      .slice()
      .filter((record) => record.id !== menuLinkStorageId);
  }

  private createDMenu(id: string, menuItems: DMenuItem[]) {
    const dMenuElem = this.psWindow.document.createElement("div");
    dMenuElem.setAttribute("id", id);
    dMenuElem.setAttribute("role", "menu");
    dMenuElem.setAttribute("taborder", "0");
    dMenuElem.classList.add("dmenu");
    dMenuElem.classList.add("nav");
    dMenuElem.style.display = "none";
    dMenuElem.appendChild(this.psWindow.document.createElement("hr"));

    menuItems.forEach((menuItem, index) => {
      // add menu item to dMenuElem
      dMenuElem.appendChild(this.createDMenuItem(menuItem));

      // add hr element after each item (except for last)
      if (index + 1 !== menuItems.length) {
        dMenuElem.appendChild(this.psWindow.document.createElement("hr"));
      }
    });

    return dMenuElem;
  }

  private createDMenuItem(menuItem: DMenuItem) {
    const self = this; // fix for "this" in jquery thing

    const itemClass = PowerSDK.generateRandomIdentifier("dMenuItem");
    const itemElem = this.psWindow.document.createElement("a");

    itemElem.setAttribute("href", menuItem?.href || "javascript:;");
    itemElem.setAttribute("target", menuItem.openInNewTab ? "_blank" : "");
    itemElem.classList.add("dmoption");
    itemElem.classList.add(itemClass);
    if (menuItem.onClick) {
      // attach event listener where necessary
      this.psWindow
        .jQuery(this.psWindow.document.body)
        .on("click", `.${itemClass}`, function () {
          self.psWindow.DMenu.hide();
          // not super clean, but it works ;)
          (menuItem?.onClick as Function)(...Array.from(arguments));
        });
    }

    const menuItemText = this.psWindow.document.createTextNode(menuItem.name);
    itemElem.appendChild(menuItemText);

    return itemElem;
  }

  private createTopLink(
    title: string,
    onClick?: Function,
    href?: string,
    dMenuName?: string | null
  ) {
    const elem = this.psWindow.document.createElement("a");

    elem.setAttribute("href", href || "/do/dashboard");
    elem.addEventListener("click", function (e) {
      (onClick || function () {})(e);
      if (!href) e.preventDefault();
    });

    const elemText = this.psWindow.document.createTextNode(title);
    elem.appendChild(elemText);

    if (dMenuName && typeof dMenuName === "string") {
      console.log("dMenuName provided: ", dMenuName);
      elem.classList.add("dmbutton");
      elem.setAttribute("data-behavior", "dmenu dmenu_hover");
      elem.setAttribute("data-dmenu-align", "right");
      elem.setAttribute("data-dmenu", dMenuName);
      elem.style.backgroundPosition = "80% 50%";
      elem.setAttribute("aria-haspopup", "true");
      // add icon
      elem.appendChild(this.psWindow.document.createTextNode(" "));
      elem.appendChild(this.psWindow.document.createElement("i"));
    }

    return elem;
  }

  private static generateRandomIdentifier = (identifier: string) =>
    "PowerSDK__" +
    (identifier ? identifier + "_" : "") +
    (Math.random().toString().replace(".", "") + Date.now());
}

// EXAMPLE USAGE:
// const sdk = new PowerSDK(window);
// let menu1 = sdk.addMenuLinkToTopBar({
//   title: "Zane's Menue",
//   onClick: (e) => console.log("event on click", e),
//   menuItems: [
//     {
//       name: "About",
//       onClick: (e) => {
//         console.log(e);
//         MD_alert("about hehe");
//       },
//     },
//     {
//       name: "Settings",
//       onClick: () => MD_alert("settings popup"),
//     },
//   ],
// });
// sdk.removeMenuLinkFromTopBar(menu1); // remove by id
