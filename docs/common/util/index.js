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

export function readFileIntoMemory(input, callback, toast) {
  const FILE_MAX_SIZE = 10 * 1024 * 1024;
  const typeReg = /.vue$/i;

  if (window.FileReader) {
    let file = input.files[0];
    if (!typeReg.test(file.name)) {
      return toast('Only support vue file now.', {
        type: 'info'
      });
    }
    if (file.size > FILE_MAX_SIZE) {
      return toast('The max file size is 10M.', {
        type: 'warn'
      });
    }
    let reader = new FileReader();
    reader.onload = function() {
      callback(this.result);
    };
    reader.readAsText(file);
  } else {
    return toast('To get better perfomance, suggest access to it via Chrome.', {
      type: 'info'
    });
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
