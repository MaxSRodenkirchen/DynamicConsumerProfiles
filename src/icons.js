/**
 * IBM Carbon Icons Integration (Weg 1: @carbon/icons)
 * Alle Icons werden direkt aus dem offiziellen IBM Carbon Design System importiert.
 */
import home32 from '@carbon/icons/es/home/32.js';
import user32 from '@carbon/icons/es/user/32.js';
import taskComplete32 from '@carbon/icons/es/task--complete/32.js';
import image32 from '@carbon/icons/es/image/32.js';
import network3_32 from '@carbon/icons/es/network--3/32.js';
import add32 from '@carbon/icons/es/add/32.js';
import arrowRight32 from '@carbon/icons/es/arrow--right/32.js';
import camera32 from '@carbon/icons/es/camera/32.js';
import trashCan32 from '@carbon/icons/es/trash-can/32.js';
import chevronDown32 from '@carbon/icons/es/chevron--down/32.js';
import information32 from '@carbon/icons/es/information/32.js';
import renew32 from '@carbon/icons/es/renew/32.js';
import close32 from '@carbon/icons/es/close/32.js';
import checkmark32 from '@carbon/icons/es/checkmark/32.js';
import save32 from '@carbon/icons/es/save/32.js';
import filter32 from '@carbon/icons/es/filter/32.js';
import upload32 from '@carbon/icons/es/upload/32.js';
import link32 from '@carbon/icons/es/link/32.js';
import code32 from '@carbon/icons/es/code/32.js';
import edit32 from '@carbon/icons/es/edit/32.js';

export const DESCRIPTORS = {
  home: home32,
  user: user32,
  taskComplete: taskComplete32,
  image: image32,
  network: network3_32,
  add: add32,
  arrowRight: arrowRight32,
  camera: camera32,
  trashCan: trashCan32,
  chevronDown: chevronDown32,
  information: information32,
  renew: renew32,
  close: close32,
  checkmark: checkmark32,
  save: save32,
  filter: filter32,
  upload: upload32,
  link: link32,
  code: code32,
  edit: edit32
};

/**
 * Wandelt einen offiziellen Carbon Icon Descriptor in einen sauberen SVG-String um.
 */
export function renderCarbonIcon(descriptor, {
  className = 'carbon-icon',
  size = null,
  extraAttrs = {},
  ariaHidden = true
} = {}) {
  if (!descriptor) return '';

  const attrs = {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: descriptor.attrs?.viewBox || '0 0 32 32',
    fill: 'currentColor',
    class: className,
    ...extraAttrs
  };

  if (size) {
    attrs.width = size;
    attrs.height = size;
  }
  if (ariaHidden) {
    attrs['aria-hidden'] = 'true';
  }

  const attrStr = Object.entries(attrs)
    .filter(([_, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ');

  const contentStr = (descriptor.content || [])
    .map(child => {
      const childAttrs = Object.entries(child.attrs || {})
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ');
      return `<${child.elem} ${childAttrs}></${child.elem}>`;
    })
    .join('');

  return `<svg ${attrStr}>${contentStr}</svg>`;
}

/**
 * Bequemer Helfer für SVG nach Icon-Namen
 */
export function icon(name, options = {}) {
  const desc = DESCRIPTORS[name];
  if (!desc) {
    console.warn(`[CarbonIcons] Icon "${name}" nicht gefunden.`);
    return '';
  }
  return renderCarbonIcon(desc, options);
}

/**
 * Vorkonfigurierte SVG-Strings für schnelle Einbindung in Templates & innerHTML
 */
export const ICONS = {
  home: renderCarbonIcon(home32, { className: 'carbon-icon' }),
  user: renderCarbonIcon(user32, { className: 'carbon-icon' }),
  taskComplete: renderCarbonIcon(taskComplete32, { className: 'carbon-icon' }),
  image: renderCarbonIcon(image32, { className: 'carbon-icon' }),
  network: renderCarbonIcon(network3_32, { className: 'carbon-icon' }),
  add: renderCarbonIcon(add32, { className: 'carbon-icon' }),
  arrowRight: renderCarbonIcon(arrowRight32, { className: 'carbon-icon' }),
  camera: renderCarbonIcon(camera32, { className: 'carbon-icon' }),
  trashCan: renderCarbonIcon(trashCan32, { className: 'carbon-icon' }),
  chevronDown: renderCarbonIcon(chevronDown32, { className: 'carbon-icon' }),
  chevronDownSm: renderCarbonIcon(chevronDown32, { className: 'carbon-icon-sm' }),
  information: renderCarbonIcon(information32, { className: 'carbon-icon' }),
  informationSm: renderCarbonIcon(information32, { className: 'carbon-icon-sm' }),
  renew: renderCarbonIcon(renew32, { className: 'carbon-icon' }),
  renewSm: renderCarbonIcon(renew32, { className: 'carbon-icon-sm' }),
  close: renderCarbonIcon(close32, { className: 'carbon-icon' }),
  closeSm: renderCarbonIcon(close32, { className: 'carbon-icon-sm' }),
  checkmark: renderCarbonIcon(checkmark32, { className: 'carbon-icon' }),
  checkmarkSm: renderCarbonIcon(checkmark32, { className: 'carbon-icon-sm' }),
  save: renderCarbonIcon(save32, { className: 'carbon-icon' }),
  filter: renderCarbonIcon(filter32, { className: 'carbon-icon' }),
  upload: renderCarbonIcon(upload32, { className: 'carbon-icon' }),
  link: renderCarbonIcon(link32, { className: 'carbon-icon' }),
  code: renderCarbonIcon(code32, { className: 'carbon-icon' }),
  edit: renderCarbonIcon(edit32, { className: 'carbon-icon' })
};

