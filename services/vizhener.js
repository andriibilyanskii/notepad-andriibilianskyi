export let vizhener = new (function () {
	this.doCrypt = function (isDecrypt, keyStr, text) {
		if (keyStr.length === 0) {
			return;
		}
		let keyArray = filterKey(keyStr);
		if (keyArray.length === 0) {
			return;
		}
		if (isDecrypt) {
			for (let i = 0; i < keyArray.length; i++) keyArray[i] = (26 - keyArray[i]) % 26;
		}
		return crypt(text, keyArray);
	};
	function crypt(input, key) {
		let output = '';
		for (let i = 0, j = 0; i < input.length; i++) {
			let c = input.charCodeAt(i);
			if (isUppercase(c)) {
				output += String.fromCharCode(((c - 65 + key[j % key.length]) % 26) + 65);
				j++;
			} else if (isLowercase(c)) {
				output += String.fromCharCode(((c - 97 + key[j % key.length]) % 26) + 97);
				j++;
			} else {
				output += input.charAt(i);
			}
		}
		return output;
	}
	function filterKey(key) {
		let result = [];
		for (let i = 0; i < key.length; i++) {
			let c = key.charCodeAt(i);
			if (isLetter(c)) result.push((c - 65) % 32);
		}
		return result;
	}
	function isLetter(c) {
		return isUppercase(c) || isLowercase(c);
	}
	function isUppercase(c) {
		return 65 <= c && c <= 90;
	}

	function isLowercase(c) {
		return 97 <= c && c <= 122;
	}
})();
