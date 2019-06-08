import * as React from 'react';

export const classes = (...arr: any[]) => arr.filter(v => v).join(' ');

export function readFileIntoMemory(
  inputRef: React.MutableRefObject<any>,
  callback: (val: string) => void,
  toast: any
) {
  const FILE_MAX_SIZE = 10 * 1024 * 1024;
  const typeReg = /.vue$/i;

  if ((window as any).FileReader) {
    let file = inputRef.current.files[0];
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
      if (typeof this.result === 'string') {
        callback(this.result);
      }
    };
    reader.readAsText(file);
  } else {
    return toast('To get better perfomance, suggest access to it via Chrome.', {
      type: 'info'
    });
  }
}

export function transformDataToDownloadFile(data: string) {
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

export function copyDataToClipBoard(
  data: string,
  callback: (result: boolean) => void
) {
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
