/*
  Author: André Kreienbring
  Various helpers
*/

/**
 * The function that is used to trigger highlighting of text on or off
 * @param {Element} searchEl The element in that the given text will be searched
 * @param {string} search The text that is searched in the element and highlighted
 * @param {boolean} on If true the text is highlighted else highlighting is turned off
 */
export const highlightText = (searchEl: Element, search: string, on: boolean) => {
  const regex = new RegExp(search, 'gi');

  //if there's an existing markup, remove it
  const markupEl = document.getElementById('markup');
  if (markupEl && markupEl.parentElement)
    markupEl.parentElement.innerHTML = markupEl.parentElement.innerHTML.replace(
      /(<mark id="markup">|<\/mark>)/gim,
      ''
    );

  let text = searchEl.innerHTML;

  if (on) {
    text = text.replace(regex, '<mark id="markup">$&</mark>');
  } else {
    text = text.replace(/(<mark id="markup">|<\/mark>)/gim, '');
  }
  searchEl.innerHTML = text;
};

/**
 * Make a html child element visible by scrolling a parent element
 * @param {Element} parent The scrollable parent that contains the child element
 * @param {Element} child The child that must be scrolled into view
 * @param threshold
 */
export const scrollParentToChild = (parent: Element, child: Element, threshold = 0): void => {
  // Where is the parent on page
  const parentRect = parent.getBoundingClientRect();
  // What can you see?
  const parentViewableArea = {
    height: parent.clientHeight,
    width: parent.clientWidth,
  };

  // Where is the child
  const childRect = child.getBoundingClientRect();
  // Is the child viewable?
  const isViewableVertically =
    childRect.top >= parentRect.top &&
    childRect.bottom <= parentRect.top + parentViewableArea.height;

  const isViewableHorizontally =
    childRect.left >= parentRect.left &&
    childRect.right <= parentRect.left + parentViewableArea.width;

  // if you can't see the child try to scroll parent
  if (!isViewableVertically || !isViewableHorizontally) {
    // Should we scroll using top or bottom? Find the smaller ABS adjustment
    const scrollTop = childRect.top - parentRect.top;
    const scrollBot = childRect.bottom - parentRect.bottom;
    const scrollLeft = childRect.left - parentRect.left;
    const scrollRight = childRect.right - parentRect.right;

    if (Math.abs(scrollTop) < Math.abs(scrollBot) && Math.abs(scrollLeft) < Math.abs(scrollRight)) {
      // we're nearer to the top and left of the list
      parent.scrollTo({
        top: parent.scrollTop + scrollTop - threshold,
        left: parent.scrollLeft + scrollLeft - threshold,
        behavior: 'smooth',
      });
    } else {
      // we're nearer to the bottom and right of the list
      parent.scrollTo({
        top: parent.scrollTop + scrollBot + threshold,
        left: parent.scrollLeft + scrollRight + threshold,
        behavior: 'smooth',
      });
    }
  }
};

/**
  Checks if the input is an email adress.
  @param {string} email The text that pretends to be an email address.
  @return {boolean} true if the input is a valid email address, false if not.
*/
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

/**
 * Creates a UUID
 * @returns {string} The UUID
 */
// eslint-disable-next-line arrow-body-style
export const createUUID = (): string => {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    // eslint-disable-next-line no-bitwise
    (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16)
  );
};

/**
  Maps a number to a given range (1 - max) of numbers.
  If n > max the result starts from 1 again. Example
  (1, 3) => 1, (2, 3) => 2, (3, 3) => 3, (4, 3) => 1...
  @param {number} n The number that must be mapped to a range
  @param {number} max The maximun number that can be returned
  @returns {number} The initial number n mapped to the range
*/
export const mapNumberToMax = (n: number, max: number): number => {
  if (n < max) {
    return n;
  }
  if (n % max === 0) {
    return max;
  }
  return n % max;
};

/**
  UNUSED
  see: https://dev.to/timothee/using-modulo-to-shift-a-value-and-keep-it-inside-a-range-8fm
  mapNumberToMax2(i, 0, 1, 25) does the same as mapNumberToMax(i, 25)
  @param {number} n The number that must be mapped to a range
  @param {number} offset n is shifted by this amount
  @param {number} min is the lowest value of the desired range
  @param {number} max  is the length of the desired range.
  @returns {number} The initial number n mapped to the range
*/
export const mapNumberToMax2 = (n: number, offset: number, min: number, max: number): number =>
  ((n - min + (offset % max) + max) % max) + min;
