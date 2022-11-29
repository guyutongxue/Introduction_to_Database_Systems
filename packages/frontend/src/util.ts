
export function checkPhone(v: string) {
  if (/^[\d-]+$/.test(v)) {
    return true;
  } else {
    return "格式有误";
  }
}
export function checkPassword(v: string) {
  if (v) return true;
  else return "必填项";
}
export function checkName(v: string) {
  if (v) return true;
  else return "必填项";
}

function isNumber(num: unknown) {
  if (typeof num === 'number') {
    return num - num === 0;
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isFinite(+num);
  }
  return false;
}
export function checkNumber(v: string) {
  if (isNumber(v)) return true;
  else return "格式有误";
}
