/*global console: false */
/*jslint browser: true, nomen: true */
window.$ = window.$ || function (sel) { "use strict"; return document.querySelector(sel); };
window.$$ = window.$$ || function (sel) { "use strict"; return document.querySelectorAll(sel); };
var colourPicker = (function ($, $$) {
	"use strict";
	var ranges = [],
		numbers = [],
		colourRect,
		init = false,
		C;

	C = {
		init: function () {
			if (init) {
				return;
			}
			init = true;

			var colours = ['red', 'green', 'blue'],
				i,
				range,
				number;
			for (i in colours) {
				if (colours.hasOwnProperty(i)) {
					range = document.createElement('input');
					range.id = colours[i];
					range.step = 1;
					range.min = 0;
					range.max = 255;
					range.value = 0;
					range.type = "range";
					ranges[i] = range;

					number = document.createElement('input');
					number.id = colours[i] + 'Num';
					number.step = 1;
					number.min = 0;
					number.max = 255;
					number.value = 0;
					number.type = "number";
					numbers[i] = number;
				}
			}

			colourRect = document.createElement('canvas');
			colourRect.style.width = colourRect.style.height = "50px";
			colourRect.style.border = "1px solid black";

			window.addEventListener("load", function () {
				var i,
					bindEvents,
					storedColours;

				storedColours = (
					(window.localStorage &&
					window.localStorage.getItem('storedColours') &&
					JSON.parse(window.localStorage.getItem('storedColours')) ) ||
					{}
				);
				// add elements and bindings
				bindEvents = function (c, r, n) {
					r.addEventListener('change', function (ev) {
						n.value = r.value;
						C.updateColour();
					});
					n.addEventListener('change', function (ev) {
						r.value = n.value;
						C.updateColour();
					});

					if (storedColours[c]) {
						r.value = storedColours[c];
						n.value = storedColours[c];
					}

					$('body').appendChild(r);
					$('body').appendChild(n);
				};

				for (i in colours) {
					if (colours.hasOwnProperty(i)) {
						bindEvents(colours[i], ranges[i], numbers[i]);
					}
				}

				$('body').appendChild(colourRect);

				C.updateColour();
			});
		},

		updateColour: function () {
			var rgb = 'rgb(' + ranges[0].value + ', ' + ranges[1].value + ', ' + ranges[2].value + ')';
			colourRect.getContext("2d").fillStyle = rgb;
			colourRect.getContext("2d").fillRect(0, 0, colourRect.width, colourRect.height);
			if (window.localStorage) {
				window.localStorage.setItem('storedColours', JSON.stringify({
					red: ranges[0].value,
					green: ranges[1].value,
					blue: ranges[2].value
				}));
			}
		}
	};

	return C;
}(window.$, window.$$));
