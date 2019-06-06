export function classes(...classNames) {
  return classNames
    .map(className => {
      if (className) {
        return className;
      }
    })
    .join(' ')
    .trim();
}

export function readFileIntoMemory(input, callback) {
  if (window.FileReader) {
    // support chrome IE10
    let file = input.files[0];
    let reader = new FileReader();
    reader.onload = function() {
      callback(this.result);
    };
    reader.readAsText(file);
  } else if (typeof window.ActiveXObject != 'undefined') {
    // support IE 7 8 9 10
    let xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
    xmlDoc.async = false;
    xmlDoc.load(input.value);
    callback(xmlDoc.xml);
  } else if (
    document.implementation &&
    document.implementation.createDocument
  ) {
    // support FF
    let xmlDoc = document.implementation.createDocument('', '', null);
    xmlDoc.async = false;
    xmlDoc.load(input.value);
    callback(xmlDoc.xml);
  } else {
    console.log('read file error');
  }
}

export function transformDataToDownloadFile(data) {
  const tag = document.createElement('a');

  tag.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + JSON.stringify(data)
  );
  tag.setAttribute('download', 'react.js');
  tag.style.display = 'none';
  document.body.appendChild(tag);
  tag.click();
  document.body.removeChild(tag);
}

export function copyDataToClipBoard(data, callback) {
  const input = document.createElement('input');
  document.body.appendChild(input);
  input.setAttribute('value', data);
  input.select();
  if (document.execCommand('copy')) {
    document.execCommand('copy');
  }
  callback(document.execCommand('copy'));
  document.body.removeChild(input);
}
